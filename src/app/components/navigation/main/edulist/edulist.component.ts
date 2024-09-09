import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainComponent } from '../main.component';
import { EducationService } from '../../../../services/education.service';
import { Education } from '../../../../interfaces/education';
import { BackComponent } from "../../../back/back.component";

@Component({
  selector: 'app-edulist',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './edulist.component.html',
  styleUrl: './edulist.component.scss'
})
export class EdulistComponent {
  route:ActivatedRoute = inject(ActivatedRoute);

  eduID = 0;

  educationService = inject(EducationService);
  edu:Education | undefined;

  constructor(){
    const eduID = Number(this.route.snapshot.params['id']);
    this.edu = this.educationService.getEduId(eduID);
  }
  
}
