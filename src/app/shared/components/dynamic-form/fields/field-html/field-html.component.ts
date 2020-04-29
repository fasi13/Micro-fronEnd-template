import { Component, OnInit } from '@angular/core';

import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})
export class FieldHtmlComponent extends FormField implements OnInit {
  configCkEditor: any;

  ngOnInit() {

    this.configCkEditor = {
      placeholder: this.config.placeholder,
      startupFocus : true,
      embed_provider : '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
      extraPlugins : ['tableresize', 'font', 'justify', 'colorbutton', 'embed', 'e2ea11yhelp'],
      toolbar: [
        { name: 'styles', items: [ 'Format' ] },
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ] },
        { name: 'styles', items: [ 'Font', 'TextColor', 'BGColor' ] },
        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        { name: 'table', items: [ 'Table' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Image', 'Embed' ] },
        { name: 'tools', items: [ 'Maximize' ] },
        { name: 'document', items: [ 'Source' ] },
        { name: 'about', items: [ 'About', 'E2EA11yHelp' ] }
      ]};
  }
}
