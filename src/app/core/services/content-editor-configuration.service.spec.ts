import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { State, TestInitialState } from "@forge/core-store";
import { provideMockStore } from "@ngrx/store/testing";
import { NotifierModule } from "angular-notifier";
import { AppConfigService, IAppConfig } from "src/app/app-config.service";
import { NgBootstrapModule } from "src/app/ng-bootstrap.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CoreModule } from "../core.module";
import { ContentEditorConfigurationService } from "./content-editor-configuration.service";
import { CultureService } from "./culture.service";
import { UserService } from "./user.service";

describe('ContentEditorConfigurationService', () => {
  let component: ContentEditorConfigurationService;
  const  initialState: State = TestInitialState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideMockStore({ initialState })],
      declarations: [],
      imports: [
        NotifierModule,
        HttpClientModule,
        CoreModule,
        CommonModule,
        SharedModule,
        NgBootstrapModule,
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
      ],
    });
    component = TestBed.get(ContentEditorConfigurationService);
    let appConfigService = TestBed.get(AppConfigService);
    const appConfig: IAppConfig = {
      apis: [
        {
          name: 'E2E.Content.Management.API',
          routePatern: new RegExp('hello\/|goodmorning\/"'),
          url: 'http://sayhi.com',
        },
      ],
      services: []
    };
    spyOnProperty(appConfigService, 'config', 'get').and.returnValue(appConfig);
    let userService = TestBed.get(UserService);
    spyOn(userService, 'getToken').and.returnValue('hello!');
    let cultureService = TestBed.get(CultureService);
    spyOn(cultureService, 'getCurrentCulture').and.returnValue('fr-CA');
  });

  it('config should be set', () => {
    expect(component).toBeTruthy();
    let config = component.get(1);
    expect(config.e2eContentManagementApiUrl).toBe('http://sayhi.com');
    expect(config.applicationId).toBe(1);
    expect(config.cultureCode).toBe('fr-CA');
    let headers = {} as any;
    config.e2eContentManagementApiAuthenticate(headers);
    expect(headers['Authorization']).toBe(`Token hello!`);
  });

});


