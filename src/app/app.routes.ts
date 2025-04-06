import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AddServiceProviderComponent } from './service-provider/add/add-service-provider.component';
import { EditServiceProviderComponent } from './service-provider/edit/edit-service-provider.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'service-provider/:id', component: EditServiceProviderComponent },
  { path: 'add-service-provider', component: AddServiceProviderComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];