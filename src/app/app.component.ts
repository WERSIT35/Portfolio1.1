import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';

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
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  loading$ = this.loadingService.loading$;
  hideHeader = false;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private meta: Meta,
  ) {}

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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
        this.hideHeader = event.url.startsWith('/admin');
      } else if (event instanceof NavigationEnd) {
        this.loadingService.hide();
        this.hideHeader = event.urlAfterRedirects.startsWith('/admin');
        this.updateMeta();
      }
    });
  }
}
