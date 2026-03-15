import { AfterViewInit, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Projects } from '../../../interfaces/projects';
import { ProjectsService } from '../../../services/projects.service';
import { BackComponent } from '../../back/back.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [BackComponent, CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private projectsService: ProjectsService = inject(ProjectsService);
  private projectIndex = 0;

  project: Projects | undefined;
  viewMode: 'web' | 'mobile' = 'web';
  private slider?: Splide;
  previewImage: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.projectIndex = Number(this.route.snapshot.params['id']);
    this.project = this.projectsService.getProjectById(this.projectIndex);
    if (this.project && !this.hasSplitMedia(this.project)) {
      this.viewMode = 'web';
    }
  }

  ngAfterViewInit(): void {
    this.mountSlider();
  }

  private mountSlider(): void {
    if (!isPlatformBrowser(this.platformId) || !this.project) return;
    if (this.slider) {
      this.slider.destroy(true);
    }
    this.slider = new Splide('#projectDetailAll', {
      type: 'slide',
      pagination: false,
      arrows: true,
      drag: true,
      gap: '0.7rem',
    }).mount();
  }

  getWebImages(project: Projects): string[] {
    const web = project.img.filter((image) => /web/i.test(image));
    return web.length ? web : project.img;
  }

  getMobileImages(project: Projects): string[] {
    return project.img.filter((image) => /mob|mobile/i.test(image));
  }

  hasSplitMedia(project: Projects): boolean {
    return this.getWebImages(project).length > 0 && this.getMobileImages(project).length > 0;
  }

  get currentImages(): string[] {
    if (!this.project) return [];
    return this.viewMode === 'mobile' ? this.getMobileImages(this.project) : this.getWebImages(this.project);
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'web' ? 'mobile' : 'web';
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.mountSlider());
  }

  openPreview(image: string): void {
    this.previewImage = image;
  }

  closePreview(): void {
    this.previewImage = null;
  }
}
