import { Link, MappedLinks } from '../commons';

export class User {
  id?: number;
  name?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  isActive?: boolean;
  applicationId?: string | number;
  password?: string;
  _links?: Link[];
  actions?: MappedLinks;
}
