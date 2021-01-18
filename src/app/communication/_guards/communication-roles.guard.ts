import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommunicationRolesGuard implements CanActivate {

  canActivate(): Observable<boolean> {
    return this.getFromStoreOrAPI()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  private getFromStoreOrAPI(): Observable<any> {
    return of(true);
  }
}
