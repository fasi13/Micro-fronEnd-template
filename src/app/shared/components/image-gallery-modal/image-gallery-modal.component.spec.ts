// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, getTestBed } from '@angular/core/testing';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { of } from 'rxjs';
// import { ContentService } from 'src/app/core/services/content.service';
// import { ImageGalleryModalComponent } from './image-gallery-modal.component';

// describe('ImageGalleryModalComponent', () => {
//   // define the variable
//   let component: ImageGalleryModalComponent;
//   let fixture: ComponentFixture<ImageGalleryModalComponent>;
//   let contentServiceStub: ContentService;
//   let injector: TestBed;
//   let contentGroups: any;
//   let contentGroup: any;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       declarations: [ImageGalleryModalComponent],
//       providers: [NgbActiveModal, ContentService, { provide: ComponentFixtureAutoDetect, useValue: true }],
//       imports: [HttpClientTestingModule]
//     });
//     contentGroups = {
//       data: {
//         id: 1, items: [{ id: 1, name: 'Website branding', version: 1, content:
//         [{ id: 2, name: 'image2', dataTypes: { name: 'Image' } }] }, { id: 2, name: 'App', version: 1 , content:
//         [{ id: 2, name: 'image2', dataTypes: { name: 'Image' } }] }],
//         limit: 1,
//         offset: 1,
//         totalCount: 1,
//         _links: [],
//       },
//       success: true
//     };
//     contentGroup = {
//       data: {
//         id: 1, name: 'Website branding', content: [{ id: 2, name: 'image2', dataTypes: { name: 'Image' } }],
//         limit: 1,
//         offset: 1,
//         totalCount: 1,
//         _links: []
//       },
//       success: true
//     };
//     fixture = TestBed.createComponent(ImageGalleryModalComponent);
//     component = fixture.componentInstance;
//     injector = getTestBed();
//     contentServiceStub = injector.get(ContentService);
//     component.applicationId = 1;
//     component.isLoading = true;
//     component.currentConentGroup = { id: 1, name: 'Website branding' , content: [], _links: [] };

//     spyOn(contentServiceStub, 'getContentGroups').and.callFake(() => of(contentGroups));
//     spyOn(contentServiceStub, 'getContentGroup').and.callFake(() => of(contentGroup));
//     fixture.detectChanges();
//   });
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   it('should call on save', () => {
//     component.selectedConentGroup = [{ id: 1, name: 'Website branding', value: [{ id: 2, name: 'image2' }] }];
//     expect(component.handleCancel(true));
//   });
//   it('should call on close', () => {
//     expect(component.handleCancel(false));
//   });
//   it('should call on load', () => {
//     component.conentGroups = contentGroups;
//     expect(component.onLoad());
//   });

//   it('should call on save', () => {
//     expect(component.onContentClick(component.currentConentGroup));
//   });
//   it('should call on image selection push', () => {
//     const image = { id: 1, name: 'test' };
//     component.selectedConentGroup = [];
//     component.currentConentGroup = { id: 1, name: 'Website branding' , content: [], _links: [] };
//     component.images = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }];
//     expect(component.onImageSelection(image)).toBe(1);
//   });

//   it('should call on image selection push second time', () => {
//     const image = { id: 1, name: 'test' };
//     component.images = [{ id: 1, name: 'test' }, { id: 2, name: 'test2' }];
//     component.currentConentGroup = { id: 1, name: 'Website branding' , content: [], _links: [] };
//     component.selectedConentGroup = [{ id: 2, name: 'Website branding2', value: null }];
//     expect(component.onImageSelection(image)).toBe(2);
//   });

//   it('should call on image selection push in same group', () => {
//     const image = { id: 1, name: 'image1' };
//     component.selectedImage = image;
//     component.images = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }];
//     component.currentConentGroup = { id: 1, name: 'Website branding' , content: [], _links: [] };
//     component.selectedConentGroup = [{ id: 1, name: 'Website branding', value: [{ id: 2, name: 'image2' }] }];
//     expect(component.onImageSelection(image)).toBe(2);
//   });

//   it('should call on image selection pop in same group', () => {
//     const image = { id: 1, name: 'image1' };
//     component.selectedImage = image;
//     component.images = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }];
//     component.selectedConentGroup = [{ id: 1, name: 'Website branding', value: [{ id: 1, name: 'image1' }] }];
//     expect(component.onImageSelection(image));
//   });

//   it('should call on content click', () => {

//     component.currentConentGroup = { id: 1, name: 'Website branding' , content: [], _links: [] };
//     component.applicationId = 1;
//     component.isLoading = true;
//     component.images = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }];
//   });
// });
