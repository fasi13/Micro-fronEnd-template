import { Component, OnInit, HostListener } from '@angular/core';

import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})

export class FieldHtmlComponent extends FormField implements OnInit {
  configCkEditor: any;
  private _editor: any;

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
      extraPlugins : ['e2ea11yhelp'],
      toolbar: [
        { name: 'styles', items: [ 'Format' ] },
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ] },
        { name: 'styles', items: [ 'Font', 'TextColor', 'BGColor' ] },
        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        { name: 'table', items: [ 'Table' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'base64image', 'Embed' ] },
        { name: 'tools', items: [ 'Maximize' ] },
        { name: 'document', items: [ 'Source' ] },
        { name: 'about', items: [ 'About', 'E2EA11yHelp' ] }
      ]};
  }
get editor() {return this._editor; }

  editorReady(editor) {
    this._editor = editor;
  }
}
