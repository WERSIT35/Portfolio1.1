import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EducationService } from '../../../../services/education.service';
import { Education } from '../../../../interfaces/education';
import { BackComponent } from "../../../back/back.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edulist',
  standalone: true,
  imports: [BackComponent,RouterLink,CommonModule],
  templateUrl: './edulist.component.html',
  styleUrl: './edulist.component.scss'
})
export class EdulistComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  eduID: number = 0;
  educationService = inject(EducationService);
  edu: Education | undefined;
  suggestions: Education[] = [];

  constructor() {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eduID = Number(params['id']);
      this.edu = this.educationService.getEduId(this.eduID);
      const allEdu = this.educationService.getEducation();
      this.suggestions = allEdu.filter(item => item.id !== this.eduID);
    });
  }

}
