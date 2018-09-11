import { Link, MappedLinks } from "./commons";

export class Application {
    id: number;
    name: string;
    value: string;
    _links: Link[];
    actions?: MappedLinks
}
