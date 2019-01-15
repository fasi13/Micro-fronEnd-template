import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
