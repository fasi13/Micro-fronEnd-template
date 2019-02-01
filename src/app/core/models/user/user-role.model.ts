import { Link, FgeEntity } from '../commons';

export class UserRole extends FgeEntity {
  id?: number;
  name: string;
  _links?: Link[];
}
