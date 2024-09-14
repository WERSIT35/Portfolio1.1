import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { BackComponent } from "../back/back.component";
import { Projects } from '../../interfaces/projects';
import { ProjectsService } from '../../services/projects.service';
import { RouterLink } from '@angular/router';
import '@splidejs/splide/css';
import Splide from '@splidejs/splide';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [BackComponent,RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements AfterViewInit, OnInit{
  @Input() projects!:Projects;

  projectsList: Projects[] = [];


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    protected projectService: ProjectsService
  ){}

  ngOnInit(): void {
      this.projectsList = this.projectService.getProjects();
  }


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
        this.projectsList.forEach((_, index) => {
        const splide = new Splide(`#projects${index}`);
        splide.mount();
      });
    }
  }
}
