import { Routes } from '@angular/router';
import { MainComponent } from './components/navigation/main/main.component';
import { EdulistComponent } from './components/navigation/main/edulist/edulist.component';
import { ExplistComponent } from './components/experience/explist/explist.component';
import { CertiListComponent } from './components/certificate/certi-list/certi-list.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { EducationComponent } from './components/education/education.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
    {path: '', component:MainComponent},
    {path: 'edulist/:id', component:EdulistComponent},
    {path: 'exp/:id', component:ExplistComponent},
    {path: 'cert/:id', component:CertiListComponent},
    {path: 'projects', component:ProjectsComponent},
    {path: 'edu', component:EducationComponent},
    {path: 'contact', component:ContactComponent},
    // {path: '**' , }
];
