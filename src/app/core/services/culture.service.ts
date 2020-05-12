import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CultureService {
  getAvailableCultures(): string[] {
    return environment.cultures;
  }

  getCurrentCulture(): string {
    return localStorage.getItem('cultureCode');
  }

  setCurrentCulture(cultureCode: string) {
    localStorage.setItem('cultureCode', cultureCode);
    return cultureCode;
  }
}
