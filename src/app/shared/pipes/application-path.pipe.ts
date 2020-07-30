import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationPath } from '@forge/core';

@Pipe({
  name: 'fgeApplicationPath'
})
export class ApplicationPathPipe implements PipeTransform {

  transform(value: ApplicationPath): any {
    const appPath = value.path;
    let strPath = '';
    appPath.forEach((element, index, array) => {
      if (element) {
        const separator = index === array.length - 1 ? '' : ' > ';
        const elementId = (+element.value > -1) ? ` (${element.value})` : '';
        strPath += `${element.name}${elementId}${separator}`;
      }
    });
    return strPath;
  }

}
