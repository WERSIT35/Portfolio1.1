import { Directive, ElementRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Adds `is-loaded` to an <img> once it has decoded, driving the fade/blur-in in styles.scss.
@Directive({
  selector: 'img[appImgLoaded]',
  standalone: true,
  host: {
    class: 'img-fade',
    '(load)': 'markLoaded()',
    '(error)': 'markLoaded()',
  },
})
export class ImgLoadedDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Cached images can finish before hydration attaches the load listener.
    if (isPlatformBrowser(this.platformId) && this.el.nativeElement.complete) {
      this.markLoaded();
    }
  }

  protected markLoaded(): void {
    this.el.nativeElement.classList.add('is-loaded');
  }
}
