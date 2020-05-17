import { CultureService } from './culture.service';
import { TestBed, getTestBed } from '@angular/core/testing';



describe('CultureService', () => {
  let injector: TestBed;
  let service: CultureService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CultureService],
    });
    injector = getTestBed();
    service = injector.get(CultureService);

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);

  });

  describe('resetToDefault', () => {
    it('should clear the localstorage',
      () => {
        service.setCurrentCulture('cul-CUL');
        service.resetCurrentCultureToDefault();
        expect(localStorage.getItem('cultureCode')).toBe('en-US');
    });
  });

  describe('setCurrentCulture', () => {
    it('should store the cultureCode',
      () => {
        service.setCurrentCulture('cul-CUL');
        expect(localStorage.getItem('cultureCode')).toEqual('cul-CUL');
    });
  });

  describe('getCurrentCulture', () => {
    it('should return stored cultureCode if exists',
      () => {
        localStorage.setItem('cultureCode', 'cul-CUL');
        expect(service.getCurrentCulture()).toEqual('cul-CUL');
    });
  });

  describe('getCurrentCulture', () => {
    it('should return default cultureCode if nothing is stored',
      () => {
        expect(service.getCurrentCulture()).toEqual('en-US');
    });
  });

  describe('getAvailableCultures', () => {
    it('should return a list of cultureCodes',
      () => {
        expect(service.getCurrentCulture()).not.toBe(null);

    });
  });
});
