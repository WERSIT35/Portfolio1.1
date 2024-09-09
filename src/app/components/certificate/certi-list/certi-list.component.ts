import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../../services/experience.service';
import { Certifications } from '../../../interfaces/certifications';
import { BackComponent } from "../../back/back.component";

@Component({
  selector: 'app-certi-list',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './certi-list.component.html',
  styleUrl: './certi-list.component.scss'
})
export class CertiListComponent {
  route:ActivatedRoute = inject(ActivatedRoute);

  certID=0;

  certService = inject(ExperienceService);
  cert:Certifications |undefined;

  constructor(){
    const certID = Number(this.route.snapshot.params['id']);
    this.cert = this.certService.getCertifyId(certID);
  }
}
