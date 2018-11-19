import { Link } from './link.model';

export class DataType {
  name: string;
  type: string;
  _links?: Link[];
  values?: any;
}
