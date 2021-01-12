import { Component, OnInit, HostListener } from '@angular/core';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageGalleryModalComponent } from '../../../image-gallery-modal/image-gallery-modal.component';
import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})

export class FieldHtmlComponent extends FormField implements OnInit {
  configCkEditor: any;
  private _editor: any;
  private modalRef: NgbModalRef;
  public images = [{name:'img1', url:''},
                   {name:'img1', url:''},
                   {name:'img1', url:''},
                   {name:'img1', url:''}]
  constructor(private modalService: NgbModal){
    super();
  }
  @HostListener('keyup') onkeyup() {
    if (this._editor.editor.mode === 'source') {
      const editorValue = this._editor.editor.getData();
      const controlName = this.config.name;
      this.group.controls[controlName].setValue(editorValue);
    }
  }

  ngOnInit() {
    this.configCkEditor = {

      placeholder: this.config ? this.config.placeholder : '',
      startupFocus : true,
      allowedContent : true,
      embed_provider : '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
      extraPlugins : ['e2ea11yhelp', 'e2etriggerimage'],
      toolbar: [
        { name: 'styles', items: [ 'Format' ] },
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ] },
        { name: 'styles', items: [ 'Font', 'TextColor', 'BGColor' ] },
        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        { name: 'table', items: [ 'Table' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'base64image', 'Embed' ] },
        { name: 'tools', items: [ 'Maximize' ] },
        { name: 'document', items: [ 'Source' ] },
        { name: 'about', items: [ 'About', 'E2EA11yHelp', 'E2ETriggerImage' ] }
      ]};
  }
  get editor() {return this._editor; }

  editorReady(editor) {
    this._editor = editor;
    this._editor.editor.on('imageevent', event => this.imageevent(event));
  }

  imageaction(editor) {
    editor.insertHtml("[[https://res.cloudinary.com/sfp/image/upload/q_60/cste/f6e7c858-2e8a-4500-b850-a88236a2b4c7.png]]");
    console.log('image Action executed' + editor);
  }
  imageevent(event) {
   this.modalRef = this.modalService.open(ImageGalleryModalComponent, { windowClass: 'modal-html-content-form' });
   this.modalRef.componentInstance.myData ='My Gallery';
   this.modalRef.componentInstance.images = this.images;
   //this.modalRef.close();
    this.modalRef.result.then(()=> {
      console.log("completed");
    });
    console.log('image button Event caught' + event);
    this.imageaction(event.editor);
  }
}
