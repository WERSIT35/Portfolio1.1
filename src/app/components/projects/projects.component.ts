import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { BackComponent } from "../back/back.component";
import { Projects } from '../../interfaces/projects';
import { ProjectsService } from '../../services/projects.service';
import { RouterLink } from '@angular/router';
import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [BackComponent,RouterLink,CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements AfterViewInit, OnInit{
  @Input() projects!: Projects;
  projectsList: Projects[] = [];
  projectViewMode: Record<number, 'web' | 'mobile'> = {};
  private splideMap = new Map<string, Splide>();
  previewImage: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    protected projectService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.projectsList = this.projectService.getProjects();
    this.projectsList.forEach((project, index) => {
      if (this.hasSplitMedia(project)) {
        this.projectViewMode[index] = 'web';
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mountVisibleProjectSliders();
    }
  }

  private mountVisibleProjectSliders(): void {
    const sliders = document.querySelectorAll<HTMLElement>('.project-slider');
    sliders.forEach((slider) => this.mountSliderById(slider.id));
  }

  private mountSliderById(id: string): void {
    if (this.splideMap.has(id)) {
      this.splideMap.get(id)?.refresh();
      return;
    }
    const root = document.getElementById(id);
    if (!root) return;

    const splide = new Splide(`#${id}`, {
      type: 'slide',
      pagination: false,
      arrows: true,
      drag: true,
      gap: '0.6rem',
    });
    splide.mount();
    this.splideMap.set(id, splide);
  }

  openPreview(image: string): void {
    this.previewImage = image;
  }

  closePreview(): void {
    this.previewImage = null;
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

  getVisibleImages(project: Projects, index: number): string[] {
    if (!this.hasSplitMedia(project)) return project.img;
    return this.projectViewMode[index] === 'mobile'
      ? this.getMobileImages(project)
      : this.getWebImages(project);
  }

  isProjectMobile(index: number): boolean {
    return this.projectViewMode[index] === 'mobile';
  }

  toggleProjectView(index: number): void {
    this.projectViewMode[index] = this.projectViewMode[index] === 'mobile' ? 'web' : 'mobile';
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.splideMap.get(`projects${index}`)?.refresh());
  }
}
