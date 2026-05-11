import { Routes } from '@angular/router';
import { MainComponent } from './components/navigation/main/main.component';
import { EdulistComponent } from './components/navigation/main/edulist/edulist.component';
import { ExplistComponent } from './components/experience/explist/explist.component';
import { CertiListComponent } from './components/certificate/certi-list/certi-list.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectDetailComponent } from './components/projects/project-detail/project-detail.component';

import { ContactComponent } from './components/contact/contact.component';
import { AllEducationComponent } from './components/navigation/main/all-education/all-education.component';
import { AllExperienceComponent } from './components/experience/all-experience/all-experience.component';
import { AllCertificateComponent } from './components/certificate/all-certificate/all-certificate.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
    {path: '', component:MainComponent, title: 'Oto Davitashvili — Full-stack Engineer', data: { description: 'Production Angular, Node/Express, FastAPI and AWS. Selected work, case studies, and live demos.' }},
    {path: 'edu/edulist/:id', component:EdulistComponent, title: 'Education — Oto Davitashvili'},
    {path: 'alledu', component:AllEducationComponent, title: 'All Education — Oto Davitashvili', data: { description: 'University, DevOps, and continuing education paths.' }},

    {path: 'exp/:id', component:ExplistComponent, title: 'Experience — Oto Davitashvili'},
    {path: 'allexp', component:AllExperienceComponent, title: 'Experience — Oto Davitashvili', data: { description: 'Engineering roles, responsibilities, and shipped impact.' }},

    {path: 'cert/:id', component:CertiListComponent, title: 'Certificate — Oto Davitashvili'},
    {path: 'allcert', component:AllCertificateComponent, title: 'Certificates — Oto Davitashvili', data: { description: 'Professional certifications and verified achievements.' }},

    {path: 'projects/:id', component:ProjectDetailComponent, title: 'Case Study — Oto Davitashvili'},
    {path: 'projects', component:ProjectsComponent, title: 'Projects — Oto Davitashvili', data: { description: 'Full-stack and frontend projects shipped to production.' }},
    {path: 'admin/login', component: AdminLoginComponent, title: 'Admin Login'},
    {path: 'admin', component: AdminDashboardComponent, canActivate: [adminAuthGuard], title: 'Admin'},
    {path: 'edu', component:AllEducationComponent, title: 'Education — Oto Davitashvili'},
    {path: 'contact', component:ContactComponent, title: 'Contact — Oto Davitashvili', data: { description: 'Reach out for full-stack engineering work, collaborations, or roles.' }},
    // {path: '**' , }
];
