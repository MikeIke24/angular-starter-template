import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationCancel, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {AppStore} from './app.store';
import {RouteData} from './core/models/routes/route-data.model';
import {ANIMATION_MODULE_TYPE} from '@angular/platform-browser/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: ANIMATION_MODULE_TYPE, useValue: 'BrowserAnimations' },
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  loading = true;
  removeSplashScreen = false;
  navigating = false;

  // Creates an instance of AppComponent and inject a router service we'll use in the component.
  constructor(titleService: Title, router: Router, activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef,
              private appStore: AppStore) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigating = true;
      }
      if (event instanceof NavigationCancel) {
        this.navigating = false;
      }
      if (event instanceof NavigationEnd) {
        const routerState = router.routerState;
        const snapshot = router.routerState.root;
        const title = `CS - ${this.getTitle(routerState, snapshot).join(' - ')}`;
        titleService.setTitle(title);
        this.navigating = false;
        const previousPath = this.appStore.getRawUiState().currentPath;
        this.appStore.updateUiState({
          currentRouteData: this.collectRouteData(routerState, snapshot),
          currentRouteParams: activatedRoute.snapshot.queryParams,
          currentPath: router.url,
          previousPath
        });
      }
      this.cdRef.detectChanges();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onActivate() {
    this.loading = false;
    // Delay to remove splash screen after animation finishes
    setTimeout(() => {
      this.removeSplashScreen = true;
    }, 1000);
  }

  // collect that title data properties from all child routes
  getTitle(state, parent): string[] {
    return this.collectRouteDataField(state, parent, 'title');
  }

  private collectRouteDataField(state, parent: ActivatedRoute, fieldName: string): any[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data[fieldName]) {
      data.push(parent.snapshot.data[fieldName]);
    }

    if (state && parent) {
      data.push(...this.collectRouteDataField(state, state.firstChild(parent), fieldName));
    }
    return data;
  }

  private collectRouteData(state, parent: ActivatedRoute): RouteData {
    let data = null;
    if (parent && parent.snapshot.data) {
      const tempData = (parent.snapshot.data);
      if (!!tempData) {
        data = tempData;
      }
    }
    if (state && parent) {
      const tempData = this.collectRouteData(state, state.firstChild(parent));
      if (!!tempData) {
        data = tempData;
      }
    }
    return data;

  }
}
