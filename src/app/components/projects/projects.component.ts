import { Component } from '@angular/core';
import { BackComponent } from "../back/back.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

}
