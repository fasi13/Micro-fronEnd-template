import { Link, DataType, TransactionModel } from '../commons';

export class ApplicationContent extends TransactionModel<ApplicationContent> {
  dataType?: DataType;
  description?: string;
  displayAsList?: boolean;
  id?: number;
  name: string;
  publishDate?: string;
  status?: string;
  value?: string;
  _links?: Link[];
}
