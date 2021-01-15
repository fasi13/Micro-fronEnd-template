import { TestBed, getTestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FgeRouterService } from './_fge-router.service';
import { Router } from "@angular/router";
import { PageNotFoundComponent } from 'src/app/error/page-not-found/page-not-found.component';
import { provideMockStore } from '@ngrx/store/testing';
import { State, TestInitialState } from '../store/store.reducers';

const routes: Routes = [
  {
    path: '',
    component: PageNotFoundComponent,
    children: [
      {
        path: 'a',
        component: PageNotFoundComponent,
        children: [
          {
            path: 'b',
            component: PageNotFoundComponent,
            data: {test1:'test1:value'}
          },
        ]
      }
    ]
  }
];

const initialState: State = TestInitialState;

describe('FgeRouterService', () => {
  let injector: TestBed;
  let service: FgeRouterService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FgeRouterService, provideMockStore({ initialState })],
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [PageNotFoundComponent]
    });
    injector = getTestBed();
    router = injector.get(Router);
    service = injector.get(FgeRouterService);
    router.initialNavigation();
  });

  describe('getCurrentRouteData', () => {
    it('should return the current defined route data', (done) => {
      router.navigate(["/a/b"]).then(() => {
        var data = service.getCurrentRouteData('test1');
        expect(data).toBe('test1:value');
        done();
      });
    });
    it('should return the current null route data', (done) => {
      router.navigate(["/a/b"]).then(() => {
        var data = service.getCurrentRouteData('test2');
        expect(data).toBe(null);
        done();
      });
    });
  });
});
