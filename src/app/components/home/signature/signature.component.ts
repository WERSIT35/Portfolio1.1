import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

/**
 * Signature — a monochrome interactive point-cloud sphere rendered with WebGL (ogl).
 *
 * It is the one "signature moment" of the home bento. Everything about it is
 * defensive: WebGL is dynamically imported so it never touches the initial
 * bundle, the render loop only runs while the tile is on-screen AND the tab is
 * visible, and reduced-motion / no-WebGL / coarse-pointer devices fall back to
 * a single static frame (or nothing) instead of a janky loop.
 */
@Component({
  selector: 'app-signature',
  standalone: true,
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.scss',
})
export class SignatureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly theme = inject(ThemeService);

  /** Set true once WebGL is live; drives the CSS fallback dot-grid otherwise. */
  failed = false;

  private io?: IntersectionObserver;
  private rafId = 0;
  private onScene?: SceneHandle;
  private visible = false;
  private reduced = false;

  // Pointer state (target + smoothed) in -1..1 space.
  private pTargetX = 0;
  private pTargetY = 0;
  private pX = 0;
  private pY = 0;

  constructor() {
    // Re-tint the cloud whenever the resolved theme flips (no re-init needed).
    effect(() => {
      const resolved = this.theme.resolved();
      this.onScene?.setInk(resolved === 'dark');
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Only spin up the GL scene once the tile is actually near the viewport.
    this.io = new IntersectionObserver(
      (entries) => {
        const onScreen = entries.some((e) => e.isIntersecting);
        this.visible = onScreen;
        if (onScreen && !this.onScene && !this.failed) {
          void this.boot();
        }
        this.syncLoop();
      },
      { rootMargin: '200px' },
    );
    this.io.observe(this.canvasRef.nativeElement);

    document.addEventListener('visibilitychange', this.onVisibility, { passive: true });
    window.addEventListener('pointermove', this.onPointer, { passive: true });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.onPointer);
    }
    this.onScene?.dispose();
    this.onScene = undefined;
  }

  private readonly onVisibility = (): void => this.syncLoop();

  private readonly onPointer = (e: PointerEvent): void => {
    this.pTargetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.pTargetY = (e.clientY / window.innerHeight) * 2 - 1;
  };

  /** Dynamic-import ogl and assemble the scene. Falls back gracefully on any error. */
  private async boot(): Promise<void> {
    try {
      const ogl = await import('ogl');
      this.onScene = createScene(ogl, this.canvasRef.nativeElement);
      this.onScene.setInk(this.theme.resolved() === 'dark');

      if (this.reduced) {
        // Reduced-motion: render one still frame and never loop.
        this.onScene.render(0, 0, 0);
      } else {
        this.syncLoop();
      }
    } catch {
      this.failed = true;
      this.onScene?.dispose();
      this.onScene = undefined;
    }
  }

  /** Start or stop the RAF loop based on visibility + tab focus + reduced-motion. */
  private syncLoop(): void {
    const shouldRun =
      !!this.onScene &&
      this.visible &&
      !this.reduced &&
      typeof document !== 'undefined' &&
      !document.hidden;

    if (shouldRun && !this.rafId) {
      this.rafId = requestAnimationFrame(this.frame);
    } else if (!shouldRun && this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private readonly frame = (t: number): void => {
    this.rafId = 0;
    if (!this.onScene) return;

    // Smooth the pointer so motion stays calm and cinematic.
    this.pX += (this.pTargetX - this.pX) * 0.05;
    this.pY += (this.pTargetY - this.pY) * 0.05;

    this.onScene.render(t * 0.001, this.pX, this.pY);
    this.syncLoop();
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   GL scene — kept as a plain factory (not Angular-aware) so it can lean on
   ogl's loosely-typed runtime without dragging `any` into the component class.
   ────────────────────────────────────────────────────────────────────────── */

interface SceneHandle {
  render(time: number, pointerX: number, pointerY: number): void;
  setInk(dark: boolean): void;
  dispose(): void;
}

// `ogl` ships without first-class types for our usage; treat the module loosely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createScene(ogl: any, canvas: HTMLCanvasElement): SceneHandle {
  const { Renderer, Camera, Geometry, Program, Mesh } = ogl;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderer = new Renderer({ canvas, dpr, alpha: true, antialias: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const camera = new Camera(gl, { fov: 32 });
  camera.position.set(0, 0, 5);

  // Fewer points on phones / low-power devices.
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const count = coarse ? 1800 : 3600;

  // Fibonacci sphere → evenly distributed point cloud.
  const positions = new Float32Array(count * 3);
  const rnd = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
    rnd[i] = Math.random();
  }

  const geometry = new Geometry(gl, {
    position: { size: 3, data: positions },
    aRnd: { size: 1, data: rnd },
  });

  const program = new Program(gl, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    transparent: true,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: [0, 0] },
      uDpr: { value: dpr },
      uSize: { value: coarse ? 62 : 78 },
      uColor: { value: [0.04, 0.04, 0.05] },
    },
  });

  const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

  const resize = (): void => {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || canvas.clientWidth || 300;
    const h = parent?.clientHeight || canvas.clientHeight || 300;
    renderer.setSize(w, h);
    camera.perspective({ aspect: w / h });
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);

  let rotY = 0;
  let rotX = 0;

  return {
    render(time: number, px: number, py: number): void {
      program.uniforms.uTime.value = time;
      program.uniforms.uPointer.value[0] = px;
      program.uniforms.uPointer.value[1] = py;

      // Slow idle rotation + gentle pointer-driven tilt.
      rotY += 0.0016;
      rotX += (py * 0.45 - rotX) * 0.04;
      mesh.rotation.y = rotY + px * 0.5;
      mesh.rotation.x = rotX;

      renderer.render({ scene: mesh, camera });
    },
    setInk(dark: boolean): void {
      // Dark theme → porcelain points; light theme → near-black ink.
      program.uniforms.uColor.value = dark ? [0.96, 0.96, 0.97] : [0.04, 0.04, 0.05];
    },
    dispose(): void {
      ro.disconnect();
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext?.();
    },
  };
}

const VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute float aRnd;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uSize;
  uniform float uDpr;

  varying float vAlpha;

  // Classic Ashima simplex noise (3D).
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 dir = normalize(position);
    float n = snoise(position * 1.4 + uTime * 0.18);
    float ripple = snoise(position * 3.0 - uTime * 0.1) * 0.12;

    // Breathing displacement along the radius.
    vec3 p = position + dir * (n * 0.34 + ripple);

    // Pointer "magnet" — points lean toward the cursor a touch.
    p.xy += uPointer * 0.18 * (aRnd * 0.5 + 0.5);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (aRnd * 0.7 + 0.5) * uDpr;
    gl_PointSize = size / max(-mv.z, 0.1);

    vAlpha = clamp(0.32 + n * 0.55, 0.08, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.08, d);
    if (a <= 0.001) discard;
    gl_FragColor = vec4(uColor, a * vAlpha);
  }
`;
