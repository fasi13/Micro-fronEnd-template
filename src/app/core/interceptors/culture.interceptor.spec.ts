// import { ContentService } from './../services/content.service';

// import { environment } from './../../../environments/environment.prod';
// import { TestBed } from '@angular/core/testing';
// import {
//   HttpClientTestingModule,
//   HttpTestingController,
// } from '@angular/common/http/testing';

// // import { HTTP_INTERCEPTORS } from '@angular/common/http';

// describe(`AuthHttpInterceptor`, () => {

//   let httpMock: HttpTestingController;
//   let service: ContentService;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         {
//           ContentService,
//           provide: HTTP_INTERCEPTORS,
//           useClass: CultureInterceptor,
//           multi: true,
//         },
//       ],
//     });
//     service = TestBed.get(ContentService);
//     httpMock = TestBed.get(HttpTestingController);
//   });

//   it('should add a CultureCode header', () => {
//     service.getContent(1, 1).subscribe((response) => {
//       expect(response).toBeTruthy();
//     });

//     const httpRequest = httpMock.expectOne(`application/${1}/content/${1}?replaceEmbeddedData=false`);

//     expect(httpRequest.request.headers.has('CultureCode')).toEqual(true);
//   });
// });
