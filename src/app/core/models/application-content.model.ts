import { DataType } from "./commons/data-type.model";
import { Link } from "./commons";

export class ApplicationContent {
  dataType: DataType;
  description: string;
  displayAsList: boolean;
  id: number;
  name: string;
  publishDate: string;
  status: string;
  value: string;
  _links: Link[]
}