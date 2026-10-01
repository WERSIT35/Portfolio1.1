import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CERTIFICATIONS } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Deck spring (per 60fps frame, dt-normalised): a heavy card with a slight settle —
// ~3.6% overshoot, 90% there at ~220ms, fully at rest by ~530ms.
const SPRING_STIFFNESS = 0.05;
const SPRING_DAMPING = 0.74;
// Tilt / glare trail the pointer (lerp per frame).
const TILT_FOLLOW = 0.1;
const MAX_TILT_DEG = 8;
// Stack geometry for plates behind the front one (per step back).
const STACK_Y_PX = 22;
const STACK_Z_PX = 90;
const STACK_SCALE = 0.055;
const STACK_VISIBLE = 4;
// Peel: rotate around the left edge, lift toward the viewer, fade out.
const PEEL_ROTATE_DEG = 75;
const PEEL_LIFT_Z_PX = 140;
const PEEL_SHIFT_PCT = 18;
// Dragging: how far (fraction of deck width) equals one card; flick projection.
const DRAG_CARD_FRACTION = 0.6;
const FLICK_PROJECTION_MS = 180;
const TAP_SLOP_PX = 6;

const yearOf = (issued: string) => Number(issued.match(/\d{4}/)?.[0] ?? 0);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

@Component({
  selector: 'app-certifications-section',
  standalone: true,
  imports: [SpySectionDirective],
  templateUrl: './certifications-section.html',
  styleUrl: './certifications-section.scss',
})
export class CertificationsSection {
  // Newest first; ties keep their data order.
  protected readonly certs = CERTIFICATIONS.map((cert, order) => ({ cert, order }))
    .sort((a, b) => yearOf(b.cert.issued) - yearOf(a.cert.issued) || a.order - b.order)
    .map(({ cert }, i) => ({
      ...cert,
      title: cert.imageName[0] ?? cert.name,
      plate: cert.image[0],
      full: cert.image[1] ?? cert.image[0],
      index: String(i + 1).padStart(2, '0'),
      // External credential page vs. a local PDF/scan.
      verifyUrl: cert.certificateUrl?.startsWith('http') ? cert.certificateUrl : null,
      pdfUrl: cert.certificateUrl?.endsWith('.pdf') ? cert.certificateUrl : null,
    }));
  protected readonly count = String(this.certs.length).padStart(2, '0');

  /** Integer card the deck is heading to (drives text, controls and a11y). */
  protected readonly active = signal(0);
  protected readonly current = computed(() => this.certs[this.active()]);
  protected readonly lit = signal(false);
  protected readonly lightbox = signal<number | null>(null);

  private readonly deck = viewChild.required<ElementRef<HTMLElement>>('deck');
  private readonly plates = viewChildren<ElementRef<HTMLElement>>('plate');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  // Continuous deck position: 0 = first card in front, 1 = first card fully peeled.
  private pos = 0;
  private vel = 0;
  private readonly tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  private readonly glare = { x: 50, y: 30, tx: 50, ty: 30 };
  private frame = 0;
  private lastFrame = 0;
  private motionEnabled = false;

