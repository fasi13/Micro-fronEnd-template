import { AppConfigService } from 'src/app/app-config.service';
import { UserService } from './../../../../../core/services/user.service';
import { Component, OnInit, HostListener } from '@angular/core';
import {  NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageGalleryModalComponent } from '../../../image-gallery-modal/image-gallery-modal.component';
import { FormField } from '../../models/form-field.abstract';
import { ContentService } from 'src/app/core/services/content.service';


import { Application, getApplicationInfo, State } from '@forge/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})

export class FieldHtmlComponent extends FormField implements OnInit {
  configCkEditor: any;
  private _editor: any;
  private modalRef: NgbModalRef;

  constructor(private userService: UserService, private appconfig: AppConfigService, private store: Store<State>, private modalService: NgbModal, private contentService: ContentService){
    super();
  }
  //private _imageList: any;
  applicationId: string | number;

  @HostListener('keyup') onkeyup() {
    if (this._editor.editor.mode === 'source') {
      const editorValue = this._editor.editor.getData();
      const controlName = this.config.name;
      this.group.controls[controlName].setValue(editorValue);
    }
  }

  ngOnInit() {

    this.store.select(getApplicationInfo)
      .subscribe((applicationInfo: Application) => {
        if (applicationInfo) {
          this.applicationId = applicationInfo.id;
        }
      });

    const apiurl = this.appconfig.config.apis.filter(c => c.name === 'E2E.Content.Management.API')[0].url;
    this.configCkEditor = {

      placeholder: this.config ? this.config.placeholder : '',
      startupFocus : true,
      allowedContent : true,
      embed_provider : '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
      extraPlugins : [ 'e2etriggerimage'],
      getimageUrl:   apiurl + '/application/' + this.applicationId + '/content?name={name}&exactMatch=true&replaceEmbeddedData=true&basic=true',
      apiToken: this.userService.getToken(),
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
    let inputContent = `[Content(group='Anniversary' name='${componentInstance.name}')]`;
    debugger;
    //editor.insertHtml('[Content(group="Website Branding" name="TestImage")]');
    editor.insertHtml(inputContent);
    console.log('image Action executed' + editor);
    console.log('image Action executed' + componentInstance);
  }
  imageevent(event) {
    this.modalRef = this.modalService.open(ImageGalleryModalComponent, { windowClass: 'modal-html-content-form' });
    this.contentService.getContentGroups(1).subscribe( a => {
      this.contentService.getContentGroup(1, a.data.items[0].id).subscribe( x => {

        this.modalRef.componentInstance.myData = event.name;
        this.modalRef.componentInstance.currentConentGroup = a.data.items[0];
        //this.modalRef.componentInstance.selectedImage = null;
        this.modalRef.componentInstance.conentGroups = a.data.items;
        this.modalRef.componentInstance.images = x.data.content.filter(y => y.dataType.name === "Image");
        this.modalRef.componentInstance.selectedImage = this.modalRef.componentInstance.images[0];
       debugger;
        this.modalRef.result.then((selectedImages: any) =>{
debugger;
console.log(selectedImages);
              this.imageaction(event.editor,selectedImages);
              this.modalRef.close();
        });
      })
    })

  }
}
