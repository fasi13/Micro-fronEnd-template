export interface ListingParams<T = any> {
    id?: any;
    items?: T;
    limit?: number;
    offset?: number;
    filters?: any;
    sort?: any;
}
