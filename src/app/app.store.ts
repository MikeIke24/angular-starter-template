import {Injectable} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {BreakpointSizes, ScreenSizeBreakpointService} from './core/services/window-size/screen-size-breakpoint.service';
import {UiStore} from './core/stores/ui-store/ui-store';
import {RouteData} from './core/models/routes/route-data.model';

export type SidenavMode = 'over' | 'push' | 'side';

export interface AppState {
  navigating: boolean;
  loading: boolean;
  windowSize: BreakpointSizes;
  currentRouteData: RouteData;
  currentRouteParams: object;
  currentPath: string;
  previousPath: string;
}

export const INITIAL_APP_STATE: Partial<AppState> = {
  navigating: false,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class AppStore extends UiStore<AppState> {
  mobileSizes: Partial<BreakpointSizes>[] = ['XSmall'];
  tabletSizes: Partial<BreakpointSizes>[] = ['XSmall', 'Small'];
  private leftSidenavSubject: Subject<boolean>;
  private subscriptions = new Subscription();

  constructor(private breakpointService: ScreenSizeBreakpointService) {
    super(INITIAL_APP_STATE);
    super.dispatchUiState(INITIAL_APP_STATE as AppState);
    this.subToBreakpointService();
    this.leftSidenavSubject = new Subject();
  }

  get leftSidenavToggled$(): Observable<boolean> {
    return this.leftSidenavSubject.asObservable();
  }

  isMobile(): Observable<boolean> {
    return this.getStateProp('windowSize').pipe(map(size => this.mobileSizes.includes(size)));
  }

  isCurrentlyMobile(): boolean {
    return this.breakpointService.isSize(this.mobileSizes[this.mobileSizes.length - 1]);
  }

  isTablet(): Observable<boolean> {
    return this.getStateProp('windowSize').pipe(map(size => this.tabletSizes.includes(size)));
  }

  toggleLeftSidenav() {
    this.leftSidenavSubject.next(true);
  }

  private subToBreakpointService() {
    const breakpointSub = this.breakpointService.sizeChanges$.subscribe(size => {
      if (!!size) {
        this.updateUiState({
          windowSize: size
        });
      }
    });
    this.subscriptions.add(breakpointSub);
  }
}
