import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './auth/alert.component';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { appRoutingModule } from './app-routing.module';
import { GamelistComponent } from './game/gamelist/gamelist.component';
import { GameComponent } from './game/game/game.component';
import { CommonModule } from '@angular/common';
import { UserModule } from './user/user.module';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    appRoutingModule,
    UserModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AlertComponent,
    GamelistComponent,
    GameComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
