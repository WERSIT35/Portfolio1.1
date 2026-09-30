import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';
import { desktopShots, mobileShots } from '../../../utils/project-media';
import { projectStatusLabel } from '../../../utils/project-status';

type LensKind = 'both' | 'desktop' | 'mobile' | 'spec';

// Lens trailing physics (per 60fps frame): lower follow = heavier lag.
const LENS_FOLLOW = 0.11;
const LENS_TILT_PER_PX = 0.035;
const LENS_MAX_TILT_DEG = 7;
const SHOT_CYCLE_MS = 1300;
const LENS_GAP_PX = 28;
const EDGE_PX = 16;
const COMPACT_QUERY = '(max-width: 767px)';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, SpySectionDirective],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.scss',
})
export class ProjectsSection {
  protected readonly rows = PROJECTS.map((project, i) => {
    const desktop = desktopShots(project);
    const mobile = mobileShots(project);
    const kind: LensKind =
      desktop.length && mobile.length ? 'both' : desktop.length ? 'desktop' : mobile.length ? 'mobile' : 'spec';
    return {
      ...project,
      index: String(i + 1).padStart(2, '0'),
      category: project.subname.split(' — ')[0],
      stackLine: project.stack.slice(0, 3).join(' · '),
      statusLabel: projectStatusLabel(project.status),
      desktop,
      mobile,
      kind,
    };
  });

  protected readonly count = String(this.rows.length).padStart(2, '0');

  /** Row under the pointer / keyboard focus (desktop lens). */
  protected readonly hot = signal<number | null>(null);
  /** Expanded accordion row (phones). */
  protected readonly open = signal(0);
  protected readonly lensVisible = signal(false);
  /** Ever-increasing counter; each gallery reads it modulo its own length. */
  protected readonly shot = signal(0);

  /** Last row shown in the lens — kept after leaving so the lens fades out with content. */
  private readonly shown = signal<number | null>(null);
  protected readonly lensRow = computed(() => {
    const i = this.shown();
    return i === null ? null : this.rows[i];
  });

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly lens = viewChild.required<ElementRef<HTMLElement>>('lens');

  private readonly target = { x: 0, y: 0 };
  private readonly pointer = { x: 0, y: 0 };
  private readonly pos = { x: 0, y: 0 };
  private frame = 0;
  private cycle?: ReturnType<typeof setInterval>;
  private placed = false;
  private reducedMotion = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Warm the cache with each project's first shots so the lens never opens empty.
      const preload = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          preload.disconnect();
          for (const row of this.rows) {
            for (const src of [row.desktop[0], row.mobile[0]]) {
              if (src) new Image().src = src;
            }
          }
        },
        { rootMargin: '100% 0px' },
      );
      preload.observe(this.host().nativeElement);

      // The lens changes size with each project (wide browser, tall phones, spec card);
      // re-aim so its flip/clamp maths always uses the real dimensions.
      const resize = new ResizeObserver(() => {
        if (this.lensVisible()) this.aim(this.pointer.x, this.pointer.y);
      });
      resize.observe(this.lens().nativeElement);

      destroyRef.onDestroy(() => {
        preload.disconnect();
        resize.disconnect();
        cancelAnimationFrame(this.frame);
        clearInterval(this.cycle);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Desktop: hover / focus drives the lens
  // ---------------------------------------------------------------------------
  protected onListMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || this.isCompact()) return;
    this.aim(event.clientX, event.clientY);
  }

  protected onRowEnter(index: number): void {
    if (this.isCompact()) return;
    this.activate(index);
  }

  protected onRowFocus(index: number, event: FocusEvent): void {
    if (this.isCompact()) return;
    const link = event.target as HTMLElement;
    if (!link.matches(':focus-visible')) return;
    // No pointer: park the lens over the focused row's name.
    const rect = link.getBoundingClientRect();
    this.aim(rect.left + rect.width * 0.35, rect.top);
    this.activate(index);
  }

  protected onListLeave(): void {
    this.hot.set(null);
    this.lensVisible.set(false);
    clearInterval(this.cycle);
  }

  protected onListFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!(event.currentTarget as HTMLElement).contains(next)) this.onListLeave();
  }

  /** Read live: desktop-only behaviour (lens) must not run on the phone layout. */
  private isCompact(): boolean {
    return typeof matchMedia === 'function' && matchMedia(COMPACT_QUERY).matches;
  }

  private activate(index: number): void {
    if (this.hot() !== index) {
      this.hot.set(index);
      this.shown.set(index);
      this.shot.set(0);
    }
    this.lensVisible.set(true);

    clearInterval(this.cycle);
    if (!this.reducedMotion) {
      this.cycle = setInterval(() => this.shot.update((n) => n + 1), SHOT_CYCLE_MS);
    }
  }

  /** Point the lens at a viewport coordinate; the rAF loop eases it there. */
  private aim(clientX: number, clientY: number): void {
    this.pointer.x = clientX;
    this.pointer.y = clientY;
    const bounds = this.host().nativeElement.getBoundingClientRect();
    const lens = this.lens().nativeElement;
    // The lens floats above-right of the cursor so it never covers the hot row; it flips
    // below when there's no room on top, and always stays fully inside the section.
    const localX = clientX - bounds.left;
    const localY = clientY - bounds.top;
    const h = lens.offsetHeight;
    const above = localY - h - LENS_GAP_PX;
    const y = above >= EDGE_PX ? above : localY + LENS_GAP_PX;
    this.target.x = clamp(localX + LENS_GAP_PX, EDGE_PX, bounds.width - lens.offsetWidth - EDGE_PX);
    this.target.y = clamp(y, EDGE_PX, bounds.height - h - EDGE_PX);

    if (!this.placed || this.reducedMotion) {
      // First appearance: start at the cursor rather than flying in from the corner.
      this.pos.x = this.target.x;
      this.pos.y = this.target.y;
      this.placed = true;
    }
    if (!this.frame) this.frame = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    this.pos.x += dx * LENS_FOLLOW;
    this.pos.y += dy * LENS_FOLLOW;

    // Lean into the direction of travel, proportional to how far it's trailing.
    const tilt = this.reducedMotion ? 0 : clamp(dx * LENS_TILT_PER_PX, -LENS_MAX_TILT_DEG, LENS_MAX_TILT_DEG);
    const el = this.lens().nativeElement;
    el.style.setProperty('--lens-x', `${this.pos.x.toFixed(1)}px`);
    el.style.setProperty('--lens-y', `${this.pos.y.toFixed(1)}px`);
    el.style.setProperty('--lens-tilt', `${tilt.toFixed(2)}deg`);

    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
      this.frame = 0;
      return;
    }
    this.frame = requestAnimationFrame(() => this.tick());
  }
}
