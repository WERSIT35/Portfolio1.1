import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import Splide from '@splidejs/splide';
import { ProjectsService } from '../../services/projects.service';
import { Projects } from '../../interfaces/projects';
import { editorialSplideOptions } from '../../shared/splide-config';
import { getTechIcon, TechIcon } from '../../shared/tech-icons';

@Component({
  selector: 'app-featured-work',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-work.component.html',
  styleUrl: './featured-work.component.scss',
})
export class FeaturedWorkComponent implements OnInit, AfterViewInit, OnDestroy {
  featured: { project: Projects; index: number }[] = [];
  private slider?: Splide;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((all) => {
      this.featured = all
        .map((project, index) => ({ project, index }))
        .filter((x) => x.project.featured && !x.project.projName.startsWith('TODO'))
        .slice(0, 6);
      this.mountSliderIfReady();
    });
  }

  ngAfterViewInit(): void {
    this.mountSliderIfReady();
  }

  private mountSliderIfReady(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.featured.length === 0 || this.slider) return;
    const opts = editorialSplideOptions(2, { loop: this.featured.length > 2 });
    opts.arrows = false;
    queueMicrotask(() => {
      if (document.getElementById('featuredWork')) {
        this.slider = new Splide('#featuredWork', opts).mount();
      }
    });
  }

  ngOnDestroy(): void {
    this.slider?.destroy(true);
  }

  prev(): void { this.slider?.go('<'); }
  next(): void { this.slider?.go('>'); }

  techIcon(name: string): TechIcon | null {
    return getTechIcon(name);
  }

  statusLabel(p: Projects): string {
    switch (p.status) {
      case 'live': return 'Live';
      case 'in-production': return 'In production';
      case 'in-development': return 'In development';
      case 'archived': return 'Archived';
      case 'private': return 'Private';
      default: return '';
    }
  }
}
