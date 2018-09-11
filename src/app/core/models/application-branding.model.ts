import { ApiResponse, DataPaginated } from "./commons";
import { ApplicationContent } from "./application-content.model";

export class ApplicationBranding {
   primaryColor: ApplicationContent;
   secondaryColor: ApplicationContent;
   primaryLogo: ApplicationContent;
   siteUrl: ApplicationContent;
   programName: ApplicationContent;
   secondaryLogo: ApplicationContent;
}