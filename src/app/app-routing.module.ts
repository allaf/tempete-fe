import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { GameComponent } from './game/game/game.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'game/:id', component: GameComponent/*, canActivate: [AuthGuard]*/ }, // TODO routing guards 
  { path: '**', redirectTo: '' },
];

export const appRoutingModule = RouterModule.forRoot(routes, {
  // onSameUrlNavigation: 'reload'
});
