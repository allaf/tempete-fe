import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { GameComponent } from './game/game/game.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'game/:id', component: GameComponent, canActivate: [AuthGuard] },
  { path: 'todo', component: TodoComponent },
  { path: '**', redirectTo: '' },
];

export const appRoutingModule = RouterModule.forRoot(routes, {
  // onSameUrlNavigation: 'reload'
});
