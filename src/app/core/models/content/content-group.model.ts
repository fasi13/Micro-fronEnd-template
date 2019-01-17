import { ApplicationContent } from '../application/application-content.model';
import { Link, FgeEntity } from '../commons';

export class ContentGroup extends FgeEntity {
  id: number | string;
  name: string;
  content: ApplicationContent[];
  _links: Link[];
}
