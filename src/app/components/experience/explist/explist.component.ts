import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../../services/experience.service';
import { Experience } from '../../../interfaces/experience';
import { BackComponent } from "../../back/back.component";

@Component({
  selector: 'app-explist',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './explist.component.html',
  styleUrl: './explist.component.scss'
})
export class ExplistComponent {
  route:ActivatedRoute = inject(ActivatedRoute);

  expID=0;

  expService =  inject(ExperienceService);
  exp:Experience |undefined;

  constructor() {
    const expID = Number(this.route.snapshot.params['id']);
    this.exp = this.expService.getExpId(expID);
  }

}
