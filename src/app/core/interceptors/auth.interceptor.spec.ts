import { HttpClient, HttpErrorResponse, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '../../features/profile/services/alert.service';
import { JwtService } from '../services/security/jwt.service';
import { AuthInterceptor, InterceptorSkipHeader } from './auth.interceptor';


describe('AuthInterceptor', () => {

  let tokenService: JwtService;
  let alertService: AlertService;
  const testUrl = '/data';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }]
    });

    tokenService = TestBed.get(JwtService);
    alertService = TestBed.get(AlertService);
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.get(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe('making http calls', () => {
    it('should handle 404 error', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      const msg = 'got a 404 error';

      http.get(testUrl)
        .subscribe(response => fail('should have failed with a 404 error'),
          (error: HttpErrorResponse) => {
            expect(error.status).toEqual(404, 'status');
            expect(error.error).toEqual(msg, 'message');
          }
        );
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(msg, { status: 404, statusText: 'Not Found' });
    }));

    it('should handle network error', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      const msg = 'got a network error';

      http.get(testUrl)
        .subscribe(response => fail('should have failed with a network error'),
          (error: HttpErrorResponse) => {
            expect(error.error.message).toEqual(msg, 'message');
          }
        );
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      // Create mock ErrorEvent, raised when something goes wrong at the network level.
      // Connection timeout, DNS error, offline, etc
      const mockError = new ErrorEvent('Network error', {
        message: msg,
      });

      req.error(mockError);
    }));


    it('should add Authorization header - token exists', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(tokenService, 'getToken').and.returnValue('ABC123');

      http.get(testUrl)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });

      const req = httpMock.expectOne(r =>
        r.headers.has('Authorization') &&
        r.headers.get('Authorization') === 'Bearer ABC123');
      expect(req.request.method).toEqual('GET');
      expect(tokenService.getToken).toHaveBeenCalled();

      req.flush({ status: 200 });

    }));

    it('should NOT add Authorization header - no token', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(tokenService, 'getToken').and.returnValue(null);

      http.get(testUrl)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });

      const req = httpMock.expectOne(r =>
        r.headers.get('Authorization') === null);
      expect(req.request.method).toEqual('GET');
      expect(tokenService.getToken).toHaveBeenCalled();

      req.flush({ status: 200 });

    }));

    it('should NOT add Authorization header - InterceptorSkipHeader exists in request',
      inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

        const httpHeaders = new HttpHeaders().set(InterceptorSkipHeader, '');

        spyOn(tokenService, 'getToken');

        http.get(testUrl, { headers: httpHeaders })
          .subscribe(response => {
            expect(response).toBeTruthy();
          });

        const req = httpMock.expectOne(r =>
          r.headers.get('Authorization') === null &&
          r.headers.get(InterceptorSkipHeader) === null);
        expect(req.request.method).toEqual('GET');
        expect(tokenService.getToken).not.toHaveBeenCalled();

        req.flush({ status: 200 });

      }));
  });
});
