import { Link } from '../commons';

export class Application {
  id: number | string;
  name: string;
  value: string;
  _links: Link[];
}
