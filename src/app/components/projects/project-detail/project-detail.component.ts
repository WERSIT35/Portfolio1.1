import { AfterViewInit, Component, DestroyRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Projects } from '../../../interfaces/projects';
import { ProjectsService } from '../../../services/projects.service';
import { BackComponent } from '../../back/back.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Splide from '@splidejs/splide';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { RouterLink } from '@angular/router';
import { editorialSplideOptions } from '../../../shared/splide-config';
import { getTechIcon, TechIcon } from '../../../shared/tech-icons';

type EmbedState = 'loading' | 'ready' | 'unavailable';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [BackComponent, CommonModule, RevealOnScrollDirective, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private projectsService: ProjectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);
  private projectIndex = 0;

  project: Projects | undefined;
  related: { project: Projects; index: number }[] = [];
  viewMode: 'web' | 'mobile' = 'web';
  private slider?: Splide;
  previewImage: string | null = null;

  /** Stable iframe url + render state. Computed once per project, NOT a getter —
      a getter would hand Angular a fresh SafeResourceUrl on every change-detection
      cycle, and Angular would rewrite the iframe `src` (= full reload) on every
      scroll/mouse event. */
  safeDemoUrl: SafeResourceUrl | null = null;
  embedState: EmbedState = 'loading';
  private embedTimeoutId?: ReturnType<typeof setTimeout>;
  private static readonly EMBED_TIMEOUT_MS = 8000;

  /** chapter id → label for the anchor strip */
  get availableChapters(): { id: string; label: string }[] {
    if (!this.project) return [];
    const out: { id: string; label: string }[] = [];
    if (this.project.problem) out.push({ id: 'problem', label: '01 Problem' });
    if (this.project.approach?.length) out.push({ id: 'approach', label: '02 Approach' });
    if (this.hasMedia(this.project)) out.push({ id: 'screenshots', label: '03 Screenshots' });
    if (this.safeDemoUrl) out.push({ id: 'live-demo', label: '04 Live demo' });
    out.push({ id: 'details', label: '05 Detail' });
    if (this.project.metrics?.length) out.push({ id: 'results', label: '06 Results' });
    if (this.project.lessons) out.push({ id: 'lessons', label: '07 Lessons' });
    if (this.hasLinks(this.project)) out.push({ id: 'links', label: '08 Links' });
    return out;
  }

  hasLinks(project: Projects): boolean {
    return !!((project.iflink && project.link) || project.github);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer,
  ) {
    this.destroyRef.onDestroy(() => this.clearEmbedTimeout());
  }

  techIcon(name: string): TechIcon | null {
    return getTechIcon(name);
  }

  statusLabel(): string {
    switch (this.project?.status) {
      case 'live': return 'Live';
      case 'in-production': return 'In production';
      case 'in-development': return 'In development';
      case 'archived': return 'Archived';
      case 'private': return 'Private';
      default: return '';
    }
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.projectIndex = Number(params.get('id'));
          return this.projectsService.getProjects();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((all) => {
        this.project = all[this.projectIndex];
        if (this.project && !this.hasSplitMedia(this.project)) {
          this.viewMode = 'web';
        }
        this.related = all
          .map((project, index) => ({ project, index }))
          .filter((e) => e.index !== this.projectIndex && !e.project.projName.startsWith('TODO'))
          .slice(0, 2);

        this.refreshDemoEmbed();

        if (isPlatformBrowser(this.platformId)) {
          // Defer to the next tick so Splide mounts against the freshly-rendered slides.
          setTimeout(() => this.mountSlider());
        }
      });
  }

  ngAfterViewInit(): void {
    this.mountSlider();
  }

  /** Build the SafeResourceUrl once and reset embed state. Called on project change
      and on manual refresh — never during change detection. */
  private refreshDemoEmbed(): void {
    this.clearEmbedTimeout();
    const url = this.project?.demoEmbedUrl;
    if (!url) {
      this.safeDemoUrl = null;
      this.embedState = 'loading';
      return;
    }
    this.safeDemoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.embedState = 'loading';
    if (!isPlatformBrowser(this.platformId)) return;
    this.embedTimeoutId = setTimeout(() => {
      if (this.embedState === 'loading') {
        this.embedState = 'unavailable';
      }
    }, ProjectDetailComponent.EMBED_TIMEOUT_MS);
  }

  private clearEmbedTimeout(): void {
    if (this.embedTimeoutId !== undefined) {
      clearTimeout(this.embedTimeoutId);
      this.embedTimeoutId = undefined;
    }
  }

  /** iframe (load) handler — fires on successful navigation OR on some browsers'
      X-Frame-Options refusal page. The timeout catches the silent-blank cases. */
  onEmbedLoad(): void {
    this.clearEmbedTimeout();
    if (this.embedState !== 'unavailable') {
      this.embedState = 'ready';
    }
  }

  onEmbedError(): void {
    this.clearEmbedTimeout();
    this.embedState = 'unavailable';
  }

  /** User-triggered retry from the fallback UI. */
  retryEmbed(): void {
    this.refreshDemoEmbed();
  }

  private mountSlider(): void {
    if (!isPlatformBrowser(this.platformId) || !this.project || !this.project.img.length) return;
    if (this.slider) {
      this.slider.destroy(true);
      this.slider = undefined;
    }
    const opts = editorialSplideOptions(1);
    opts.arrows = false;
    opts.pagination = true;
    opts.padding = { left: '0', right: '0' };
    this.slider = new Splide('#projectDetailAll', opts).mount();
  }

  shotsPrev(): void { this.slider?.go('<'); }
  shotsNext(): void { this.slider?.go('>'); }

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

  hasMedia(project: Projects): boolean {
    return Array.isArray(project.img) && project.img.length > 0;
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
