import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private readonly visibleSectionIds = new Set<string>();

  readonly activeSectionId = signal<string | null>(null);

  register(element: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            this.visibleSectionIds.add(id);
          } else {
            this.visibleSectionIds.delete(id);
          }
        }
        this.updateActiveSection();
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    );

    this.observer.observe(element);
  }

  unregister(element: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.observer?.unobserve(element);
    this.visibleSectionIds.delete(element.id);
    this.updateActiveSection();
  }

  /**
   * The last visible section in page order wins: a stage that's leaving sinks (and shifts
   * down) behind the next one, so where two overlap the later one is the sheet on top.
   */
  private updateActiveSection(): void {
    const sections = document.querySelectorAll<HTMLElement>('[data-spy-section]');
    for (const section of Array.from(sections).reverse()) {
      if (this.visibleSectionIds.has(section.id)) {
        this.activeSectionId.set(section.id);
        return;
      }
    }
  }
}
