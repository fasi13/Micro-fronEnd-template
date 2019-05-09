import { Link, FgeEntity } from '../commons';
import { Setting } from './setting.model';

export class SettingGroup extends FgeEntity {
  id: number | string;
  name: string;
  className: string;
  description: string;
  settings: [Setting];
  _links: Link[];
}
