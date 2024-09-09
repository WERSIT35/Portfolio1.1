import { Component } from '@angular/core';
import { BackComponent } from "../back/back.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
