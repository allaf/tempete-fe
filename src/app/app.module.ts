import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { SocketIoModule } from 'ngx-socket-io';
import { config } from 'src/environments/environment';
import { appRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './auth/alert.component';
import { ErrorInterceptor } from './auth/error.interceptor';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ChessboardModule } from './chessboard/chessboard.module';
import { GameComponent } from './game/game/game.component';
import { GamelistComponent } from './game/gamelist/gamelist.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserModule } from './user/user.module';
import { UserListComponent } from './userlist/userlist.component';
import { TodoModule } from './todo/todo.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    SocketIoModule.forRoot({
      options: {
        // TODO jwt secure
        // autoConnect: false,
        // query: { JWT_TOKEN: localStorage.getItem('JWT_TOKEN') },
      },
      url: config.wsUrl,
    }),
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.INFO,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    appRoutingModule,
    UserModule,
    ChessboardModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AlertComponent,
    GamelistComponent,
    GameComponent,
    UserListComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
