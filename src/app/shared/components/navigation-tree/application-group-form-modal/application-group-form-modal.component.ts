import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import _assign from 'lodash/assign';

import { Observable } from 'rxjs';

import { ObjectTransactionService, ApiResponse, DataPaginated, FgeModalService } from '@forge/core';
import { TreeviewData } from '../treeview-data.model';
import { NavigationTreeService } from '../navigation-tree.service';
import { FieldConfig } from '../../dynamic-form';

@Component({
  selector: 'fge-application-group-form-modal',
  templateUrl: './application-group-form-modal.component.html',
})
export class ApplicationGroupFormModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  config: FieldConfig[];

  private currentActionName: string;
  private currentApplicationNode: TreeviewData;
  private isEditMode: boolean;

  constructor(
    private modalService: FgeModalService,
    private objectTransactionService: ObjectTransactionService,
    private navigationTreeService: NavigationTreeService
  ) { }

  ngOnInit() {
    this.initFormConfig();
  }

  open(action: string, application: TreeviewData, edit?: boolean): void {
    if (action) {
      this.isEditMode = !!edit;
      this.currentActionName = action;
      this.currentApplicationNode = application;
      if (edit) {
        this.config[0].value = application.name;
      }
      this.modalService.open(this.modalContent);
    }
  }

  handleSubmit({ value, success, error }): void {
    (this.objectTransactionService.performAction(this.currentApplicationNode, this.currentActionName, value) as Observable<any>)
    .subscribe((response: ApiResponse<any>) => {
      this.updateCurrentApplicationNode(response);
      success();
      this.modalService.dismissAll();
      this.initFormConfig();
    },
    (err) => error(err.error.fields.value));
  }

  handleCancel(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.modalService.dismissAll('cancel');
    this.initFormConfig();
  }

  private updateCurrentApplicationNode(actionResponse: ApiResponse<any>) {
    const { isGroup, parentId, id } = this.currentApplicationNode;
    this.currentApplicationNode.loading = true;
    if (this.isEditMode) {
      const { name } = actionResponse.data;
      _assign(this.currentApplicationNode, { name, loading: false });
    } else if (isGroup) {
      this.navigationTreeService.getApplications(parentId, id)
        .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToCurrentNode(response, this.currentApplicationNode));
    } else {
      this.navigationTreeService.getApplicationGroups(id)
        .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToCurrentNode(response, this.currentApplicationNode));
    }
  }

  private mapDataToCurrentNode(response: ApiResponse<DataPaginated<any>>, item: TreeviewData) {
    item.collapsed = false;
    item.childrenData = response.data.items.map((groupData) => new TreeviewData(
      groupData.id,
      groupData.name,
      groupData.value,
      groupData.hasOwnProperty('isEncrypted'),
      item.id,
      groupData._links
    ));
    item.loading = false;
  }

  private initFormConfig() {
    this.currentActionName = '';
    this.config = [
      {
        type: 'text',
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
        validation: {
          required: {
            errorMsg: 'Name is required',
            validator: Validators.required
          }
        }
      }
    ];
  }
}
