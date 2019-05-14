import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import _clone from 'lodash/clone';

import { FgeModalService, SettingGroup } from '@forge/core';
import { FieldConfig } from '@forge/shared';
import { configGroupFields } from './setting-group-modal.config';

@Component({
  selector: 'fge-setting-group-modal',
  templateUrl: './setting-group-modal.component.html'
})
export class SettingGroupModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  submitted = false;
  loading = false;
  mode: 'CREATE' | 'EDIT';
  config: FieldConfig[];

  constructor(
    private modalService: FgeModalService
  ) { }

  ngOnInit() {
  }

  open(settingGroup: SettingGroup): void {
    this.mode = settingGroup ? 'EDIT' : 'CREATE';
    configGroupFields[0].value = this.mode === 'EDIT' ? settingGroup.name : '';
    this.config = _clone(configGroupFields);
    this.modalService.open(this.modalContent);
  }

  onSubmit({ value: formData, success }): void {
    this.submitted = true;
    if (this.mode === 'EDIT') {
      this.updateSettingGroup(formData);
    } else {
      this.addSettingGroup(formData);
    }
    success();
  }

  handleCancel(event: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.modalService.dismissAll();
  }

  private addSettingGroup(_formData: any): void {
    console.log('Add new setting group');
  }

  private updateSettingGroup(_formData: any): void {
    console.log('Update setting group');
  }
}
