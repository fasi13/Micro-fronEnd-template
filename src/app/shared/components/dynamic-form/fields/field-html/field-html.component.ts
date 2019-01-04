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
