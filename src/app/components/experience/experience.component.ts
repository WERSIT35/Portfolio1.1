import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Experience } from '../../interfaces/experience';
import { ExperienceService } from '../../services/experience.service';
import Splide from '@splidejs/splide';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { editorialSplideOptions } from '../../shared/splide-config';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements AfterViewInit, OnInit, OnDestroy {
  experienceList: Experience[] = [];
  private slider?: Splide;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private experienceService: ExperienceService,
  ) {}

  ngOnInit(): void {
    this.experienceList = this.experienceService.getExperienceList();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.experienceList.length === 0) return;
    const opts = editorialSplideOptions(2, { loop: this.experienceList.length > 2 });
    opts.arrows = false;
    this.slider = new Splide('#experience', opts).mount();
  }

  ngOnDestroy(): void { this.slider?.destroy(true); }

  prev(): void { this.slider?.go('<'); }
  next(): void { this.slider?.go('>'); }
}
