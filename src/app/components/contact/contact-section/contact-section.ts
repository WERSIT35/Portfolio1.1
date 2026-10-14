import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CONTACT, CONTACT_FORM_ENDPOINT } from '../../../data/site-data';
import { trackEvent } from '../../../utils/analytics';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Heavy "metal" spring for the letters (per 60fps frame, dt-normalised). Tuned offline:
// 90% of the way at ~333ms, 2.9% overshoot, settled by ~0.67s.
const SPRING_STIFFNESS = 0.022;
const SPRING_DAMPING = 0.81;
// Magnetic field, in units of the email's font size.
const FIELD_RADIUS_EM = 1.15; // gaussian falloff radius around the cursor
const PULL = 0.2; // fraction of the cursor offset a letter at the centre follows
const MAX_PULL_EM = 0.07; // no letter travels further than this
const REST_EPSILON = 0.02;
const COPIED_MS = 2000;
// The address's width in ems for Geist Bold at -0.04em tracking, per character. The server
// renders the email at its fitted size from this (no layout shift); the browser then
// measures the real width once and corrects by a few percent at most.
const EM_PER_CHAR = 0.569;
// One-shot ripple on tap (touch): each letter lifts and settles, staggered.
const RIPPLE_STAGGER_MS = 22;

interface Letter {
  cx: number;
  cy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [SpySectionDirective],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {
  protected readonly contact = CONTACT;
  protected readonly year = new Date().getFullYear();
  protected readonly telHref = 'tel:' + CONTACT.phone.replace(/[^\d+]/g, '');
  protected readonly letters = [...CONTACT.email];
  /** Estimated width of the address in ems, so the CSS can size it before any script runs. */
  protected readonly mailEm = signal(+(CONTACT.email.length * EM_PER_CHAR).toFixed(3));
  protected readonly copied = signal(false);

  // Contact form ------------------------------------------------------------------
  protected readonly sending = signal(false);
  protected readonly status = signal('');

  protected async onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (String(data.get('company') ?? '')) {
      this.status.set('Thanks — message sent.'); // honeypot hit: pretend success, send nothing
      return;
    }
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
      this.status.set('Please add your name, a valid email and a message.');
      (form.querySelector<HTMLElement>(':invalid, [name="name"]') ?? form).focus();
      return;
    }

