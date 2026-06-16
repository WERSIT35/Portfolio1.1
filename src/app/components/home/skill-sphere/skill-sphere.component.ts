import {
  AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, PLATFORM_ID, ViewChild, inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface SkillChip { name: string; icon: string; }
interface Node { el: HTMLElement; x: number; y: number; z: number; }

/**
 * A CSS-3D tag sphere of the skill chips — auto-rotates, drag to spin, with
 * depth fade. Uses the real devicon chips (no extra WebGL context). Falls back
 * to a static grid for reduced-motion / touch devices.
 */
@Component({
  selector: 'app-skill-sphere',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-sphere.component.html',
  styleUrl: './skill-sphere.component.scss',
})
export class SkillSphereComponent implements AfterViewInit, OnDestroy {
  @Input() skills: SkillChip[] = [];
  @ViewChild('stage') private stageRef?: ElementRef<HTMLElement>;

  flat = false;

  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);

  private nodes: Node[] = [];
  private raf = 0;
  private radius = 130;
  private rx = -0.35; private ry = 0;
  private vx = 0; private vy = 0.0026;     // idle spin velocity
  private dragging = false;
  private lastPX = 0; private lastPY = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) { this.flat = true; return; }

    const stage = this.stageRef?.nativeElement;
    if (!stage) return;
    this.radius = Math.min(180, Math.max(130, stage.clientWidth * 0.36));

    const els = Array.from(stage.querySelectorAll<HTMLElement>('.ss-item'));
    const n = els.length || 1;
    const golden = Math.PI * (3 - Math.sqrt(5));
    els.forEach((el, i) => {
      const y = 1 - (i / Math.max(1, n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const t = golden * i;
      this.nodes.push({ el, x: Math.cos(t) * r, y, z: Math.sin(t) * r });
    });

    this.zone.runOutsideAngular(() => {
      stage.addEventListener('pointerdown', this.onDown);
      window.addEventListener('pointermove', this.onMove, { passive: true });
      window.addEventListener('pointerup', this.onUp, { passive: true });
      this.raf = requestAnimationFrame(this.tick);
    });
  }

  ngOnDestroy(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    this.stageRef?.nativeElement.removeEventListener('pointerdown', this.onDown);
  }

  private readonly onDown = (e: PointerEvent): void => {
    this.dragging = true;
    this.lastPX = e.clientX; this.lastPY = e.clientY;
  };
  private readonly onMove = (e: PointerEvent): void => {
    if (!this.dragging) return;
    this.vy = (e.clientX - this.lastPX) * 0.0006;
    this.vx = -(e.clientY - this.lastPY) * 0.0006;
    this.lastPX = e.clientX; this.lastPY = e.clientY;
  };
  private readonly onUp = (): void => { this.dragging = false; };

  private readonly tick = (): void => {
    // idle drift back toward a gentle auto-spin when not dragging
    if (!this.dragging) {
      this.vy += (0.0026 - this.vy) * 0.02;
      this.vx += (0 - this.vx) * 0.04;
    }
    this.ry += this.vy;
    this.rx += this.vx;
    this.rx = Math.max(-1.1, Math.min(1.1, this.rx));

    const cy = Math.cos(this.ry), sy = Math.sin(this.ry);
    const cx = Math.cos(this.rx), sx = Math.sin(this.rx);

    for (const node of this.nodes) {
      // rotate around Y then X
      const x1 = node.x * cy + node.z * sy;
      const z1 = -node.x * sy + node.z * cy;
      const y2 = node.y * cx - z1 * sx;
      const z2 = node.y * sx + z1 * cx;

      const depth = (z2 + 1) / 2;                       // 0 (back) … 1 (front)
      // translate(-50%,-50%) centres each chip on its point regardless of width
      node.el.style.transform =
        `translate(-50%, -50%) translate3d(${(x1 * this.radius).toFixed(1)}px, ${(y2 * this.radius).toFixed(1)}px, ${(z2 * this.radius).toFixed(1)}px)`;
      node.el.style.opacity = (0.12 + depth * 0.88).toFixed(2);   // back chips recede harder
      node.el.style.zIndex = `${Math.round(depth * 100)}`;
      node.el.style.pointerEvents = depth > 0.5 ? 'auto' : 'none';
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
