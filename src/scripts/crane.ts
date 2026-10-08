import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Grúa torre procedural, sin marca y sin modelos externos.
 * Unidades arbitrarias (1 ≈ 1 m). La mástil mide MAST_H y la pluma sale hacia +x.
 */
const MAST_H = 21.5
const JIB_Y = 0.5 // altura de la cuerda inferior de la pluma sobre la cabeza del mástil
const TROLLEY_X = 9.2

const v = (x: number, y: number, z: number) => new Vector3(x, y, z)
const Z = v(0, 0, 1)

/** Viga de sección cuadrada entre dos puntos (como geometría ya colocada). */
function beam(a: Vector3, b: Vector3, t: number): BufferGeometry {
  const dir = b.clone().sub(a)
  const len = dir.length()
  const g = new BoxGeometry(t, t, len)
  const q = new Quaternion().setFromUnitVectors(Z, dir.normalize())
  g.applyMatrix4(new Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, v(1, 1, 1)))
  return g
}

function mastGeometry(h: number, w: number, sec: number, t: number): BufferGeometry {
  const parts: BufferGeometry[] = []
  const o = w / 2
  const c = [[-o, -o], [o, -o], [o, o], [-o, o]]
  for (const [x, z] of c) parts.push(beam(v(x, 0, z), v(x, h, z), t * 1.7))
  const n = Math.round(h / sec)
  const dy = h / n
  for (let i = 0; i <= n; i++) {
    for (let k = 0; k < 4; k++) {
      const a = c[k], b = c[(k + 1) % 4]
      parts.push(beam(v(a[0], i * dy, a[1]), v(b[0], i * dy, b[1]), t))
    }
  }
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 4; k++) {
      const a = c[k], b = c[(k + 1) % 4]
      const flip = (i + k) % 2 === 0
      const lo = flip ? a : b, hi = flip ? b : a
      parts.push(beam(v(lo[0], i * dy, lo[1]), v(hi[0], (i + 1) * dy, hi[1]), t * 0.8))
    }
  }
  return mergeGeometries(parts)!
}

/** Celosía triangular (vértice arriba) entre x0 y x1; hAt/wAt dan altura y semiancho en cada x. */
function trussGeometry(
  x0: number, x1: number, step: number,
  hAt: (x: number) => number, wAt: (x: number) => number, t: number,
): BufferGeometry {
  const parts: BufferGeometry[] = []
  const n = Math.max(2, Math.round(Math.abs(x1 - x0) / step))
  const st = (i: number) => {
    const x = x0 + ((x1 - x0) * i) / n
    return { T: v(x, JIB_Y + hAt(x), 0), L: v(x, JIB_Y, -wAt(x)), R: v(x, JIB_Y, wAt(x)) }
  }
  for (let i = 0; i <= n; i++) {
    const s = st(i)
    parts.push(beam(s.T, s.L, t * 0.75), beam(s.T, s.R, t * 0.75), beam(s.L, s.R, t * 0.75))
    if (i === n) break
    const q = st(i + 1)
    parts.push(beam(s.T, q.T, t * 1.5), beam(s.L, q.L, t * 1.2), beam(s.R, q.R, t * 1.2))
    if (i % 2 === 0) parts.push(beam(s.T, q.L, t * 0.8), beam(s.T, q.R, t * 0.8), beam(s.L, q.R, t * 0.8))
    else parts.push(beam(s.L, q.T, t * 0.8), beam(s.R, q.T, t * 0.8), beam(s.R, q.L, t * 0.8))
  }
  return mergeGeometries(parts)!
}

export interface CraneStage {
  /** Posición del gancho en píxeles, relativa al lienzo. */
  anchor(): { x: number; y: number }
  render(timeSeconds: number): void
  resize(): void
  dispose(): void
}

