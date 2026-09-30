import { Component, DOCUMENT, OnDestroy, Renderer2, inject } from '@angular/core';
import { HeroSection } from '../../components/hero/hero-section/hero-section';
import { ExperienceSection } from '../../components/experience/experience-section/experience-section';
import { ProjectsSection } from '../../components/projects/projects-section/projects-section';
import { SkillsSection } from '../../components/skills/skills-section/skills-section';
import { CertificationsSection } from '../../components/certifications/certifications-section/certifications-section';
import { EducationSection } from '../../components/education/education-section/education-section';
import { ContactSection } from '../../components/contact/contact-section/contact-section';

const SNAP_CLASS = 'has-snap';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroSection,
    ExperienceSection,
    ProjectsSection,
    SkillsSection,
    CertificationsSection,
    EducationSection,
    ContactSection,
  ],
  templateUrl: './home-page.html',
})
export class HomePage implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  constructor() {
    // Only the home page snaps between full-viewport stages; detail pages scroll freely.
    this.renderer.addClass(this.document.documentElement, SNAP_CLASS);
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.documentElement, SNAP_CLASS);
  }
}
