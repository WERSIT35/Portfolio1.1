import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ThemePreference, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMoreOpen = false;
  currentUrl = '/';
  readonly themeOptions: ThemePreference[] = ['light', 'dark', 'system'];

  /** Routes hidden under the "More" button — active state lights up the button. */
  private readonly moreRoutes = ['/alledu', '/allcert', '/cert', '/contact'];

  private routeSub?: Subscription;

  constructor(
    public themeService: ThemeService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.updateScrollState();
    this.currentUrl = this.router.url;
    this.routeSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.urlAfterRedirects;
        this.closeMore();
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.removeProperty('overflow');
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrollState();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isMoreOpen) this.closeMore();
  }

  private updateScrollState(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isScrolled = window.scrollY > 20;
  }

  setTheme(theme: ThemePreference): void {
    this.themeService.setTheme(theme);
  }

  toggleMore(): void {
    this.isMoreOpen = !this.isMoreOpen;
  }

  closeMore(): void {
    if (!this.isMoreOpen) return;
    this.isMoreOpen = false;
  }

  /** True when the active route lives under the "More" menu. */
  get isMoreRouteActive(): boolean {
    return this.moreRoutes.some((p) =>
      p === '/cert' ? this.currentUrl.startsWith('/cert') : this.currentUrl === p,
    );
  }
}
