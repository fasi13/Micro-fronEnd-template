import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';

import { FormField } from '../../models/form-field.abstract';
import { NgxSummernoteDirective } from 'ngx-summernote';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})
export class FieldHtmlComponent extends FormField implements OnInit, OnDestroy {

  @ViewChild(NgxSummernoteDirective) summerNoteDirective: NgxSummernoteDirective;

  configSummernote: any;
  configCkEditor:any;

  private _destroyFieldCallback: () => void;
  private _editor: any;

  @HostListener('keyup') onkeyup() {
    if (this._editor('codeview.isActivated')) {
      const editorValue = this._editor('code');
      const controlName = this.config.name;
      this.group.controls[controlName].setValue(editorValue);
    }
  }

  ngOnInit() {

    this.configCkEditor = {
      placeholder: this.config.placeholder,
      startupFocus : true,
      embed_provider : '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
      extraPlugins : ['tableresize', 'font', 'justify', 'colorbutton', 'embed'],
      toolbar: [
        { name: 'styles', items: [ 'Format' ] },
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ] },
        { name: 'styles', items: [ 'Font', 'TextColor', 'BGColor' ] },
        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        { name: 'table', items: [ 'Table' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Image', 'Embed' ] },
        { name: 'tools', items: [ 'Maximize' ] },
        { name: 'document', items: [ 'Source' ] },
        { name: 'about', items: [ 'About' ] }
      ]};

      // this.configCkEditor = {
      //   placeholder: this.config.placeholder,
      //   startupFocus : true,
      //   toolbarGroups : [
      //     { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
      //     { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
      //     { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
      //     { name: 'forms', groups: [ 'forms' ] },
      //     '/',
      //     { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
      //     { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
      //     { name: 'links', groups: [ 'links' ] },
      //     { name: 'insert', groups: [ 'insert' ] },
      //     '/',
      //     { name: 'colors', groups: [ 'colors' ] },
      //     { name: 'tools', groups: [ 'tools' ] },
      //     { name: 'about', groups: [ 'about' ] }
      //   ] };


    this.configSummernote = {
      placeholder: this.config.placeholder,
      focus: this.config.focus,
      toolbar: [
        ['group1', ['style']],
        ['group2', ['bold', 'underline', 'clear']],
        ['group3', ['fontname']],
        ['group4', ['color']],
        ['group5', ['ul', 'ol', 'paragraph', 'table']],
        ['group6', ['link', 'picture', 'video']],
        ['group7', ['fullscreen', 'codeview', 'help']]
      ]
    };

    if (this.config.value !== '') {
      this.configSummernote.height = 250;
    }
  }

  ngOnDestroy() {
    if (this._destroyFieldCallback) {
      this._destroyFieldCallback();
    }
  }

  initField({ initialize, destroy, getEditor }) {
    initialize();
    this._destroyFieldCallback = destroy;
    this._editor = getEditor();
  }
}
