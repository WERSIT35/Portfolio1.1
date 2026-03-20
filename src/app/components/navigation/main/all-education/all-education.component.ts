import { Component, Input, OnInit } from '@angular/core';
import { Education } from '../../../../interfaces/education';
import { RouterLink } from '@angular/router';
import { EducationService } from '../../../../services/education.service';
import { BackComponent } from "../../../back/back.component";

@Component({
  selector: 'app-all-education',
  standalone: true,
  imports: [RouterLink, BackComponent],
  templateUrl: './all-education.component.html',
  styleUrl: './all-education.component.scss'
})
export class AllEducationComponent implements OnInit{
  @Input() education!:Education;
  
  educationList:Education[]=[];


  constructor(
    private educationService:EducationService,
  ) {}

  ngOnInit(): void {
      this.educationList = this.educationService.getEducation();
  }
}
