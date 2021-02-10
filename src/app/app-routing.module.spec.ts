import { UrlSegment } from '@angular/router';
import { serviceMatcherFunction } from './app-routing.module';

describe('routingModule', () => {

  it('serviceMatcherFunction returns the url', () => {
    const url =  new UrlSegment('service', null);
    const result = serviceMatcherFunction([url]);

  expect(result).toEqual({consumed: [url]});

  });

  it('serviceMatcherFunction returns null', () => {

    const result = serviceMatcherFunction([]);

  expect(result).toBeNull();

  });

  it('serviceMatcherFunction returns null if not service', () => {
    const url =  new UrlSegment('NotService', null);
    const result = serviceMatcherFunction([url]);

    expect(result).toBeNull();

  });



});
