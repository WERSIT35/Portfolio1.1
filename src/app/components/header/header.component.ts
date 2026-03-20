import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemePreference, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  readonly themeOptions: ThemePreference[] = ['light', 'dark', 'system'];

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.updateScrollState();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrollState();
  }

  private updateScrollState(): void {
    this.isScrolled = window.scrollY > 20;
  }

  setTheme(theme: ThemePreference): void {
    this.themeService.setTheme(theme);
  }
}
