import { Component, OnInit, HostListener } from '@angular/core';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageGalleryModalComponent } from '../../../image-gallery-modal/image-gallery-modal.component';
import { FormField } from '../../models/form-field.abstract';
import { ContentService } from 'src/app/core/services/content.service';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})

export class FieldHtmlComponent extends FormField implements OnInit {
  configCkEditor: any;
  private _editor: any;
  private modalRef: NgbModalRef;
  constructor(private modalService: NgbModal, private contentService: ContentService){
    super();
  }
  //private _imageList: any;

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

  imageaction(editor, componentInstance) {
    debugger;
    editor.insertHtml("[[https://res.cloudinary.com/sfp/image/upload/q_60/cste/f6e7c858-2e8a-4500-b850-a88236a2b4c7.png]]");
    console.log('image Action executed' + editor);
    console.log('image Action executed' + componentInstance);
  }
  imageevent(event) {
    this.modalRef = this.modalService.open(ImageGalleryModalComponent, { windowClass: 'modal-html-content-form' });
    this.contentService.getContentGroups(1).subscribe( a => {
      this.contentService.getContentGroup(1, a.data.items[0].id).subscribe( x => {
      
        this.modalRef.componentInstance.myData = event.name;
        this.modalRef.componentInstance.currentConentGroup = a.data.items[0];
        this.modalRef.componentInstance.selectedImage = null;
        this.modalRef.componentInstance.conentGroups = a.data.items;
        this.modalRef.componentInstance.images = x.data.content.filter(y => y.dataType.name === "Image");
        this.imageaction(event.editor, this.modalRef.componentInstance);
        //this.modalRef.close();
      })
    })
    
  }
}
