import { TestBed } from '@angular/core/testing';
import { CommunicationRolesGuard } from './communication-roles.guard';

describe('CommunicationRolesGuard', () => {
  let guard: CommunicationRolesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      declarations: [],
      imports: [],
      schemas: []
    });
    guard = new CommunicationRolesGuard();
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
