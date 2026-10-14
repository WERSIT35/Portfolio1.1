import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../data/site-data';
import { Projects } from '../../interfaces/projects';
import { projectStatusLabel } from '../../utils/project-status';
import { PROJECT_DIAGRAMS } from '../../utils/project-diagrams';
import { trackEvent } from '../../utils/analytics';
import { SITE_URL, personJsonLd, projectJsonLd, setJsonLd } from '../../utils/seo';
import { desktopShots, shotSize, shotSrcset } from '../../utils/project-media';

// ---------------------------------------------------------------------------
// "Dossier": a case study as a printed spec sheet. Cover (name in difference blend over a
// greyscale slab, or a typographic spec plate when there are no screens), a colophon,
// numbered chapters on a rail that fills as you read, a contact sheet of plates (colour in
// the lightbox), and the next case with the projects index's trailing lens.
// ---------------------------------------------------------------------------

interface Chapter {
  name: string;
  kind: 'text' | 'list' | 'quote' | 'facts' | 'figure';
  text?: string;
  items?: string[];
  facts?: { label: string; value: string }[];
  src?: string;
}

interface Fact {
  label: string;
  value: string;
  wide?: boolean;
}

// Lens physics: the same feel as the projects index.
const LENS_FOLLOW = 0.11;
const LENS_TILT_PER_PX = 0.035;
const LENS_MAX_TILT_DEG = 7;
const LENS_GAP_PX = 28;
const EDGE_PX = 16;
// A chapter becomes current once its top passes this fraction of the viewport.
const READ_LINE = 0.45;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const pad = (n: number) => String(n).padStart(2, '0');

/** A real live URL only ('#' and empty links are placeholders). */

const liveUrl = (p: Projects) => (p.iflink && p.link && p.link !== '#' ? p.link : null);

