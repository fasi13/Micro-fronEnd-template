import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommunicationAppComponent } from './communication-app.component';

describe('CommunicationAppComponent', () => {
  let fixture: ComponentFixture<CommunicationAppComponent>;
  let component: CommunicationAppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      declarations: [CommunicationAppComponent],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(CommunicationAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
