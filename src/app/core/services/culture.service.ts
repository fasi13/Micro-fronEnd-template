
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CultureService {
  getAvailableCultures(): string[] {
    return (environment as any).cultures;
  }

  getCurrentCulture(): string {
    return localStorage.getItem('cultureCode') || this.DefaultCulture;
  }

  setCurrentCulture(cultureCode: string) {
    localStorage.setItem('cultureCode', cultureCode);
    return this.getCurrentCulture();
  }

  resetCurrentCultureToDefault() {
    this.setCurrentCulture(this.DefaultCulture);
    return this.getCurrentCulture();
  }

  get DefaultCulture(): string {
    return this.getAvailableCultures()[0];
  }
}
