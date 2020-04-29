import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { appRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './auth/alert.component';
import { ErrorInterceptor } from './auth/error.interceptor';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { GameComponent } from './game/game/game.component';
import { GamelistComponent } from './game/gamelist/gamelist.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserModule } from './user/user.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

@NgModule({
  imports: [
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.INFO,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
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
