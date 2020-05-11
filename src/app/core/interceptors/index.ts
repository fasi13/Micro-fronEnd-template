
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProxyApiInterceptor } from './proxy-api.interceptor';
import { TokenInterceptor } from './token.interceptor';
import { UnauthorizedInterceptor } from './unauthorized.interceptor';
import { HttpResponseInterceptor } from './http-response.interceptor';
import { CultureInterceptor } from './culture.interceptor';


export const httpInterceptorProviders = [{
    provide: HTTP_INTERCEPTORS,
    useClass: ProxyApiInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: UnauthorizedInterceptor,
    multi: true
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpResponseInterceptor,
    multi: true
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: CultureInterceptor,
    multi: true,
  },
];
