import { Link, FgeEntity } from '@forge/core';

export class TreeviewData implements FgeEntity {
  id: string | number;
  name: string;
  value?: string;
  collapsed?: boolean;
  executedFetch?: boolean;
  /**
   *  replace with the proper field
   */
  isGroup?: boolean;
  childrenData?: TreeviewData[];
  parentId?: string | number;
  loading?: boolean;
  _links?: Link[];

  constructor(id: string | number, name: string, value: string, isGroup: boolean, parentId: string | number, links: Link[]) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.collapsed = true;
    this.executedFetch = false;
    this.isGroup = isGroup;
    this.childrenData = [];
    this.parentId = parentId;
    this.loading = false;
    this._links = links;
  }
}
