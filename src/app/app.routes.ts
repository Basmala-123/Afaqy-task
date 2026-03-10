import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  // { path: 'rooms', component: RoomsComponent },
  // { path: 'alerts', component: AlertsComponent },

];
