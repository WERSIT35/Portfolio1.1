import { Component, ElementRef, computed, signal, viewChildren } from '@angular/core';
import { EXPERIENCES } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Roles an engineering hire reads first (the rest still show, after them).
const ENGINEERING = /engineer|developer|lead/i;
const MAX_POINTS = 3;

/** 'Sep 2024' → months since year 0 (sortable, and the unit of the time rule). */
function monthIndex(text: string): number {
  const [, mon, year] = text.match(/(\w{3})\s+(\d{4})/) ?? [];
  return Number(year) * 12 + Math.max(MONTHS.indexOf(mon), 0);
}

const NOW = (() => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
})();

/** Split a summary into sentences — only at '. ' + capital, so 'Node.js' / '(v13+)' stay whole. */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "Sep 2024 – Present" → "2024—Now"; "Dec 2025 – Jun 2026" → "2025—26". */
function yearSpan(date: string): string {
  const years = date.match(/\d{4}/g) ?? [];
  const start = years[0] ?? '';
  if (/present/i.test(date)) return `${start}—Now`;
  const end = years[1];
  return end && end !== start ? `${start}—${end.slice(2)}` : start;
}

interface LedgerRole {
  id: number;
  role: string;
  org: string;
  employment: string;
  date: string;
  years: string;
  lead: string;
  points: string[];
  stack: string;
  start: number;
  end: number;
}

const ROLES: LedgerRole[] = EXPERIENCES.map((job) => {
  const [startText, endText = ''] = job.date.split(/\s+[–-]\s+/);
  const [lead, ...points] = sentences(job.summary);
  return {
    id: job.id,
    role: job.role,
    org: job.company ?? '',
    employment: job.employment ?? '',
    date: job.date,
    years: yearSpan(job.date),
    lead,
    points: points.slice(0, MAX_POINTS),
    // Non-breaking spaces keep multi-word items ("REST API") whole when the line wraps.
    stack: job.stack.map((item) => item.replace(/ /g, ' ')).join(', '),
    start: monthIndex(startText),
    end: /present/i.test(endText) ? NOW : monthIndex(endText),
  };
})
  // Engineering roles first; within each group the running ones, then the most recent.
  .sort(
    (a, b) =>
      Number(ENGINEERING.test(b.role)) - Number(ENGINEERING.test(a.role)) ||
      b.end - a.end ||
      b.start - a.start,
  );

const RULE_START = Math.min(...ROLES.map((r) => r.start));
const RULE_END = NOW;
const toPercent = (month: number) => ((month - RULE_START) / (RULE_END - RULE_START)) * 100;

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [SpySectionDirective],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.scss',
})
export class ExperienceSection {
  protected readonly roles = ROLES;

  /** "Sep 2022 → Present": from the earliest start to now. */
  protected readonly range = `${MONTHS[RULE_START % 12]} ${Math.floor(RULE_START / 12)} → Present`;

  /** Year ticks along the time rule, placed by month. */
  protected readonly ticks = Array.from(
    { length: Math.floor(RULE_END / 12) - Math.floor(RULE_START / 12) + 1 },
    (_, i) => Math.floor(RULE_START / 12) + i,
  )
    .map((year) => ({ year, at: toPercent(year * 12) }))
    .filter((tick) => tick.at >= 0 && tick.at <= 100);

  /** The open row (one at a time, or none); the current engineering role starts open. */
  protected readonly open = signal<number | null>(0);
  /** The row under the pointer or keyboard focus, which the rule previews. */
  protected readonly hot = signal<number | null>(null);

  /** The span the rule draws: the previewed row, else the open one. */
  protected readonly span = computed(() => {
    const index = this.hot() ?? this.open();
    if (index === null) return null;
    const role = this.roles[index];
    return { from: toPercent(role.start), to: toPercent(role.end) };
  });

  private readonly heads = viewChildren<ElementRef<HTMLButtonElement>>('head');

  protected toggle(index: number): void {
    this.open.update((current) => (current === index ? null : index));
  }

  /** ↑/↓ move between rows, Home/End jump (Enter/Space toggle natively, they're buttons). */
  protected onKeydown(event: KeyboardEvent, index: number): void {
    const last = this.roles.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(index + 1, last),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.heads()[next]?.nativeElement.focus();
  }
}
