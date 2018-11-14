export class TreeviewData {
  id: string | number;
  name: string;
  value?: string;
  collapsed?: boolean;
  executedFetch?: boolean;
  isGroup?: boolean; // @TODO replace with the proper field
  childrenData?: TreeviewData[];
  parentId?: string | number;
  loading?: boolean;

  constructor(id: string | number, name: string, value: string, isGroup: boolean, parentId: string | number) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.collapsed = true;
    this.executedFetch = false;
    this.isGroup = isGroup;
    this.childrenData = [];
    this.parentId = parentId;
    this.loading = false;
  }
}
