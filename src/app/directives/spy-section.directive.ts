import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { ScrollSpyService } from '../services/scroll-spy.service';

@Directive({
  selector: '[appSpySection]',
  standalone: true,
})
export class SpySectionDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly scrollSpy = inject(ScrollSpyService);

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    host.setAttribute('data-spy-section', '');
    this.scrollSpy.register(host);
  }

  ngOnDestroy(): void {
    this.scrollSpy.unregister(this.el.nativeElement);
  }
}
