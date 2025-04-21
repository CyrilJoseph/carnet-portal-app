import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AddServiceProviderComponent } from './service-provider/add/add-service-provider.component';
import { EditServiceProviderComponent } from './service-provider/edit/edit-service-provider.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'service-provider/:id', component: EditServiceProviderComponent, canActivate: [AuthGuard] },
  { path: 'add-service-provider', component: AddServiceProviderComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];