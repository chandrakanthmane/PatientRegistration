import { Routes } from '@angular/router';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientQueryComponent } from './components/patient-query/patient-query.component';

export const routes: Routes = [
    { 
      path: '', 
      redirectTo: '/register', 
      pathMatch: 'full' 
    },
    { 
      path: 'register', 
      component: PatientFormComponent,
      data: { animation: 'RegisterPage' } 
    },
    { 
      path: 'patients', 
      component: PatientListComponent,
      data: { animation: 'PatientsPage' } 
    },
    { 
      path: 'query', 
      component: PatientQueryComponent,
      data: { animation: 'QueryPage' } 
    },
    { 
      path: '**', 
      redirectTo: '/register' 
    }
];
