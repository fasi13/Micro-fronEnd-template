import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FgeRouterService, State, TestInitialState } from '@forge/core';
import { provideMockStore } from '@ngrx/store/testing';
import { SidebarComponent } from '..';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;
  let fgeRouter: FgeRouterService;
  const initialState: State = TestInitialState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [SidebarComponent],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fgeRouter = TestBed.get(FgeRouterService);
    fixture.detectChanges();
  });

  it('should be created', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should redirect to communication', () => {
    let calledRoute = null;
    spyOn(fgeRouter, 'navigate').and.callFake((route) => calledRoute = route);
    component.goToCommunication();
    expect(calledRoute).toBe('communication');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
