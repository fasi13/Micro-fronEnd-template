import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, getTestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ContentService } from "src/app/core/services/content.service";
import { ImageGalleryModalComponent } from "./image-gallery-modal.component";

describe('ImageGalleryModalComponent', ()=> {
  // define the variable
  let component: ImageGalleryModalComponent;
  let fixture: ComponentFixture<ImageGalleryModalComponent>;
  let contentServiceStub: ContentService;
  let injector: TestBed;
  
beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ImageGalleryModalComponent],
      providers: [ NgbActiveModal, ContentService, { provide: ComponentFixtureAutoDetect, useValue: true }],
      imports: [HttpClientTestingModule]
 });
    fixture = TestBed.createComponent(ImageGalleryModalComponent);
    component = fixture.componentInstance;;
    injector = getTestBed();
    contentServiceStub = injector.get(ContentService);
    component.images = [{id: 1, name: 'test1'},{id: 2, name: 'test2'}];
    component.currentConentGroup = [{id: 1, name: 'Website branding', value: null}];
    fixture.detectChanges();
  });
 it('should create', () => {
    expect(component).toBeTruthy();
  });
it('should call on save', () => {
    expect(component.handleCancel(true));
  });
it('should call on close', () => {
    expect(component.handleCancel(false));
  });
  it('should call on save', () => {
    expect(component.onContentClick(component.currentConentGroup[0]));
  });
it('should call on image selection push', () => {
    const image = { id: 1, name: 'test'};
    component.images = [{id: 1, name: 'test'},{id: 2, name: 'test'}];
    component.currentConentGroup = [{id: 1, name: 'Website branding', value: null}];
      expect(component.onImageSelection(image)).toBe(1);
  });
 
it('should call on image selection push second time', () => {
    const image = { id: 1, name: 'test'};
    component.selectedConentGroup = [{id: 2, name: 'Website branding2', value: null}];
    expect(component.onImageSelection(image)).toBe(2);
  });

  it('should call on image selection push in same group', () => {
    const image = { id: 1, name: 'image1'};
    component.selectedImage = image;
    component.selectedConentGroup = [{id: 1, name: 'Website branding', value: { id: 2, name: 'image2'}}];
    expect(component.onImageSelection(image)).toBe(2);
  });

  it('should call on image selection pop in same group', () => {
    const image = { id: 1, name: 'image1'};
    component.selectedImage = image;
    component.selectedConentGroup = [{id: 1, name: 'Website branding', value: { id: 1, name: 'image1'}}];
    expect(component.onImageSelection(image)).toBe(2);
  });

  it('should call on content click', () => {
    const item = [{ id: 2, name: 'Demo'}];
    component.currentConentGroup.active = false;
    component.currentConentGroup = {id: 1, name: 'Website branding'};
    component.applicationId = 1;
    const expected = [{id: 1, name: 'Website branding', value: { id: 1, name: 'image1'}}];
    contentServiceStub.getContentGroup(1, 1).subscribe((result) => {
        expect(result.data.id).toEqual(1);
      });
  });

  it('should call on init', () => {
    const item = [{ id: 2, name: 'Demo'}];
    component.currentConentGroup = {id: 1, name: 'Website branding'};
    component.applicationId = 1;
    const expected = [{id: 1, name: 'Website branding', value: { id: 1, name: 'image1'}}];
    contentServiceStub.getContentGroups(1).subscribe((result) => {
        expect(result.data.items[0].id).toEqual(1);
        contentServiceStub.getContentGroup(1, result.data.items[0].id).subscribe((x) => {
          expect(x.data.id).toEqual(1);
        });
      });
  });
});