import { Component } from '@angular/core';
import { BackComponent } from "../back/back.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BackComponent,CommonModule
    
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  showImageModal: boolean = false;
  openImageModal() {
    this.showImageModal = true;
  }
  
  closeImageModal() {
    this.showImageModal = false;
  }
}
