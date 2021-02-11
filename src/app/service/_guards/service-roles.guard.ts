import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceRolesGuard implements CanActivate {

  canActivate(): Observable<boolean> {
    return this.getFromStoreOrAPI()
      .pipe(
        switchMap(() => of(true))
      );
  }

  private getFromStoreOrAPI(): Observable<any> {
    return of(true);
  }
}
