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
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { CONTACT } from '../../../data/site-data';
import { MagneticDirective } from '../../../directives/magnetic.directive';
import { ScrollSpyService } from '../../../services/scroll-spy.service';

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

@Component({
  selector: 'app-dynamic-island',
  standalone: true,
  imports: [RouterLink, MagneticDirective],
  templateUrl: './dynamic-island.html',
  styleUrl: './dynamic-island.scss',
  host: { '[class.is-over-hero]': 'overHero()' },
})
export class DynamicIsland {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly labelText = viewChild.required<ElementRef<HTMLElement>>('labelText');
  private readonly panelInner = viewChild.required<ElementRef<HTMLElement>>('panelInner');
  private readonly activeSectionId = inject(ScrollSpyService).activeSectionId;

  protected readonly contact = CONTACT;
  protected readonly navItems = NAV_ITEMS;

  private readonly canHover = signal(false);
  private readonly hovered = signal(false);
  private readonly pinned = signal(false);
  private readonly focusWithin = signal(false);
  // Set by Esc / link selection so the island closes even while hovered or focused.
  private readonly dismissed = signal(false);

  protected readonly expanded = computed(
    () => !this.dismissed() && (this.pinned() || this.hovered() || this.focusWithin()),
  );

  protected readonly labels = [...new Set(['Prologue', ...NAV_ITEMS.map((item) => item.label)])];

  protected readonly activeId = computed(() => this.activeSectionId() ?? 'top');
  // The hero carries its own identity and actions, so the pill steps aside while it's the
  // active stage on the home page (it stays focusable and reappears on keyboard focus).
  private readonly router = inject(Router);
  private readonly path = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split(/[?#]/)[0]),
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] },
  );
  protected readonly overHero = computed(() => this.path() === '/' && this.activeId() === 'top');

  protected readonly activeLabel = computed(
    () => NAV_ITEMS.find((item) => item.id === this.activeId())?.label ?? 'Prologue',
  );

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.canHover.set(matchMedia('(hover: hover) and (pointer: fine)').matches);

      const onPointerDown = (event: PointerEvent) => {
        if (this.pinned() && !this.host.nativeElement.contains(event.target as Node)) {
          this.pinned.set(false);
        }
      };
      document.addEventListener('pointerdown', onPointerDown);

      // CSS can't interpolate to/from auto, and a shrink-to-fit pill doesn't resize with
      // 0fr/1fr tracks. Measure the natural sizes and let CSS animate between real pixels.
      const hostEl = this.host.nativeElement;
      const measure = () => {
        const label = this.labelText().nativeElement.getBoundingClientRect();
        const panel = this.panelInner().nativeElement.getBoundingClientRect();
        hostEl.style.setProperty('--label-w', `${Math.ceil(label.width)}px`);
        hostEl.style.setProperty('--panel-w', `${Math.ceil(panel.width)}px`);
        hostEl.style.setProperty('--panel-h', `${Math.ceil(panel.height)}px`);
      };
      const sizes = new ResizeObserver(measure);
      sizes.observe(this.labelText().nativeElement);
      sizes.observe(this.panelInner().nativeElement);
      measure();

      destroyRef.onDestroy(() => {
        document.removeEventListener('pointerdown', onPointerDown);
        sizes.disconnect();
      });
    });
  }

  protected onEnter(): void {
    if (!this.canHover()) return;
    this.dismissed.set(false);
    this.hovered.set(true);
  }

  protected onLeave(): void {
    this.hovered.set(false);
    this.dismissed.set(false);
    // Focus left behind by a mouse click inside the island shouldn't hold it open;
    // only keyboard focus (:focus-visible) keeps it expanded after the pointer leaves.
    const active = document.activeElement;
    if (this.host.nativeElement.contains(active) && !active?.matches(':focus-visible')) {
      this.focusWithin.set(false);
    }
  }

  protected onFocusIn(event: FocusEvent): void {
    // Only keyboard focus opens the island. A tap also focuses the toggle (Android, not
    // iOS) just before its click; opening here made toggle() read "open" and close again.
    if (!(event.target as HTMLElement).matches(':focus-visible')) return;
    this.dismissed.set(false);
    this.focusWithin.set(true);
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.focusWithin.set(false);
    }
  }

  protected toggle(): void {
    const open = this.expanded();
    this.dismissed.set(open);
    this.pinned.set(!open);
  }

  protected close(): void {
    this.pinned.set(false);
    this.dismissed.set(true);
  }
}
