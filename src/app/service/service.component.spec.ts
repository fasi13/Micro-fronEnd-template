import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AppConfigService, IAppConfig } from '../app-config.service';
import { State, TestInitialState } from '../core/store/store.reducers';
import { ServiceComponent } from './service.component';

describe('ServiceComponent', () => {
  let fixture: ComponentFixture<ServiceComponent>;
  let component: ServiceComponent;
  let appConfigService: AppConfigService;
  let dummyConfig: IAppConfig;
  const initialState: State = TestInitialState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [ServiceComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.get(AppConfigService);
    let router = TestBed.get(Router);
    dummyConfig = {
      apis: [],
      services: [{id:'communication', name: 'Communications', url: '/assets/tests/package1.js'}]
    };
    spyOnProperty(appConfigService, 'config', 'get').and.returnValue(dummyConfig);
    spyOnProperty(router, 'url').and.returnValue('/tenant/1/service/communication');
    fixture.detectChanges();
  });

  it('should be created', (done) => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    done();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
