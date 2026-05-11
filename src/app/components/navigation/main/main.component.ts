import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import Splide from '@splidejs/splide';
import { EducationService } from '../../../services/education.service';
import { Education } from '../../../interfaces/education';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ExperienceComponent } from '../../experience/experience.component';
import { RouterLink } from '@angular/router';
import { CertificateComponent } from '../../certificate/certificate.component';
import { FeaturedWorkComponent } from '../../featured-work/featured-work.component';
import { ProcessComponent } from '../../process/process.component';
import { ChapterComponent } from '../../shared/chapter/chapter.component';
import { WhatIDoComponent } from '../../home/what-i-do/what-i-do.component';
import { SkillsRailComponent } from '../../home/skills-rail/skills-rail.component';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { editorialSplideOptions } from '../../../shared/splide-config';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ExperienceComponent,
    CertificateComponent,
    FeaturedWorkComponent,
    ProcessComponent,
    ChapterComponent,
    WhatIDoComponent,
    SkillsRailComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements AfterViewInit, OnInit, OnDestroy {
  educationList: Education[] = [];
  private eduSlider?: Splide;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService: EducationService,
  ) {}

  ngOnInit(): void {
    this.educationList = this.educationService.getEducation();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.educationList.length === 0) return;
    const opts = editorialSplideOptions(2, { loop: this.educationList.length > 2 });
    opts.arrows = false;
    this.eduSlider = new Splide('#education', opts).mount();
  }

  ngOnDestroy(): void { this.eduSlider?.destroy(true); }

  eduPrev(): void { this.eduSlider?.go('<'); }
  eduNext(): void { this.eduSlider?.go('>'); }
}
