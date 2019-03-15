import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor() { }
  /** 
  *@TODO Refactor this once that get the name (fileName) that it in the answer 
  * in the header part in the Content-Disposition. For now will be send as a parameter 
  * to filename with the name of the file. When the file name is from eader the parameter
  * filename will be removed.
  */
  dowloaderResource(response: HttpResponse<any>, filename: string) {
    const blob = new Blob([response.body], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.setAttribute('href', url);

    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
