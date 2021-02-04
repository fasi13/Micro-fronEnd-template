import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { StartServiceComponent } from './start-service.component';

describe('StartServiceComponent', () => {
  let fixture: ComponentFixture<StartServiceComponent>;
  let component: StartServiceComponent;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ })],
      declarations: [StartServiceComponent],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(StartServiceComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
