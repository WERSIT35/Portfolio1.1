import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../../services/experience.service';
import { Certifications } from '../../../interfaces/certifications';
import { BackComponent } from '../../back/back.component';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-certi-list',
  standalone: true,
  imports: [BackComponent, CommonModule, RevealOnScrollDirective],
  templateUrl: './certi-list.component.html',
  styleUrl: './certi-list.component.scss',
})
export class CertiListComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  certID = 0;
  certService = inject(ExperienceService);
  cert: Certifications | undefined;
  previewImage: string | null = null;

  constructor() {
    const certID = Number(this.route.snapshot.params['id']);
    this.cert = this.certService.getCertifyId(certID);
  }

  openPreview(image: string): void { this.previewImage = image; }
  closePreview(): void { this.previewImage = null; }
}
