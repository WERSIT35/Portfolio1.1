import { Component, Input, OnInit } from '@angular/core';
import { Education } from '../../../../interfaces/education';
import { RouterLink } from '@angular/router';
import { EducationService } from '../../../../services/education.service';
import { BackComponent } from "../../../back/back.component";
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll.directive';
import { SpotlightDirective } from '../../../../directives/spotlight.directive';

@Component({
  selector: 'app-all-education',
  standalone: true,
  imports: [RouterLink, BackComponent, RevealOnScrollDirective, SpotlightDirective],
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
    this.educationService.getEducation().subscribe((list) => {
      this.educationList = list;
    });
  }
}
