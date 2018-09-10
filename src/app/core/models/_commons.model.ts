import { HateoasAction } from "./hateoas-action.model";

export class Method {
    method: string
};

export class Link {
    href: string;
    method: Method;
    name: string;
    rel: string;
}

export interface MappedLinks {
    [key: string]: HateoasAction
}