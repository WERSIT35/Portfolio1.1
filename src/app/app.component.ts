import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
     HeaderComponent,
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
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.initTheme();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
        this.hideHeader = event.url.startsWith('/admin');
      } else if (event instanceof NavigationEnd) {
        this.loadingService.hide();
        this.hideHeader = event.urlAfterRedirects.startsWith('/admin');
      }
    });
  }
}
