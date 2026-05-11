import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Certifications } from '../../interfaces/certifications';
import { ExperienceService } from '../../services/experience.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Splide from '@splidejs/splide';
import { RouterLink } from '@angular/router';
import { editorialSplideOptions } from '../../shared/splide-config';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss',
})
export class CertificateComponent implements AfterViewInit, OnInit, OnDestroy {
  certificationList: Certifications[] = [];
  private slider?: Splide;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private certificate: ExperienceService,
  ) {}

  ngOnInit(): void {
    this.certificationList = this.certificate.getCertificate();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.certificationList.length === 0) return;
    const opts = editorialSplideOptions(3, { loop: this.certificationList.length > 3 });
    opts.arrows = false;
    this.slider = new Splide('#certificate', opts).mount();
  }

  ngOnDestroy(): void { this.slider?.destroy(true); }

  prev(): void { this.slider?.go('<'); }
  next(): void { this.slider?.go('>'); }
}
