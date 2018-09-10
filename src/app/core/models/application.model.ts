import { Link, MappedLinks } from "./_commons.model";
import { HateoasAction } from "./hateoas-action.model";

export class Application {
    id: number;
    name: string;
    value: string;
    _links: Link[];
    actions?: MappedLinks
}
