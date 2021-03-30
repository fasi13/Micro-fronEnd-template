import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService, IAppConfig } from 'src/app/app-config.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldContentEditorComponent } from './field-content-editor.component';

describe('FieldContentEditorComponent', () => {
  let component: FieldContentEditorComponent;
  let fixture: ComponentFixture<FieldContentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SharedModule],
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    const appConfigService = TestBed.get(AppConfigService);
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
    appConfigService._config = appConfig;

    fixture = TestBed.createComponent(FieldContentEditorComponent);
    component = fixture.componentInstance;
    component.group = new FormGroup([] as any);
    component.group.addControl('name', new FormControl('value'));
    component.config = { name: 'name', type: 'text', applicationId: 1, original: {name: 'name', type: 'text'} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('color type should be changed to color picker', () => {
    (component.config as any).original.type = 'color';
    component.content = null;
    component.ngOnInit();
    expect(component.content.dataType.name).toBe('color picker');
  });
  it('valueChanges should emit if nativeElement has setValue defined', () => {
    let settedValue;
    component.contentEditor.nativeElement.value = (value) => {
      settedValue = value;
    }
    component.group.get('name').setValue('cool');
    expect(settedValue).toBe('cool');
  });
  it('valueChanges should not emit if nativeElement has not setValue defined', () => {
    component.group.get('name').setValue('cool');
    expect(component.contentEditor.nativeElement.setValue).toBe(undefined);
  });
});
