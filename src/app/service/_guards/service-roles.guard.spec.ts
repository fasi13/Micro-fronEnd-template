import { TestBed } from '@angular/core/testing';
import { ServiceRolesGuard } from './service-roles.guard';

describe('ServiceRolesGuard', () => {
  let guard: ServiceRolesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      declarations: [],
      imports: [],
      schemas: []
    });
    guard = new ServiceRolesGuard();
  });

  it('should be created', (done) => {
    expect(guard).toBeTruthy();
    done();
  });

  it('should be able to active', (done) => {
    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });
});
