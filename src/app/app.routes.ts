
import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { HomeComponent } from './features/Home/Home.component';
import { LoginComponent } from './features/auth//login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DynamicComponent } from './features/dynamichomeScreen/dynamic/dynamic.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
    { path: 'dynamicComp', component: DynamicComponent },

  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
