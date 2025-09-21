import {TestBed} from '@angular/core/testing';
import {HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';

import {authInterceptor} from './auth.interceptor';
import {environment} from '../../environments/environment';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authentication headers when AUTH_TOKEN is present', () => {
      const mockReq = new HttpRequest('GET', 'https://api.example.com/users');
      const next = jasmine.createSpy('next').and.returnValue(of(new HttpResponse({status: 200})));

      // Mock environment with token
      const originalToken = environment.AUTH_TOKEN;
      environment.AUTH_TOKEN = 'test-token-123';

      try {
          interceptor(mockReq, next).subscribe();

          expect(next).toHaveBeenCalledWith(
              jasmine.objectContaining({
                  headers: jasmine.objectContaining({
                      has: jasmine.any(Function),
                      get: jasmine.any(Function)
                  })
              })
          );

          const calledReq = next.calls.mostRecent().args[0] as HttpRequest<any>;
          expect(calledReq.headers.get('accept')).toBe('application/json');
          expect(calledReq.headers.get('Authentication')).toBe('Bearer test-token-123');
      } finally {
          environment.AUTH_TOKEN = originalToken;
      }
  });

    it('should add authentication headers even when AUTH_TOKEN is undefined', () => {
        const mockReq = new HttpRequest('GET', 'https://api.example.com/users');
        const next = jasmine.createSpy('next').and.returnValue(of(new HttpResponse({status: 200})));

        // Mock environment without token
      const originalToken = environment.AUTH_TOKEN;
      environment.AUTH_TOKEN = '';

        try {
            interceptor(mockReq, next).subscribe();

            const calledReq = next.calls.mostRecent().args[0] as HttpRequest<any>;
            expect(calledReq.headers.get('accept')).toBe('application/json');
          expect(calledReq.headers.get('Authentication')).toBe('Bearer ');
        } finally {
          environment.AUTH_TOKEN = originalToken;
        }
    });
});