    trackEvent('contact_form_submit');
    if (!CONTACT_FORM_ENDPOINT) {
      // No endpoint configured yet: hand the message to the visitor's mail app.
      const body = `${message}\n\n— ${name} (${email})`;
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
        `Portfolio enquiry from ${name}`,
      )}&body=${encodeURIComponent(body)}`;
      this.status.set('Opening your mail app with the message ready to send.');
      return;
    }

    this.sending.set(true);
    this.status.set('');
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      this.status.set('Thanks — message sent.');
    } catch {
      this.status.set(`Couldn't send right now. Email me directly at ${CONTACT.email}.`);
    } finally {
      this.sending.set(false);
    }
  }

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly mail = viewChild.required<ElementRef<HTMLElement>>('mail');
  private readonly chars = viewChildren<ElementRef<HTMLElement>>('ch');

  private springs: Letter[] = [];
  private fontPx = 0;
  private frame = 0;
  private lastFrame = 0;
  private magnetic = false;
  private touch = false;
  private reducedMotion = false;
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.magnetic =
        matchMedia('(hover: hover) and (pointer: fine)').matches && !this.reducedMotion;
      this.touch = matchMedia('(pointer: coarse)').matches;

      // Correct the estimated width once the real font is in (observe the host, never
      // template nodes — HMR can swap them).
      const correct = () => this.correctWidth();
      document.fonts?.ready.then(correct);
      const sizes = new ResizeObserver(() => {
        this.fontPx = parseFloat(getComputedStyle(this.mail().nativeElement).fontSize);
        if (this.springs.length) this.measureLetters();
      });
      sizes.observe(this.elementRef.nativeElement);

      destroyRef.onDestroy(() => {
        clearTimeout(this.copiedTimer);
        sizes.disconnect();
        cancelAnimationFrame(this.frame);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Copy
  // ---------------------------------------------------------------------------
  /** Touch: tapping the address copies it (the "Open in mail app" link keeps mailto). */
  protected onMailClick(event: MouseEvent): void {
    if (!this.touch) return;
    event.preventDefault();
    void this.copy();
    this.ripple();
  }

  protected async copy(): Promise<void> {
    const email = this.contact.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Insecure context / denied permission: fall back to a transient selection.
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), COPIED_MS);
  }

  private ripple(): void {
    if (this.reducedMotion) return;
    this.chars().forEach((ref, i) =>
      ref.nativeElement.animate(
        [{ transform: 'none' }, { transform: 'translateY(-0.12em)' }, { transform: 'none' }],
        { duration: 520, delay: i * RIPPLE_STAGGER_MS, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Magnetic letters (desktop)
  // ---------------------------------------------------------------------------
  protected onZoneEnter(event: PointerEvent): void {
    if (!this.magnetic || event.pointerType !== 'mouse') return;
    this.measureLetters();
    this.onZoneMove(event);
  }

  protected onZoneMove(event: PointerEvent): void {
    if (!this.magnetic || event.pointerType !== 'mouse' || !this.springs.length) return;
    const radius = FIELD_RADIUS_EM * this.fontPx;
    const max = MAX_PULL_EM * this.fontPx;
    for (const l of this.springs) {
      const dx = event.clientX - l.cx;
      const dy = event.clientY - l.cy;
      const falloff = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
      [l.tx, l.ty] = clampLength(dx * PULL * falloff, dy * PULL * falloff, max);
    }
    this.start();
  }

  protected onZoneLeave(): void {
    for (const l of this.springs) {
      l.tx = 0;
      l.ty = 0;
    }
    this.start();
  }

  /** Letter centres at rest (current rect minus the offset it's been pulled by). */
  private measureLetters(): void {
    this.fontPx = parseFloat(getComputedStyle(this.mail().nativeElement).fontSize);
    this.springs = this.chars().map((ref, i) => {
      const r = ref.nativeElement.getBoundingClientRect();
      const prev = this.springs[i];
      const x = prev?.x ?? 0;
      const y = prev?.y ?? 0;
      return {
        cx: r.left + r.width / 2 - x,
        cy: r.top + r.height / 2 - y,
        x,
        y,
        vx: prev?.vx ?? 0,
        vy: prev?.vy ?? 0,
        tx: 0,
        ty: 0,
      };
    });
  }

  private start(): void {
    if (this.frame) return;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number): void {
    const k = Math.min(now - this.lastFrame, 64) / 16.667;
    this.lastFrame = now;
    const damping = Math.pow(SPRING_DAMPING, k);
    const els = this.chars();
    let moving = false;

    this.springs.forEach((l, i) => {
      l.vx = (l.vx + (l.tx - l.x) * SPRING_STIFFNESS * k) * damping;
      l.vy = (l.vy + (l.ty - l.y) * SPRING_STIFFNESS * k) * damping;
      l.x += l.vx * k;
      l.y += l.vy * k;

      const resting =
        Math.abs(l.tx - l.x) < REST_EPSILON &&
        Math.abs(l.ty - l.y) < REST_EPSILON &&
        Math.abs(l.vx) < REST_EPSILON &&
        Math.abs(l.vy) < REST_EPSILON;
      if (resting) {
        l.x = l.tx;
        l.y = l.ty;
      } else {
        moving = true;
      }
      const el = els[i]?.nativeElement;
      if (el) el.style.translate = l.x || l.y ? `${l.x.toFixed(2)}px ${l.y.toFixed(2)}px` : '';
    });

    this.frame = moving ? requestAnimationFrame((t) => this.tick(t)) : 0;
  }

  // ---------------------------------------------------------------------------
  // Width: replace the estimate with the measured width (in ems) once Geist has loaded.
  // ---------------------------------------------------------------------------
  private correctWidth(): void {
    const mail = this.mail().nativeElement;
    const size = parseFloat(getComputedStyle(mail).fontSize);
    // Layout size, not the rect: the scroll-driven stage transitions scale the stage.
    const width = mail.scrollWidth;
    if (!size || !width) return;
    const em = +(width / size).toFixed(3);
    if (Math.abs(em - this.mailEm()) > 0.01) this.mailEm.set(em);
  }
}

function clampLength(x: number, y: number, max: number): [number, number] {
  const len = Math.hypot(x, y);
  return len > max ? [(x / len) * max, (y / len) * max] : [x, y];
}
