import { Routes } from '@angular/router';
import { MainComponent } from './components/navigation/main/main.component';
import { EdulistComponent } from './components/navigation/main/edulist/edulist.component';
import { ExplistComponent } from './components/experience/explist/explist.component';

export const routes: Routes = [
    {path: '', component:MainComponent},
    {path: 'edulist/:id', component:EdulistComponent},
    {path: 'exp/:id', component:ExplistComponent},
];
