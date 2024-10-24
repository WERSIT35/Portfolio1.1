import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (event instanceof NavigationEnd) {
        this.loadingService.hide();
      }
    });
  }
}
