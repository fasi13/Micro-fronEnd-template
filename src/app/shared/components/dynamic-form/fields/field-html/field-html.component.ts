import { Component, OnInit } from '@angular/core';

import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})
export class FieldHtmlComponent extends FormField implements OnInit {

  configSummernote: any;

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
}