/** The spec plate: the first metric, set large (its first clause when it has several). */
const specOf = (p: Projects) => {
  const metric = p.metrics?.[0];
  return metric
    ? { label: metric.label, value: metric.value.split(' · ')[0], stack: p.stack }
    : { label: 'Stack', value: p.stack[0] ?? p.projName, stack: p.stack.slice(1) };
};

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  /** One canonical <link> per page, updated in place (works on the server and in the browser). */
  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  slug = input<string>();

  protected readonly shotSize = shotSize;
  protected readonly trackEvent = trackEvent;
  protected readonly shotSrcset = shotSrcset;

  private readonly position = computed(() => PROJECTS.findIndex((p) => p.slug === this.slug()));

  /** One-item list: `@for … track slug` rebuilds the page per project (wipes replay). */
  protected readonly current = computed(() => {
    const i = this.position();
    if (i < 0) return [];
    const p = PROJECTS[i];
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    const cover = desktopShots(p)[0] ?? null;
    return [
      {
        ...p,
        index: pad(i + 1),
        statusLabel: projectStatusLabel(p.status),
        category: p.subname.split(' — ')[0],
        live: liveUrl(p),
        cover,
        spec: specOf(p),
        facts: this.factsOf(p),
        chapters: this.chaptersOf(p).map((c, k) => ({ ...c, num: pad(k + 1) })),
        next: {
          slug: next.slug,
          index: pad(((i + 1) % PROJECTS.length) + 1),
          projName: next.projName,
          category: next.subname.split(' — ')[0],
          year: next.year,
          statusLabel: projectStatusLabel(next.status),
          cover: desktopShots(next)[0] ?? null,
          spec: specOf(next),
        },
      },
    ];
  });

  protected readonly total = pad(PROJECTS.length);

  /** Every screen, in the order the project lists them (desktop and phone interleaved). */
  protected readonly plates = computed(() => {
    const p = this.current()[0];
    if (!p) return [];
    return p.img.map((src, k) => {
      const { width, height } = shotSize(src);
      return { src, ratio: +(width / height).toFixed(3), label: pad(k + 1), phone: width < height };
    });
  });

  protected readonly plateCount = computed(() => pad(this.plates().length));

  // Chapters rail -------------------------------------------------------------
  protected readonly progress = signal(0);
  protected readonly activeChapter = signal(0);

  // Lightbox ------------------------------------------------------------------
  protected readonly shown = signal<number | null>(null);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  // Next-case lens ------------------------------------------------------------
  protected readonly nextHot = signal(false);
  private readonly lens = viewChild<ElementRef<HTMLElement>>('lens');
  private readonly nextBlock = viewChild<ElementRef<HTMLElement>>('nextBlock');
  private readonly target = { x: 0, y: 0 };
  private readonly pos = { x: 0, y: 0 };
  private frame = 0;
  private placed = false;
  private reducedMotion = false;

  constructor() {
    effect(() => {
      const p = this.current()[0];
      this.title.setTitle(
        p
          ? `${p.projName} — case study · Otar Davitashvili`
          : 'Project not found — Otar Davitashvili',
      );
      if (p) {
        const pageTitle = `${p.projName} — case study · Otar Davitashvili`;
        const description = `${p.projName}: ${p.subname}. ${p.statusLabel}, ${p.year}.`;
        const url = `${SITE_URL}/work/${p.slug}`;
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:title', content: pageTitle });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:url', content: url });
        const image = `${SITE_URL}/assets/og/${p.slug}.png`;
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ name: 'twitter:image', content: image });
        setJsonLd(this.document, 'ld-person', personJsonLd());
        setJsonLd(this.document, 'ld-page', projectJsonLd(p));
        this.setCanonical(url);
      }
      // A new case starts unread, with nothing open.
      this.progress.set(0);
      this.activeChapter.set(0);
      this.shown.set(null);
      this.nextHot.set(false);
      this.placed = false;
    });

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

      let queued = 0;
      const schedule = () => {
        if (!queued) queued = requestAnimationFrame(() => ((queued = 0), this.measure()));
      };
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', schedule, { passive: true });
      // The page is rebuilt per project; re-measure once the new chapters are in.
      const mutations = new MutationObserver(schedule);
      mutations.observe(this.host.nativeElement, { childList: true, subtree: true });
      this.measure();

      destroyRef.onDestroy(() => {
        removeEventListener('scroll', schedule);
        removeEventListener('resize', schedule);
        mutations.disconnect();
        cancelAnimationFrame(queued);
        cancelAnimationFrame(this.frame);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Content shaping (facts only: everything comes from site-data)
  // ---------------------------------------------------------------------------
  private factsOf(p: Projects): Fact[] {
    const facts: Fact[] = [
      { label: 'Role', value: p.role },
      { label: 'Year', value: String(p.year) },
      { label: 'Status', value: projectStatusLabel(p.status) },
      { label: 'Stack', value: p.stack.join(' · '), wide: true },
    ];
    // Metrics that only repeat the status or the stack line are left out.
    for (const m of p.metrics ?? []) {
      if (m.label === 'Status' || m.label === 'Stack') continue;
      facts.push({ label: m.label, value: m.value });
    }
    return facts;
  }

  private chaptersOf(p: Projects): Chapter[] {
    // Fixed order: problem → what I built → decisions → stack → outcome. Empty ones are skipped,
    // and nothing is invented: every chapter reads straight from the project's data.
    const chapters: Chapter[] = [{ name: 'Overview', kind: 'text', text: p.about }];
    if (p.problem) chapters.push({ name: 'Problem', kind: 'text', text: p.problem });
    const built = p.approach?.length ? p.approach : p.highlights;
    if (built.length) chapters.push({ name: 'What I built', kind: 'list', items: built });
    const diagram = PROJECT_DIAGRAMS[p.slug];
    if (diagram) chapters.push({ name: 'Architecture', kind: 'figure', src: diagram });
    if (p.metrics?.length) chapters.push({ name: 'Key decisions', kind: 'facts', facts: p.metrics });
    if (p.stack.length) chapters.push({ name: 'Stack', kind: 'text', text: p.stack.join(' · ') });
    const live = liveUrl(p);
    const outcome = [
      p.result ? `${p.result}.` : '',
      `${projectStatusLabel(p.status)} · ${p.year}.`,
      live ? `Live at ${live.replace(/^https?:\/\//, '').replace(/\/$/, '')}.` : '',
      p.lessons ?? '',
    ]
      .filter(Boolean)
      .join(' ');
    chapters.push({ name: 'Outcome', kind: 'text', text: outcome });
    return chapters;
  }

  // ---------------------------------------------------------------------------
  // Chapters rail: fill = how far the read line has travelled through the chapters
  // ---------------------------------------------------------------------------
  private measure(): void {
    const chapters = this.host.nativeElement.querySelectorAll<HTMLElement>('.chapter');
    if (!chapters.length) return;
    const line = innerHeight * READ_LINE;
    const first = chapters[0].getBoundingClientRect();
    const last = chapters[chapters.length - 1].getBoundingClientRect();
    // The last chapter may be shorter than the read line: finish when the page bottoms out.
    const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    const span = last.bottom - first.top;
    this.progress.set(atEnd ? 1 : clamp((line - first.top) / span, 0, 1));

    let active = 0;
    chapters.forEach((chapter, k) => {
      if (chapter.getBoundingClientRect().top <= line) active = k;
    });
    this.activeChapter.set(atEnd && last.top < innerHeight ? chapters.length - 1 : active);
  }

  // ---------------------------------------------------------------------------
  // Lightbox (native <dialog>: Esc, focus trap and focus return for free)
  // ---------------------------------------------------------------------------
  protected openPlate(index: number): void {
    this.shown.set(index);
    const dialog = this.dialog()?.nativeElement;
    if (dialog && !dialog.open) dialog.showModal();
  }

  protected step(delta: number): void {
    const count = this.plates().length;
    this.shown.update((i) => (i === null ? i : (i + delta + count) % count));
  }

  protected close(): void {
    this.dialog()?.nativeElement.close();
  }

  protected onDialogClick(event: MouseEvent): void {
    // Clicks on the backdrop land on the <dialog> element itself.
    if (event.target === event.currentTarget) this.close();
  }

  protected onDialogKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') this.step(1);
    else if (event.key === 'ArrowLeft') this.step(-1);
  }

  // ---------------------------------------------------------------------------
  // Next case: the lens trails the cursor (mouse) or parks by the name (keyboard)
  // ---------------------------------------------------------------------------
  protected onNextMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !this.canHover()) return;
    this.nextHot.set(true);
    this.aim(event.clientX, event.clientY);
  }

  protected onNextLeave(event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.nextHot.set(false);
  }

  protected onNextFocus(event: FocusEvent): void {
    const link = event.target as HTMLElement;
    if (!link.matches(':focus-visible') || !this.canHover()) return;
    const rect = link.getBoundingClientRect();
    this.aim(rect.left + rect.width * 0.35, rect.top);
    this.nextHot.set(true);
  }

  protected onNextBlur(): void {
    this.nextHot.set(false);
  }

  private canHover(): boolean {
    return matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches;
  }

  private aim(clientX: number, clientY: number): void {
    const block = this.nextBlock()?.nativeElement;
    const lens = this.lens()?.nativeElement;
    if (!block || !lens) return;
    const bounds = block.getBoundingClientRect();
    const localX = clientX - bounds.left;
    const localY = clientY - bounds.top;
    const h = lens.offsetHeight;
    // Above-right of the cursor so it never covers the name's start; below if no room.
    const above = localY - h - LENS_GAP_PX;
    this.target.x = clamp(localX + LENS_GAP_PX, EDGE_PX, bounds.width - lens.offsetWidth - EDGE_PX);
    this.target.y = above >= -h / 2 ? above : localY + LENS_GAP_PX;

    if (!this.placed || this.reducedMotion) {
      this.pos.x = this.target.x;
      this.pos.y = this.target.y;
      this.placed = true;
    }
    if (!this.frame) this.frame = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    const lens = this.lens()?.nativeElement;
    if (!lens) {
      this.frame = 0;
      return;
    }
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    this.pos.x += this.reducedMotion ? dx : dx * LENS_FOLLOW;
    this.pos.y += this.reducedMotion ? dy : dy * LENS_FOLLOW;
    const tilt = this.reducedMotion
      ? 0
      : clamp(dx * LENS_TILT_PER_PX, -LENS_MAX_TILT_DEG, LENS_MAX_TILT_DEG);
    lens.style.setProperty('--lens-x', `${this.pos.x.toFixed(1)}px`);
    lens.style.setProperty('--lens-y', `${this.pos.y.toFixed(1)}px`);
    lens.style.setProperty('--lens-tilt', `${tilt.toFixed(2)}deg`);

    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
      this.frame = 0;
      return;
    }
    this.frame = requestAnimationFrame(() => this.tick());
  }
}
