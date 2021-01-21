import { TestBed } from '@angular/core/testing';
import { ServiceScriptResolver } from './service-script-resolver';
import { AppConfigService, IAppConfig } from '../app-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterStateSnapshot } from '@angular/router';

describe('ServiceScriptResolver', () => {
  let service: ServiceScriptResolver;
  let appConfigService: AppConfigService;
  let dummyConfig: IAppConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfigService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(ServiceScriptResolver);
    appConfigService = TestBed.get(AppConfigService);
    dummyConfig = {
      apis: [],
      services: [{id:'communication', name: 'Communications', url: '/assets/tests/package1.js'}]
    };
    spyOnProperty(appConfigService, 'config', 'get').and.returnValue(
      dummyConfig
    );
  });

  const mock = <T, P extends keyof T>(obj: Pick<T, P>): T => obj as T;
  const state = mock<RouterStateSnapshot, "url">({
    url: "/tenant/1/service/communication"
  });

  describe('getCurrentRouteData', () => {
    it('should resolve when script is loaded', (done) => {
      window["tested"] = undefined;
      service.resolve(undefined, state).then(function() {
        expect(window["tested"]).toBe(1);
        done();
      });
    });
    it('should reject when script cannot be loaded', (done) => {
      window["tested"] = undefined;
      dummyConfig.services = [{id:'communication', name: 'Communications', url: '/filenotfoundoh.js'}]
      service.resolve(undefined, state).catch(function() {
        expect(window["tested"]).toBe(undefined);
        done();
      });
    });
    it('should resolve when script is already loaded', (done) => {
      window["tested"] = undefined;
      service.resolve(undefined, state).then(function() {
        expect(window["tested"]).toBe(1);
        expect(service.loaded).toBe(true);
        window["tested"] = undefined;
        service.resolve(undefined, state).then(function() {
          expect(window["tested"]).toBe(undefined);
          done();
        });
      });
    });
  });
});
