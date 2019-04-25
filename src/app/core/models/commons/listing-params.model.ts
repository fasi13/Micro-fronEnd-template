export interface ListingParams<T = any> {
    items?: T;
    limit?: number;
    offset?: number;
    filters?: any;
    sort?: any;
}
