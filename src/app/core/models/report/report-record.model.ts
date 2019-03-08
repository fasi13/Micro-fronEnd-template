import { ApplicationPath } from '../application';

export class ReportRecord {
  login: string;
  firstName: string;
  lastName: string;
  application: ApplicationPath;
  section: string;
  actionPerformed: string;
  actionDate: string;
}
