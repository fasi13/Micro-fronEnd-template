import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
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
    appConfigService._config = appConfig;

    fixture = TestBed.createComponent(FieldContentEditorComponent);
    component = fixture.componentInstance;
    component.resolveGetValue = () => {};
    component.group = new FormGroup([] as any);
    component.group.addControl('name', new FormControl('value'));
    component.config = { name: 'name', type: 'text', applicationId: 1, original: {name: 'name', type: 'text'} } as any
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('color type should be changed to color picker', () => {
    (component.config as any).original.type = 'color'
    component.ngOnInit();
    expect(component.content.dataType.name).toBe('color picker');
  });
  it('valueChanges should emit if nativeElement has setValue defined', (done) => {
    component.contentEditor.nativeElement.setValue = new EventEmitter();
    component.contentEditor.nativeElement.setValue.subscribe((event) => {
      expect(event.value).toBe('cool');
      done();
    });
    component.group.get('name').setValue('cool');
  });
  it('valueChanges should not emit if nativeElement has not setValue defined', () => {
    component.group.get('name').setValue('cool');
    expect(component.contentEditor.nativeElement.setValue).toBe(undefined);
  });
  it('onGetValue set value if valid', () => {
    component.onGetValue({detail:{valid:true, value:'cool2'}});
    expect(component.group.get('name').value).toBe('cool2');
  });
  it('onGetValue don,t set value if invalid', () => {
    component.onGetValue({detail:{valid:false, value:'cool2'}});
    expect(component.group.get('name').value).toBe('');
  });
});