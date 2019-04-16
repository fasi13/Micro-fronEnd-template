export interface FilterSettingModel<T = any> {
    items?: T;
    limit?: number;
    offset?: number;
    filters?: any;
    sort?: any;
    totalCount?: any;
}
