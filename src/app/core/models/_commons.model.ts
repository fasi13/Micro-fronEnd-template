export class Method {
    method: string
};

export class Link {
    href: string;
    method: Method;
    name: string;
    rel: string;
}

export class MappedLink {
    method: string;
    url: string;
}
export interface MappedLinks {
    [key: string]: MappedLink
}