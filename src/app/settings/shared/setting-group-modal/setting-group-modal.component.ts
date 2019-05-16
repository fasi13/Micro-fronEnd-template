import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import _clone from 'lodash/clone';

import {
  FgeModalService,
  SettingGroup,
  FgeHttpActionService,
  getApplicationInfo,
  ApplicationLink,
  FgeEntity } from '@forge/core';
import { FieldConfig } from '@forge/shared';
import { configGroupFields } from './setting-group-modal.config';
import { SettingGroupLink } from 'src/app/core/models/settings/setting-group-link.model';

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

  private settingGroup: SettingGroup;

  constructor(
    private modalService: FgeModalService,
    private fgeActionService: FgeHttpActionService
  ) { }

  ngOnInit() {
  }

  open(settingGroup: SettingGroup): void {
    this.settingGroup = settingGroup;
    this.mode = settingGroup ? 'EDIT' : 'CREATE';
    configGroupFields[0].value = this.mode === 'EDIT' ? settingGroup.name : '';
    this.config = _clone(configGroupFields);
    this.modalService.open(this.modalContent);
  }

  onSubmit({ value: formData, success, error }): void {
    this.submitted = true;
    if (this.mode === 'EDIT') {
      this.updateSettingGroup(this.settingGroup, formData, success, error);
    } else {
      this.addSettingGroup(formData, success, error);
    }
  }

  handleCancel(event: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.modalService.dismissAll();
  }

  private addSettingGroup(formData: any, success, error): void {
    this.fgeActionService.performActionWithSelector(getApplicationInfo, ApplicationLink.CREATE_SETTING_GROUP, {
      body: formData
    }).subscribe(() => {
      success();
      this.modalService.dismissAll();
    }, (err) => error(Object.values(err.error.fields)));
  }

  private updateSettingGroup(data: FgeEntity, formData: any, success, error): void {
    this.fgeActionService.performAction(data, SettingGroupLink.UPDATE_SETTING_GROUP, {
      body: formData
    }).subscribe(() => {
      success();
      this.modalService.dismissAll();
    }, err => error(Object.values(err.error.fields)));
  }
}
