import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FgeRouterService, State, TestInitialState } from '@forge/core';
import { provideMockStore } from '@ngrx/store/testing';
import { AppConfigService, IAppConfig } from 'src/app/app-config.service';
import { SidebarComponent } from '..';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;
  let fgeRouter: FgeRouterService;
  const initialState: State = TestInitialState;
  let appConfigService: AppConfigService;
  let dummyConfig: IAppConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [SidebarComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fgeRouter = TestBed.get(FgeRouterService);
    appConfigService = TestBed.get(AppConfigService);
    dummyConfig = {
      apis: [],
      services: [{id:'communication', name: 'Communications', url: '/assets/tests/package1.js'}]
    };
    spyOnProperty(appConfigService, 'config', 'get').and.returnValue(dummyConfig);
    fixture.detectChanges();
  });

  it('should be created', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should redirect to communication', () => {
    let calledRoute = null;
    spyOn(fgeRouter, 'navigate').and.callFake((route) => calledRoute = route);
    component.goToService('communication');
    expect(calledRoute).toBe('service/start/communication/');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
