import { AppConfigService } from 'src/app/app-config.service';
import { UserService } from './../../../../../core/services/user.service';
import { Component, OnInit, HostListener } from '@angular/core';

import { FormField } from '../../models/form-field.abstract';


import { Application, getApplicationInfo, State } from '@forge/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})

export class FieldHtmlComponent extends FormField implements OnInit {
  configCkEditor: any;
  private _editor: any;
  applicationId: string | number;

  @HostListener('keyup') onkeyup() {
    if (this._editor.editor.mode === 'source') {
      const editorValue = this._editor.editor.getData();
      const controlName = this.config.name;
      this.group.controls[controlName].setValue(editorValue);
    }
  }
constructor(private userService: UserService, private appconfig: AppConfigService, private store: Store<State>) {
  super();
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

  imageaction(editor) {
    editor.insertHtml('[Content(group="Website Branding" name="TestImage")]');
    console.log('image Action executed' + editor);
  }
  imageevent(event) {
    console.log('image button Event caught' + event);
    this.imageaction(event.editor);
  }


}
