import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CERTIFICATIONS, EDUCATION_ITEMS } from '../../../data/site-data';
import { SpySectionDirective } from '../../../directives/spy-section.directive';

// Degrees get full records; other entries (e.g. a certificate path) live in Certifications.
const DEGREE = /^(BSc|MSc|BA|MA|PhD)\b/;
// How issuer names are written, whatever casing the data uses.
const ISSUER_NAMES: Record<string, string> = {
  freecodecamp: 'freeCodeCamp',
  w3schools: 'W3Schools',
  anthropic: 'Anthropic',
};

const THIS_YEAR = new Date().getFullYear();

interface DegreeRecord {
  id: number;
  degree: string;
  institution: string;
  logo: string;
  years: string;
  status: 'Completed' | 'In progress';
  coursework: string;
  /** The degree's own description from the data, as plain text. */
  summary: string;
  cover: string;
  coverAlt: string;
  /** Timeline: a bar from start to end, or a single marker when only the end is known. */
  start: number | null;
  end: number;
}

const DEGREES: DegreeRecord[] = EDUCATION_ITEMS.filter((item) => DEGREE.test(item.degree)).map(
  (item) => {
    const years = (item.date.match(/\d{4}/g) ?? []).map(Number);
    const inProgress = /in progress|expected/i.test(`${item.degree} ${item.date}`);
    const start = years.length > 1 ? years[0] : null;
    const end = years[years.length - 1] ?? THIS_YEAR;
    return {
      id: item.id,
      degree: item.degree.replace(/\s*—.*$/, ''),
      institution: item.name,
      logo: item.img,
      years: start ? `${start}—${end}` : `Expected ${end}`,
      status: inProgress ? 'In progress' : 'Completed',
      coursework: item.subjects.join(' · '),
      summary: item.description
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
      cover: item.coverImage,
      coverAlt: item.coverAlt,
      start,
      end,
    };
  },
);

const RULE_START = Math.min(...DEGREES.map((d) => d.start ?? d.end));
const RULE_END = Math.max(THIS_YEAR, ...DEGREES.map((d) => d.end));
const toPercent = (year: number) => ((year - RULE_START) / (RULE_END - RULE_START)) * 100;

@Component({
  selector: 'app-education-section',
  standalone: true,
  imports: [RouterLink, SpySectionDirective],
  templateUrl: './education-section.html',
  styleUrl: './education-section.scss',
})
export class EducationSection {
  protected readonly degrees = DEGREES.map((d) => ({
    ...d,
    from: d.start === null ? null : toPercent(d.start),
    at: toPercent(d.end),
  }));

  protected readonly ticks = Array.from(
    { length: RULE_END - RULE_START + 1 },
    (_, i) => RULE_START + i,
  ).map((year) => ({ year, at: toPercent(year) }));

  /** "8 certifications — Anthropic, freeCodeCamp, W3Schools". */
  protected readonly certCount = CERTIFICATIONS.length;
  protected readonly certIssuers = [
    ...new Set(
      CERTIFICATIONS.map((cert) => {
        const key = cert.issuer.toLowerCase().match(/^[a-z0-9]+/)?.[0] ?? cert.issuer;
        return ISSUER_NAMES[key] ?? cert.issuer;
      }),
    ),
  ].join(', ');

  /** The degree previewed on the rule (hover, focus or tap); the other one dims. */
  protected readonly active = signal<number | null>(null);

  /** Keyboard focus previews the degree (a tap also focuses, so only :focus-visible counts). */
  protected onFocus(event: FocusEvent, id: number): void {
    if ((event.target as HTMLElement).matches(':focus-visible')) this.active.set(id);
  }

  /** Touch / pen: a tap toggles the preview (the mouse previews on hover instead). */
  protected onTap(event: MouseEvent, id: number): void {
    if ((event as PointerEvent).pointerType === 'mouse') return;
    this.active.update((current) => (current === id ? null : id));
  }
}