  private drag: { startX: number; startPos: number; lastX: number; lastT: number; v: number; moved: boolean } | null =
    null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.motionEnabled) this.render();
      destroyRef.onDestroy(() => cancelAnimationFrame(this.frame));
    });
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  protected go(index: number): void {
    const next = clamp(index, 0, this.certs.length - 1);
    this.active.set(next);
    this.start();
  }

  protected step(delta: number): void {
    this.go(this.active() + delta);
  }

  protected onDeckKeydown(event: KeyboardEvent): void {
    const moves: Record<string, number> = {
      ArrowRight: this.active() + 1,
      ArrowDown: this.active() + 1,
      ArrowLeft: this.active() - 1,
      ArrowUp: this.active() - 1,
      Home: 0,
      End: this.certs.length - 1,
    };
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openLightbox(this.active());
      return;
    }
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.go(next);
  }

  // ---------------------------------------------------------------------------
  // Pointer: tilt + glare on hover, drag / flick to page
  // ---------------------------------------------------------------------------
  protected onPointerMove(event: PointerEvent): void {
    const rect = this.deck().nativeElement.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    if (event.pointerType === 'mouse') {
      this.tilt.ty = (px - 0.5) * 2 * MAX_TILT_DEG;
      this.tilt.tx = (0.5 - py) * 2 * MAX_TILT_DEG;
      this.glare.tx = px * 100;
      this.glare.ty = py * 100;
    }

    if (this.drag) {
      const now = performance.now();
      const dx = event.clientX - this.drag.startX;
      if (Math.abs(dx) > TAP_SLOP_PX) this.drag.moved = true;
      const cardWidth = rect.width * DRAG_CARD_FRACTION;
      const raw = this.drag.startPos - dx / cardWidth;
      // Rubber-band past either end.
      const max = this.certs.length - 1;
      this.pos = raw < 0 ? raw * 0.3 : raw > max ? max + (raw - max) * 0.3 : raw;
      const dt = Math.max(now - this.drag.lastT, 1);
      this.drag.v = (-(event.clientX - this.drag.lastX) / cardWidth / dt) * 0.6 + this.drag.v * 0.4;
      this.drag.lastX = event.clientX;
      this.drag.lastT = now;
      this.vel = 0;
    }
    this.start();
  }

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.lit.set(true);
  }

  protected onPointerLeave(): void {
    this.lit.set(false);
    this.tilt.tx = 0;
    this.tilt.ty = 0;
    this.start();
  }

  protected onPointerDown(event: PointerEvent): void {
    // A second finger (pinch) must not hijack the drag in progress.
    if (event.button !== 0 || !event.isPrimary) return;
    const now = performance.now();
    this.drag = { startX: event.clientX, startPos: this.pos, lastX: event.clientX, lastT: now, v: 0, moved: false };
    try {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    } catch {
      // Pointer already gone (cancelled before capture): the drag simply runs uncaptured.
    }
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!event.isPrimary) return;
    const drag = this.drag;
    this.drag = null;
    if (!drag) return;

    // The browser took the gesture (vertical scroll, pinch-zoom): never a tap —
    // just settle on the nearest card (or spring back if it barely moved).
    if (event.type === 'pointercancel') {
      this.go(drag.moved ? Math.round(this.pos) : this.active());
      return;
    }

    if (!drag.moved) {
      // A tap on the front plate opens it.
      if ((event.target as HTMLElement).closest('.plate.is-front')) this.openLightbox(this.active());
      return;
    }
    // Project the flick forward so a fast throw skips several cards.
    const projected = this.pos + drag.v * FLICK_PROJECTION_MS;
    this.go(Math.round(projected));
  }

  // ---------------------------------------------------------------------------
  // Lightbox (native <dialog>: Esc, focus trap and inertness for free)
  // ---------------------------------------------------------------------------
  protected openLightbox(index: number): void {
    this.lightbox.set(index);
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) dialog.showModal();
  }

  protected closeLightbox(): void {
    this.dialog().nativeElement.close();
  }

  protected onDialogClick(event: MouseEvent): void {
    // Clicks on the backdrop land on the <dialog> element itself.
    if (event.target === event.currentTarget) this.closeLightbox();
  }

  protected onDialogClosed(): void {
    // The <dialog> itself restores focus to whatever opened it (Enlarge button or deck).
    this.lightbox.set(null);
  }

  // ---------------------------------------------------------------------------
  // Physics loop
  // ---------------------------------------------------------------------------
  private start(): void {
    if (!this.motionEnabled || this.frame) return;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number): void {
    const k = Math.min(now - this.lastFrame, 64) / 16.667; // frames elapsed
    this.lastFrame = now;

    if (!this.drag) {
      // Semi-implicit Euler spring toward the active card.
      this.vel += (this.active() - this.pos) * SPRING_STIFFNESS * k;
      this.vel *= Math.pow(SPRING_DAMPING, k);
      this.pos += this.vel * k;
    }

    const follow = 1 - Math.pow(1 - TILT_FOLLOW, k);
    this.tilt.x += (this.tilt.tx - this.tilt.x) * follow;
    this.tilt.y += (this.tilt.ty - this.tilt.y) * follow;
    this.glare.x += (this.glare.tx - this.glare.x) * follow;
    this.glare.y += (this.glare.ty - this.glare.y) * follow;

    this.render();

    const settled =
      !this.drag &&
      Math.abs(this.active() - this.pos) < 0.0005 &&
      Math.abs(this.vel) < 0.0005 &&
      Math.abs(this.tilt.tx - this.tilt.x) < 0.01 &&
      Math.abs(this.tilt.ty - this.tilt.y) < 0.01 &&
      Math.abs(this.glare.tx - this.glare.x) < 0.1 &&
      Math.abs(this.glare.ty - this.glare.y) < 0.1;

    if (settled) {
      this.pos = this.active();
      this.render();
      this.frame = 0;
      return;
    }
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  /** Map each plate's distance from the front (d = i - pos) to a transform. */
  private render(): void {
    this.plates().forEach((ref, i) => {
      const el = ref.nativeElement;
      const d = i - this.pos;
      let transform: string;
      let opacity: number;

      if (d >= 0) {
        // Waiting in the stack: lower, further back, smaller, dimmer.
        const depth = Math.min(d, STACK_VISIBLE + 1);
        const front = Math.max(0, 1 - d); // 1 for the front plate, fading to 0 one step back
        transform =
          `translate3d(0, ${(depth * STACK_Y_PX).toFixed(2)}px, ${(-depth * STACK_Z_PX).toFixed(2)}px) ` +
          `scale(${(1 - depth * STACK_SCALE).toFixed(4)}) ` +
          `rotateX(${(this.tilt.x * front).toFixed(3)}deg) rotateY(${(this.tilt.y * front).toFixed(3)}deg)`;
        opacity = d > STACK_VISIBLE ? 0 : 1 - Math.max(0, d - 1) * 0.18;
      } else {
        // Peeling: hinge on the left edge, lift toward the viewer, fade out.
        const q = Math.min(-d, 1.2);
        transform =
          `translate3d(${(-q * PEEL_SHIFT_PCT).toFixed(2)}%, ${(-q * 10).toFixed(2)}px, ${(q * PEEL_LIFT_Z_PX).toFixed(2)}px) ` +
          `rotateY(${(-q * PEEL_ROTATE_DEG).toFixed(2)}deg)`;
        opacity = clamp(1 - q * 1.15, 0, 1);
      }

      // Stack plates scale about their centre; the peel hinges on the left edge. The swap
      // happens at d = 0 where the transform is (almost) identity, so it's seamless.
      el.style.transformOrigin = d < 0 ? '0% 50%' : '50% 60%';
      el.style.transform = transform;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(100 - Math.round(Math.abs(d) * 10) + (d < 0 ? 50 : 0));
      el.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible';
      el.style.setProperty('--glare-x', `${this.glare.x.toFixed(1)}%`);
      el.style.setProperty('--glare-y', `${this.glare.y.toFixed(1)}%`);
    });
  }
}
