import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunicationAppComponent } from './communication-app.component';

describe('CommunicationAppComponent', () => {
  let fixture: ComponentFixture<CommunicationAppComponent>;
  let component: CommunicationAppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      declarations: [CommunicationAppComponent],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(CommunicationAppComponent);
    component = fixture.componentInstance;
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
