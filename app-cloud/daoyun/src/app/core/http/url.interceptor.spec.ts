import { TestBed } from '@angular/core/testing';

import { UrlInterceptor } from './url.interceptor';

describe('UrlInterceptor', () => {
  let interceptor: UrlInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = TestBed.inject(UrlInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});