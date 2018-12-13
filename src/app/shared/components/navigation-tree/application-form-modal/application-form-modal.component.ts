import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { ObjectTransactionService, ApiResponse, DataPaginated } from '@forge/core';
import { TreeviewData } from '../treeview-data.model';
import { FieldConfig } from '../../dynamic-form';
import { NavigationTreeService } from '../navigation-tree.service';

@Component({
  selector: 'fge-application-form-modal',
  templateUrl: './application-form-modal.component.html',
})
export class ApplicationFormModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  config: FieldConfig[];

  private currentActionName: string;
  private currentApplicationNode: TreeviewData;

  constructor(
    private modalService: NgbModal,
    private objectTransactionService: ObjectTransactionService,
    private navigationTreeService: NavigationTreeService
  ) { }

  ngOnInit() {
    this.initFormConfig();
  }

  open(action: string, application: TreeviewData, edit?: boolean): void {
    if (action) {
      this.currentActionName = action;
      this.currentApplicationNode = application;
      if (edit) {
        this.config[0].value = application.name;
        this.config[1].value = application.value;
      }
      this.modalService.open(this.modalContent);
    }
  }

  handleSubmit({ value, success, error }): void {
    (this.objectTransactionService.performAction(this.currentApplicationNode, this.currentActionName, value) as Observable<any>)
      .subscribe(() => {
        this.updateCurrentApplicationNode();
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

  private updateCurrentApplicationNode() {
    const { isGroup, parentId, id } = this.currentApplicationNode;
    if (isGroup) {
      this.currentApplicationNode.loading = true;
      this.navigationTreeService.getApplications(parentId, id)
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
      }, {
        type: 'text',
        label: 'Value',
        name: 'value',
        placeholder: 'Enter value',
        validation: {
          required: {
            errorMsg: 'Value is required',
            validator: Validators.required
          },
          number: {
            errorMsg: 'Value should be a number',
            validator: Validators.pattern(/^-?(0|[1-9]\d*)?$/)
          }
        }
      }
    ];
  }
}
