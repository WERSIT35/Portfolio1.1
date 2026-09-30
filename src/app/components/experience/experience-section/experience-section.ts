import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { EXPERIENCES } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Delay before a hovered strip opens, so sweeping the cursor across doesn't flicker panels.
const HOVER_INTENT_MS = 140;

/** "Sep 2024 – Present" → "2024—Now", "Dec 2025 – Jun 2026" → "2025—26". */
function yearSpan(date: string): string {
  const years = date.match(/\d{4}/g) ?? [];
  const start = years[0] ?? '';
  if (/present/i.test(date)) return `${start}—Now`;
  const end = years[1];
  return end && end !== start ? `${start}—${end.slice(2)}` : start;
}

/** Split a summary into sentences — only at '. ' + capital, so 'Node.js' / '(v13+)' stay whole. */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** 'Oct 2022 – Jul 2023' → 2022 * 12 + 9: sortable month index of the start date. */
const startIndex = (date: string) => {
  const [, mon, year] = date.match(/(\w{3})\s+(\d{4})/) ?? [];
  return Number(year) * 12 + Math.max(MONTHS.indexOf(mon), 0);
};

// The whole career span, derived from the data: earliest start → latest year named.
const ALL_YEARS = EXPERIENCES.flatMap((role) => role.date.match(/\d{4}/g) ?? []).map(Number);
const EARLIEST = [...EXPERIENCES].sort((a, b) => startIndex(a.date) - startIndex(b.date))[0];

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [SpySectionDirective],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.scss',
})
export class ExperienceSection {
  protected readonly roles = EXPERIENCES.map((role, i) => {
    const [lead, ...points] = sentences(role.summary);
    return {
      ...role,
      index: String(i + 1).padStart(2, '0'),
      years: yearSpan(role.date),
      lead,
      points,
    };
  });

  /** '2022—2026': watermark span from the data. */
  protected readonly span = `${Math.min(...ALL_YEARS)}—${Math.max(...ALL_YEARS)}`;
  /** 'Sep 2022 → Present': from the earliest start to now. */
  protected readonly range = `${EARLIEST?.date.split(/\s+[–-]\s+/)[0]} → Present`;

  protected readonly active = signal(0);

  private readonly injector = inject(Injector);
  private readonly details = viewChildren<ElementRef<HTMLElement>>('detail');
  private canHover = false;
  private hoverTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    });
    destroyRef.onDestroy(() => clearTimeout(this.hoverTimer));
  }

  protected select(index: number): void {
    clearTimeout(this.hoverTimer);
    this.active.set(index);
  }

  protected onStripEnter(index: number): void {
    if (!this.canHover || index === this.active()) return;
    clearTimeout(this.hoverTimer);
    this.hoverTimer = setTimeout(() => this.active.set(index), HOVER_INTENT_MS);
  }

  protected onStripLeave(): void {
    clearTimeout(this.hoverTimer);
  }

  protected step(delta: number): void {
    const count = this.roles.length;
    this.select((this.active() + delta + count) % count);
  }

  /** Arrow keys step between roles, Home/End jump; focus follows to the new strip or panel. */
  protected onTabKeydown(event: KeyboardEvent): void {
    const count = this.roles.length;
    const moves: Record<string, number> = {
      ArrowRight: this.active() + 1,
      ArrowDown: this.active() + 1,
      ArrowLeft: this.active() - 1,
      ArrowUp: this.active() - 1,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;

    event.preventDefault();
    const index = (next + count) % count;
    this.select(index);
    // The opened panel's strip is hidden, so focus moves into its detail once it's no longer inert.
    afterNextRender(() => this.details()[index]?.nativeElement.focus({ preventScroll: true }), {
      injector: this.injector,
    });
  }
}
