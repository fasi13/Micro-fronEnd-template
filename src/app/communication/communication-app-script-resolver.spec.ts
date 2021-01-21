import { TestBed } from '@angular/core/testing';
import { CommunicationAppScriptResolver } from './communication-app-script-resolver';
import { AppConfigService, IAppConfig } from '../app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommunicationAppScriptResolver', () => {
  let service: CommunicationAppScriptResolver;
  let appConfigService: AppConfigService;
  let dummyConfig: IAppConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfigService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(CommunicationAppScriptResolver);
    appConfigService = TestBed.get(AppConfigService);
    dummyConfig = {
      apis: [],
      e2eCommunicationManagementAppPackageUrl: "/assets/tests/package1.js"
    };
    spyOnProperty(appConfigService, 'config', 'get').and.returnValue(
      dummyConfig
    );
  });

  describe('getCurrentRouteData', () => {
    it('should resolve when script is loaded', (done) => {
      window["tested"] = undefined;
      service.resolve().then(function() {
        expect(window["tested"]).toBe(1);
        done();
      });
    });
    it('should reject when script cannot be loaded', (done) => {
      window["tested"] = undefined;
      dummyConfig.e2eCommunicationManagementAppPackageUrl = "/filenotfoundoh.js"
      service.resolve().catch(function() {
        expect(window["tested"]).toBe(undefined);
        done();
      });
    });
    it('should resolve when script is already loaded', (done) => {
      window["tested"] = undefined;
      service.resolve().then(function() {
        expect(window["tested"]).toBe(1);
        expect(service.loaded).toBe(true);
        window["tested"] = undefined;
        service.resolve().then(function() {
          expect(window["tested"]).toBe(undefined);
          done();
        });
      });
    });
  });
});
