import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContentEditorConfiguration, ContentEditorOnValueChangeEvent } from '@e2e/content-management-components';
import { ApplicationContent } from '@forge/core';
import { Subscription } from 'rxjs';
import { ContentEditorConfigurationService } from 'src/app/core/services/content-editor-configuration.service';
import { FieldConfig } from '../..';
import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-content-editor',
  templateUrl: './field-content-editor.component.html'
})
export class FieldContentEditorComponent extends FormField implements OnInit, OnDestroy  {
  e2eContentEditorConfig: ContentEditorConfiguration;
  content: ApplicationContent;
  showLabel: boolean;
  valueChangeSubscription: Subscription;
  @ViewChild('contentEditor') contentEditor: ElementRef;
  constructor(
    private contentEditorConfigurationService: ContentEditorConfigurationService,
  ) { super()}
  ngOnInit(): void {
    let originalConfig = (this.config as any).original as FieldConfig;
    let type = originalConfig.type;
    if (type == 'color') type = 'color picker';
    this.content = { dataType: { name: type, type:type }, name: '', version: 0, value: originalConfig.value }
    this.e2eContentEditorConfig = this.contentEditorConfigurationService.get((this.config as any).applicationId);
    this.e2eContentEditorConfig.disableSave = true;
    this.showLabel = type.toLowerCase() != 'html';
    this.valueChangeSubscription = this.group.get(this.config.name).valueChanges.subscribe(() => {
      if (this.contentEditor.nativeElement.setValue) {
        this.contentEditor.nativeElement.setValue.emit({value: this.group.get(this.config.name).value});
      }
    });
  }
  onValueChange(event: {detail: ContentEditorOnValueChangeEvent}) {
    if (event.detail.valid) {
      this.group.get(this.config.name).setValue(event.detail.value, { emitEvent: false });
    } else {
      this.group.get(this.config.name).setValue("", { emitEvent: false });
    }
  }
  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
  }
}
