import { ApplicationContent } from "./application-content.model";
import { Link } from "./commons";

export class ContentGroup {
  id: number | string;
  name: string;
  content: ApplicationContent[];
  _links: Link[]
}