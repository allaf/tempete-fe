import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Socket } from 'ngx-socket-io';
import { GamelistComponent } from './gamelist.component';

describe('GamelistComponent', () => {
  let component: GamelistComponent;
  let fixture: ComponentFixture<GamelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        LoggerTestingModule,
      ],
      declarations: [GamelistComponent],
      providers: [{ provide: Socket, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
