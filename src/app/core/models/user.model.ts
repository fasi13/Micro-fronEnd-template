import { Link, MappedLinks } from './commons';

export class User {
    id: number;
    name: string;
    _links: Link[];
    actions?: MappedLinks;
}
