import { Routes } from '@angular/router';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientQueryComponent } from './components/patient-query/patient-query.component';

export const routes: Routes = [
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: 'register', component: PatientFormComponent },
    { path: 'patients', component: PatientListComponent },
    { path: 'query', component: PatientQueryComponent },
    { path: '**', redirectTo: '/register' }
];
