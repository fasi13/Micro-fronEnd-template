import { AppConfigService } from 'src/app/app-config.service';
import { UserService } from './../../../../../core/services/user.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageGalleryModalComponent } from '../../../image-gallery-modal/image-gallery-modal.component';
import { FormField } from '../../models/form-field.abstract';


import { Application, getApplicationInfo, State } from '@forge/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})

export class FieldHtmlComponent extends FormField implements OnInit {
  configCkEditor: any;
  _editor: any;
  modalRef: NgbModalRef;

  constructor(private userService: UserService, private appconfig: AppConfigService, private store: Store<State>, private modalService: NgbModal) {
    /* istanbul ignore next */

    super();
  }

  applicationId: string | number;

  @HostListener('keyup') onkeyup() {
    if (this._editor.editor.mode === 'source') {
      const editorValue = this._editor.editor.getData();
      const controlName = this.config.name;
      this.group.controls[controlName].setValue(editorValue);
    }
  }

  ngOnInit() {
    /* istanbul ignore next */
    this.store.select(getApplicationInfo)
      .subscribe((applicationInfo: Application) => {
        if (applicationInfo) {
          this.applicationId = applicationInfo.id;
        }
      });

    const apiurl = this.appconfig.config ? this.appconfig.config.apis.filter(c => c.name === 'E2E.Content.Management.API')[0].url : null;
    this.configCkEditor = {

      placeholder: this.config ? this.config.placeholder : '',
      startupFocus: true,
      allowedContent: true,
      embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
      extraPlugins: ['e2etriggerimage'],
      getimageUrl: apiurl + '/application/' + this.applicationId + '/content?name={name}&group={group}&exactMatch=true&replaceEmbeddedData=true&basic=true',
      apiToken: this.userService.getToken(),
      toolbar: [
        { name: 'styles', items: ['Format'] },
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
        { name: 'styles', items: ['Font', 'TextColor', 'BGColor'] },
        { name: 'paragraph', items: ['BulletedList', 'NumberedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'table', items: ['Table'] },
        { name: 'links', items: ['Link', 'Unlink', 'base64image', 'E2ETriggerImage', 'Embed'] },
        { name: 'tools', items: ['Maximize'] },
        { name: 'document', items: ['Source'] },
        { name: 'about', items: ['About', 'E2EA11yHelp'] }
      ]
    };
  }
  get editor() { return this._editor; }

  editorReady(editor) {
    /* istanbul ignore next */
    this._editor = editor;
    this._editor.editor.on('imageevent', event => this.imageevent(event));
  }

  imageaction(editor, componentInstance) {
    /* istanbul ignore next */
    if (componentInstance instanceof Array) {
      componentInstance.forEach(element => {
        element.value.forEach(item => {
          editor.insertHtml(`[Content(group="${element.name}" name="${item.name}")]`);
        });
      });
    }
  }

  imageevent(event) {
    /* istanbul ignore next */
    this.modalRef = this.modalService.open(ImageGalleryModalComponent, { windowClass: 'modal-html-image-form' });
    if(this.modalRef.componentInstance)
    {
      this.modalRef.componentInstance.applicationId = this.applicationId;
    }
    this.modalRef.result.then((activeModal: any) => {
      if (activeModal !== undefined && activeModal.length > 0) {
        this.imageaction(event.editor, activeModal);
      }
    });
  }

}
