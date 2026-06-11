import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { LoadingService } from './services/loading.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { SmoothScrollService } from './services/smooth-scroll.service';
import { routeFade } from './animations/route-anim';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
     HeaderComponent,
      FooterComponent,
      LoadingSpinnerComponent,
      CommonModule
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [routeFade],
})
export class AppComponent implements OnInit{
  loading$ = this.loadingService.loading$;
  hideHeader = false;
  reducedMotion = false;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private meta: Meta,
    private smoothScroll: SmoothScrollService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /** Changes per navigation so the route trigger fires; value itself is unused. */
  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.isActivated ? (outlet.activatedRoute.routeConfig?.path ?? '') : '';
  }

  private updateMeta(): void {
    let route = this.activatedRoute;
    while (route.firstChild) route = route.firstChild;
    const description = route.snapshot.data?.['description'];
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
  }

  ngOnInit(): void {
    this.themeService.initTheme();
    this.smoothScroll.init();
    if (isPlatformBrowser(this.platformId)) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
        this.hideHeader = event.url.startsWith('/admin');
      } else if (event instanceof NavigationEnd) {
        this.loadingService.hide();
        this.hideHeader = event.urlAfterRedirects.startsWith('/admin');
        this.updateMeta();
        this.handleRouteScroll();
      }
    });
  }

  private handleRouteScroll(): void {
    let route = this.activatedRoute;
    while (route.firstChild) route = route.firstChild;
    const fragment = route.snapshot.fragment;
    if (fragment) {
      // Wait a frame so the new view has rendered.
      requestAnimationFrame(() => this.smoothScroll.scrollToFragment(fragment));
    } else {
      this.smoothScroll.scrollToTop(true);
    }
  }
}