export function mountCrane(canvas: HTMLCanvasElement, opts: { animate: boolean }): CraneStage {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  const scene = new Scene()
  const camera = new PerspectiveCamera(26, 1, 1, 200)

  // luz de atardecer: principal cálida de frente y contraluz azulada
  scene.add(new HemisphereLight(0x9fb2d4, 0x1a1d24, 0.9))
  scene.add(new AmbientLight(0xffffff, 0.15))
  const key = new DirectionalLight(0xfff0d6, 2.6)
  key.position.set(-18, 26, 30)
  scene.add(key)
  const rim = new DirectionalLight(0x6f93ff, 1.4)
  rim.position.set(22, 14, -24)
  scene.add(rim)

  const yellow = new MeshStandardMaterial({ color: 0xf5b50a, roughness: 0.5, metalness: 0.3 })
  const steel = new MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.55, metalness: 0.7 })
  const rope = new MeshStandardMaterial({ color: 0x9aa1ab, roughness: 0.4, metalness: 0.8 })
  const concrete = new MeshStandardMaterial({ color: 0x8a8f97, roughness: 0.95, metalness: 0 })
  const glass = new MeshStandardMaterial({ color: 0x142234, roughness: 0.15, metalness: 0.9 })
  const lamp = new MeshStandardMaterial({ color: 0x3a0a0a, emissive: 0xff2a1a, emissiveIntensity: 1 })

  const crane = new Group()
  scene.add(crane)

  // mástil y base
  crane.add(new Mesh(mastGeometry(MAST_H, 1.3, 1.5, 0.09), yellow))
  const base = new Mesh(new BoxGeometry(3.4, 0.7, 3.4), concrete)
  base.position.y = 0.35
  crane.add(base)

  // parte giratoria
  const top = new Group()
  top.position.y = MAST_H
  crane.add(top)

  const ring = new Mesh(new CylinderGeometry(1.0, 1.1, 0.5, 24), steel)
  ring.position.y = 0.25
  top.add(ring)

  const jibTaper = (x: number) => 1.15 - 0.6 * Math.min(1, Math.max(0, (x - 0.8) / 20.2))
  const jibWidth = (x: number) => 0.8 - 0.35 * Math.min(1, Math.max(0, (x - 0.8) / 20.2))
  top.add(new Mesh(trussGeometry(0.8, 21, 1.35, jibTaper, jibWidth, 0.07), yellow))
  top.add(new Mesh(trussGeometry(-8.2, -0.8, 1.25, () => 0.7, () => 0.6, 0.07), yellow))

  // contrapeso de hormigón y casa de máquinas
  for (const x of [-6.3, -7.45]) {
    const b = new Mesh(new BoxGeometry(1.05, 1.5, 1.7), concrete)
    b.position.set(x, JIB_Y - 0.95, 0)
    top.add(b)
  }
  const machine = new Mesh(new BoxGeometry(2.8, 1.1, 1.7), steel)
  machine.position.set(-3.4, JIB_Y + 0.55, 0)
  top.add(machine)

  // cabina
  const cab = new Mesh(new BoxGeometry(1.5, 1.3, 1.1), yellow)
  cab.position.set(1.7, JIB_Y - 0.85, 1.35)
  top.add(cab)
  const win1 = new Mesh(new BoxGeometry(0.9, 0.7, 0.04), glass)
  win1.position.set(1.7, JIB_Y - 0.75, 1.9)
  top.add(win1)
  const win2 = new Mesh(new BoxGeometry(0.04, 0.7, 0.7), glass)
  win2.position.set(2.46, JIB_Y - 0.75, 1.35)
  top.add(win2)

  // torre de tirantes y tirantes (pendolones)
  const apex = v(0, JIB_Y + 4.8, 0)
  const cat: BufferGeometry[] = []
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cat.push(beam(v(sx * 0.55, JIB_Y + 0.9, sz * 0.55), apex, 0.11))
  top.add(new Mesh(mergeGeometries(cat)!, yellow))
  const ties: BufferGeometry[] = [
    beam(apex, v(6.5, JIB_Y + jibTaper(6.5), 0), 0.04),
    beam(apex, v(15.5, JIB_Y + jibTaper(15.5), 0), 0.04),
    beam(apex, v(-8.2, JIB_Y + 0.7, 0), 0.04),
  ]
  top.add(new Mesh(mergeGeometries(ties)!, rope))
  const light = new Mesh(new SphereGeometry(0.14, 12, 12), lamp)
  light.position.copy(apex).add(v(0, 0.2, 0))
  top.add(light)

  // carro, cables y gancho
  const trolleyY = JIB_Y - 0.2
  const trolley = new Mesh(new BoxGeometry(1.1, 0.35, 0.9), steel)
  top.add(trolley)
  const cableGeo = new BoxGeometry(0.045, 1, 0.045)
  const cables = [new Mesh(cableGeo, rope), new Mesh(cableGeo, rope)]
  cables.forEach(c => top.add(c))
  const block = new Group()
  top.add(block)
  const blockBody = new Mesh(new BoxGeometry(0.62, 0.8, 0.34), yellow)
  block.add(blockBody)
  const sheave = new Mesh(new CylinderGeometry(0.2, 0.2, 0.4, 16), steel)
  sheave.rotation.x = Math.PI / 2
  sheave.position.y = 0.15
  block.add(sheave)
  const hook = new Mesh(new TorusGeometry(0.2, 0.065, 10, 24, Math.PI * 1.45), steel)
  hook.position.set(0, -0.78, 0)
  hook.rotation.z = Math.PI * 0.62
  block.add(hook)
  const shank = new Mesh(new CylinderGeometry(0.06, 0.06, 0.4, 8), steel)
  shank.position.y = -0.5
  block.add(shank)
  // punto de anclaje: el seno del gancho
  const anchorObj = new Object3D()
  anchorObj.position.set(0, -0.98, 0)
  block.add(anchorObj)

  const target = v(5.2, 12.2, 0)
  const tmp = v(0, 0, 0)
  let w = 1, h = 1

  const place = (t: number) => {
    top.rotation.y = Math.sin(t * 0.11) * 0.03
    const tx = TROLLEY_X + Math.sin(t * 0.17) * 1.0
    const drop = 3.1 + Math.sin(t * 0.23) * 0.18
    trolley.position.set(tx, trolleyY, 0)
    cables.forEach((c, i) => {
      c.scale.y = drop
      c.position.set(tx, trolleyY - drop / 2, i ? 0.13 : -0.13)
    })
    block.position.set(tx, trolleyY - drop - 0.4, 0)
    block.rotation.z = Math.sin(t * 0.9) * 0.012
    lamp.emissiveIntensity = 0.35 + 0.65 * Math.max(0, Math.sin(t * 2.2))
  }

  const resize = () => {
    const r = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width))
    h = Math.max(1, Math.round(r.height))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.set(target.x + 4, 8.6, 47)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }

  return {
    anchor() {
      scene.updateMatrixWorld()
      anchorObj.getWorldPosition(tmp)
      tmp.project(camera)
      return { x: (tmp.x * 0.5 + 0.5) * w, y: (-tmp.y * 0.5 + 0.5) * h }
    },
    render(t) {
      place(opts.animate ? t : 0)
      renderer.render(scene, camera)
    },
    resize,
    dispose() {
      renderer.dispose()
      scene.traverse(o => {
        const m = o as Mesh
        m.geometry?.dispose()
      })
    },
  }
}
