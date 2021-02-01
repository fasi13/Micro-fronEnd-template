import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, getTestBed } from '@angular/core/testing';
import { ContentGroup } from '@forge/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ContentService } from 'src/app/core/services/content.service';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';
import { ImageGalleryModalComponent } from './image-gallery-modal.component';
 
describe('ImageGalleryModalComponent', () => {
  // define the variable
  let component: ImageGalleryModalComponent;
  let fixture: ComponentFixture<ImageGalleryModalComponent>;
  let contentServiceStub: ContentService;
  let injector: TestBed;
  let contentGroups: any;
  let contentGroups1: ContentGroup[];
  let contentGroup: any;
  let store: MockStore<State>;
  let modalService: NgbActiveModal;
  const  initialState: State = TestInitialState;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ImageGalleryModalComponent],
      providers: [NgbActiveModal, ContentService, { provide: ComponentFixtureAutoDetect, useValue: true },
      provideMockStore({ initialState }),],
      imports: [HttpClientTestingModule]
    });
    contentGroups = {
      data: {
        id: 1, items: [{ id: 1, name: 'Website branding', version: 1, content:
        [{ id: 2, name: 'image2', dataTypes: { name: 'Image' } }] }, { id: 2, name: 'App', version: 1 , content:
        [{ id: 2, name: 'image2', dataTypes: { name: 'Image' } }] }],
        limit: 1,
        offset: 1,
        totalCount: 1,
        _links: [],
        sort: {}
      },
      success: true
    };
    contentGroup = {
      data: {
        id: 1, name: 'Website branding', content: [{ id: 2, name: 'image2', dataTypes: { name: 'Image' } }],
        limit: 1,
        offset: 1,
        totalCount: 1,
        _links: []
      },
      success: true
    };
    contentGroups1 = [{id: 1, name: 'Website branding', content: [], _links:[]}, {id: 2, name: 'Website branding', content: [], _links:[]}, {id: 2, name: 'App', content: [], _links:[]}, {id: 2, name: 'Section', content: [], _links:[]}];
    fixture = TestBed.createComponent(ImageGalleryModalComponent);
    store = TestBed.get(Store);
 
    component = fixture.componentInstance;
    injector = getTestBed();
    contentServiceStub = injector.get(ContentService);
    modalService = TestBed.get(NgbActiveModal);
    component.applicationId = 1;
    component.isLoading = true;
    component.currentContentGroup = { id: 1, name: 'Website branding' , content: [], _links: [] };
 
    spyOn(contentServiceStub, 'getContentGroups').and.callFake(() => of(contentGroups));
    spyOn(contentServiceStub, 'getContentGroup').and.callFake(() => of(contentGroup));
    fixture.detectChanges();
 
  });
 
it('should call Load', ()=>{
component.currentContentGroup = { id: 1, name: 'Website branding' , content: [{name:'', version: 1, dataType : {name : 'Image', type:'string' }}], _links: [] };
spyOn(store, 'select').and.callFake(() => of(component.currentContentGroup));
expect(component.onLoad()).toBe(true);
});

it('should call Load twice', ()=>{
    const expected = [{id: 2, name: 'Website branding1', content: [], _links:[]}, {id: 1, name: 'Website branding', content: [], _links:[]}];
    spyOn(store, 'select').and.callFake(() => of(contentGroups1));
    expect(component.onLoad()).toBe(true);
    });
    
 
it('should create', () => {​​​​​​​​
expect(component).toBeTruthy();
  }​​​​​​​​);
 
it('should call on save', () => {​​​​​​​​
component.selectedContentGroup = [{​​​​​​​​ id:1, name:'Website branding', value: [{​​​​​​​​ id:2, name:'image2' }​​​​​​​​] }​​​​​​​​];
spyOn(modalService, 'close').and.returnValue(component.selectedContentGroup);
component.handleCancel(true);
component.handleCancel(false);
expect(modalService.close).toBeTruthy();
  }​​​​​​​​);
 
it('should call on save', () => {​​​​​​​​
expect(component.onContentClick(component.currentContentGroup)).toEqual(true);
  }​​​​​​​​);
 
it('should call on image selection push', () => {​​​​​​​​
const image = {​​​​​​​​ id:1, name:'image' }​​​​​​​​;
component.selectedContentGroup = [];
component.currentContentGroup = {​​​​​​​​ id:1, name:'Website branding' , content: [], _links: [] }​​​​​​​​;
component.images = [{​​​​​​​​ id:1, name:'image', active: true }​​​​​​​​, {​​​​​​​​ id:2, name:'test2' }​​​​​​​​];
expect(component.onImageSelection(image)).toBe(1);
  }​​​​​​​​);
 
it('should call on image selection push second time', () => {​​​​​​​​
const image = {​​​​​​​​ id:1, name:'test'}​​​​​​​​;
component.images = [{​​​​​​​​ id:1, name:'image'}​​​​​​​​, {​​​​​​​​ id:2, name:'test2' }​​​​​​​​];
component.currentContentGroup = {​​​​​​​​ id:1, name:'Website branding' , content: [], _links: [] }​​​​​​​​;
component.selectedContentGroup = [{​​​​​​​​ id:2, name:'Website branding2', value:null }​​​​​​​​];
expect(component.onImageSelection(image)).toBe(2);
  }​​​​​​​​);
 
it('should call on image selection push in same group', () => {​​​​​​​​
const image = {​​​​​​​​ id:1, name:'image' }​​​​​​​​;
component.selectedImage = image;
component.images = [{​​​​​​​​ id:1, name:'image' }​​​​​​​​, {​​​​​​​​ id:2, name:'test2' }​​​​​​​​];
component.currentContentGroup = {​​​​​​​​ id:1, name:'Website branding' , content: [], _links: [] }​​​​​​​​;
component.selectedContentGroup = [{​​​​​​​​ id:1, name:'Website branding', value: [{​​​​​​​​ id:2, name:'image2' }​​​​​​​​] }​​​​​​​​];
expect(component.onImageSelection(image)).toBe(2);
  }​​​​​​​​);
 
it('should call on image selection pop in same group', () => {​​​​​​​​
const image = {​​​​​​​​ id:1, name:'image' }​​​​​​​​;
component.selectedImage = image;
component.images = [{​​​​​​​​ id:1, name:'image' }​​​​​​​​, {​​​​​​​​ id:2, name:'test2' }​​​​​​​​];
component.selectedContentGroup = [{​​​​​​​​ id:1, name:'Website branding', value: [{​​​​​​​​ id:1, name:'image' }​​​​​​​​] }​​​​​​​​];
expect(component.onImageSelection(image)).toEqual(image);
  }​​​​​​​​);


 
afterEach(function () {​​​​​​​​
fixture.destroy();
  }​​​​​​​​);
}​​​​​​​​);

