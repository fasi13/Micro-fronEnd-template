import { Link, FgeEntity } from '../commons';
import { SettingDataType } from './setting-data-type.model';

export class Setting extends FgeEntity {
  id: number;
  name: string;
  propertyName: string;
  pattern: string;
  description: string;
  value: string;
  dataType: SettingDataType;
  isEncrypted: boolean;
  _links: Link[];
}
