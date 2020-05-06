import { SharedModule } from './../../../shared/shared.module';

import { ContentInlineEditorComponent } from './content-inline-editor.component';
import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VersionHistoryModalComponent } from '../version-history-modal/version-history-modal.component';


// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('copied-content-value'));
}

describe('ContentInlineEditorComponent', () => {

  let fixtureUnderTest: ComponentFixture<ContentInlineEditorComponent>;
  let sut: ContentInlineEditorComponent;
  let modalService: NgbModal;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentInlineEditorComponent
      ],
      imports: [
        SharedModule,
        NgbModule.forRoot()
      ]
    }).compileComponents();

    fixtureUnderTest = TestBed.createComponent(ContentInlineEditorComponent);
    sut = fixtureUnderTest.componentInstance;

    modalService = TestBed.get(NgbModal);
  }));

  it('should open modal', () => {
    spyOn(modalService, 'open').and.returnValue(mockModalRef);
    sut.openVersionHistory();
    expect(modalService.open).toHaveBeenCalledWith(VersionHistoryModalComponent, { windowClass: 'modal-content-form' });
  });

  // Needs to be async as modal result returned in a promise
  it('should update closeResult when modal closed', fakeAsync(() => {
    spyOn(modalService, 'open').and.returnValue(mockModalRef);

    sut.openVersionHistory();
    tick();
    expect(sut.form.form.value).toBe('copied-content-value');
  }));


});
