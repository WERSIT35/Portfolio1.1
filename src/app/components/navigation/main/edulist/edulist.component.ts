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
  // route: ActivatedRoute = inject(ActivatedRoute);

  // eduID = 0;
  // educationService = inject(EducationService);
  // edu: Education | undefined;
  // suggestions: Education[] = [];

  // constructor() {
  //   const eduID = Number(this.route.snapshot.params['id']);
  //   this.eduID = eduID;
    
  //   this.edu = this.educationService.getEduId(eduID);
    
  //   const allEdu = this.educationService.getEducation();
  //   this.suggestions = allEdu.filter(item => item.id !== eduID);
  // }

  route: ActivatedRoute = inject(ActivatedRoute);
  eduID: number = 0;
  educationService = inject(EducationService);
  edu: Education | undefined;
  suggestions: Education[] = [];  // Store suggested items

  constructor() {}

  ngOnInit() {
    // Subscribe to route parameters to detect changes in the URL
    this.route.params.subscribe(params => {
      this.eduID = Number(params['id']);  // Update the eduID when the route changes
      
      // Update the selected education item
      this.edu = this.educationService.getEduId(this.eduID);

      // Update the suggestions by filtering out the selected item
      const allEdu = this.educationService.getEducation();
      this.suggestions = allEdu.filter(item => item.id !== this.eduID);
    });
  }

}
