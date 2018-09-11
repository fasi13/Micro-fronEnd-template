import { Link } from "./link.model";

export class DataPaginated<T> {
  items: T[];
  limit: number;
  offset: number;
  totalCount: number;
  _links: Link[];
}