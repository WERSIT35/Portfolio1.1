import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input('appReveal') variant: 'up' | 'fade' | 'left' | 'right' = 'up';
  @Input() revealDelay = 0;
  @Input() revealThreshold = 0.15;

  private host = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.host.nativeElement;
    this.renderer.addClass(el, 'reveal');
    this.renderer.addClass(el, `reveal--${this.variant}`);
    if (this.revealDelay) {
      this.renderer.setStyle(el, 'transition-delay', `${this.revealDelay}ms`);
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.renderer.addClass(el, 'reveal--in');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(el, 'reveal--in');
            this.observer?.unobserve(el);
          }
        }
      },
      { threshold: this.revealThreshold, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
