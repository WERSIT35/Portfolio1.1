import { Routes } from '@angular/router';
import { MainComponent } from './components/navigation/main/main.component';
import { EdulistComponent } from './components/navigation/main/edulist/edulist.component';
import { ExplistComponent } from './components/experience/explist/explist.component';
import { CertiListComponent } from './components/certificate/certi-list/certi-list.component';
import { ProjectsComponent } from './components/projects/projects.component';

import { ContactComponent } from './components/contact/contact.component';
import { AllEducationComponent } from './components/navigation/main/all-education/all-education.component';
import { AllExperienceComponent } from './components/experience/all-experience/all-experience.component';
import { AllCertificateComponent } from './components/certificate/all-certificate/all-certificate.component';
import { AllSkillsComponent } from './components/skills/all-skills/all-skills.component';

export const routes: Routes = [
    {path: '', component:MainComponent},
    {path: 'edu/edulist/:id', component:EdulistComponent},
    {path: 'alledu', component:AllEducationComponent},

    {path: 'exp/:id', component:ExplistComponent},
    {path: 'allexp', component:AllExperienceComponent},

    {path: 'cert/:id', component:CertiListComponent},
    {path: 'allcert', component:AllCertificateComponent},

    {path:'skills', component:AllSkillsComponent},

    {path: 'projects', component:ProjectsComponent},
    {path: 'edu', component:AllEducationComponent},
    {path: 'contact', component:ContactComponent},
    // {path: '**' , }
];
