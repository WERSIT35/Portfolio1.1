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
import { CONTACT } from '../../../data/site-data';
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
// Safety margin on the fitted font size.
const FIT_MARGIN = 0.98;

const tbilisiClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Tbilisi',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

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

  /**
   * The address in three parts — local / @domain / .tld. Desktop sets the last two on
   * one row (split at the @); phones stack all three so the type can grow.
   */
  protected readonly parts = (() => {
    const email = CONTACT.email;
    const at = email.indexOf('@');
    const dot = email.lastIndexOf('.');
    return [email.slice(0, at), email.slice(at, dot), email.slice(dot)].map((part) => [...part]);
  })();

  /** Tbilisi time with seconds; null on the server (renders --:--:--). */
  protected readonly time = signal<string | null>(null);
  protected readonly copied = signal(false);

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = viewChild.required<ElementRef<HTMLElement>>('zone');
  private readonly mail = viewChild.required<ElementRef<HTMLElement>>('mail');
  private readonly chars = viewChildren<ElementRef<HTMLElement>>('ch');

  private letters: Letter[] = [];
  private fontPx = 0;
  private frame = 0;
  private lastFrame = 0;
  private magnetic = false;
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Live clock, aligned to the second boundary so the seconds tick on the beat.
      const tick = () => this.time.set(tbilisiClock.format(new Date()));
      tick();
      let interval: ReturnType<typeof setInterval> | undefined;
      const align = setTimeout(() => {
        tick();
        interval = setInterval(tick, 1000);
      }, 1000 - (Date.now() % 1000));

      // Fit the email to its row. Observe the host (never template nodes — HMR can swap them).
      const fit = () => this.fit();
      const sizes = new ResizeObserver(fit);
      sizes.observe(this.elementRef.nativeElement);
      document.fonts?.ready.then(fit);

      this.magnetic =
        matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches;

      destroyRef.onDestroy(() => {
        clearTimeout(align);
        clearInterval(interval);
        clearTimeout(this.copiedTimer);
        sizes.disconnect();
        cancelAnimationFrame(this.frame);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Copy email
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Magnetic letters
  // ---------------------------------------------------------------------------
  protected onZoneEnter(event: PointerEvent): void {
    if (!this.magnetic || event.pointerType !== 'mouse') return;
    this.measureLetters();
    this.onZoneMove(event);
  }

  protected onZoneMove(event: PointerEvent): void {
    if (!this.magnetic || event.pointerType !== 'mouse' || !this.letters.length) return;
    const radius = FIELD_RADIUS_EM * this.fontPx;
    const max = MAX_PULL_EM * this.fontPx;
    for (const l of this.letters) {
      const dx = event.clientX - l.cx;
      const dy = event.clientY - l.cy;
      const falloff = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
      [l.tx, l.ty] = clampLength(dx * PULL * falloff, dy * PULL * falloff, max);
    }
    this.start();
  }

  protected onZoneLeave(): void {
    for (const l of this.letters) {
      l.tx = 0;
      l.ty = 0;
    }
    this.start();
  }

  /** Letter centres at rest (current rect minus the offset it's been pulled by). */
  private measureLetters(): void {
    const els = this.chars();
    this.letters = els.map((ref, i) => {
      const r = ref.nativeElement.getBoundingClientRect();
      const prev = this.letters[i];
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

    this.letters.forEach((l, i) => {
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
  // Fit: the address block (whatever its row layout) fills the row's width without
  // overflowing its height. Its size scales linearly with the font size.
  // ---------------------------------------------------------------------------
  private fit(): void {
    const zone = this.zone().nativeElement;
    const mail = this.mail().nativeElement;
    const current = parseFloat(getComputedStyle(mail).fontSize);
    // Layout size, not the rect: the curtain scales the whole stage while it's covered.
    const width = mail.offsetWidth;
    const height = mail.offsetHeight;
    if (!current || !width || !height) return;

    const byWidth = (zone.clientWidth / width) * current;
    const byHeight = (zone.clientHeight / height) * current;
    this.fontPx = Math.floor(Math.min(byWidth, byHeight) * FIT_MARGIN);
    mail.style.setProperty('--mail-size', `${this.fontPx}px`);
    if (this.letters.length) this.measureLetters();
  }
}

function clampLength(x: number, y: number, max: number): [number, number] {
  const len = Math.hypot(x, y);
  return len > max ? [(x / len) * max, (y / len) * max] : [x, y];
}
