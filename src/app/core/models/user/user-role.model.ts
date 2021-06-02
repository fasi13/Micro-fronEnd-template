import { Link, FgeEntity } from '../commons';
import { User } from './user.model';

export class UserRole extends FgeEntity {
  id?: number;
  name: string;
  isInherited?: boolean;
  _links?: Link[];

  /* Extra fields used when selected */
  permissions?: any[]; // Add proper model
  users?: User[];
}
