import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private mobileSubject = new BehaviorSubject<boolean>(true);
  mobile$ = this.mobileSubject.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.init();
  }

  init() {
    this.breakpointObserver
      .observe(['(max-width: 599px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobileSubject.next(true);
        } else {
         this.mobileSubject.next(false);
        }
      });
  }

  setWindowLocation(url: string) {
    window.location.href = url;
  }

  isMobile(): Observable<boolean> {
    return this.mobile$;
  }
}
