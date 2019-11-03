import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router/';

export class CacheRouteReuseStrategy implements RouteReuseStrategy {
    storedRouteHandles = new Map<string, Map<string, DetachedRouteHandle>>();
    routesToNotStore = [];

    /**
     * Called every time when navigating between routes
     * @param before - leaving route
     * @param curr - landing route
     * @return - if TRUE the routing will not happen as route is still the same. If FALSE routing happens and below methods are called
     */
    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        this.routesToNotStore = [];
        const routesEqual = before.routeConfig === curr.routeConfig;
        if (!routesEqual) {
            this.storedRouteHandles.forEach((value, key) => {
                if (!this.isRouteInRoutePath(key, curr)) {
                    this.storedRouteHandles.get(key).forEach((v: DetachedRouteHandle) => {
                        // Destroys components that have been stored except for the current component that is being navigated away from
                        // That component will be destroyed in the store() method
                        try {
                            v['componentRef']['instance'].ngOnDestroy();
                        } catch (e) {
                        }
                    });
                    this.storedRouteHandles.delete(key);
                    this.routesToNotStore.push(key);
                }
            });
        }
        return routesEqual;
    }

    /**
     * Called if shouldAttach() returns TRUE or shouldReuseRoute() returns FALSE
     * @param route - current route (just landed)
     * @return - returns a stored route handle for component to load, or null for no effect
     */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (this.reuseRoute(route)) {
            const scopedStoredRouteHandles = this.storedRouteHandles.get(this.getCacheParent(route));
            if (!!scopedStoredRouteHandles) {
                return scopedStoredRouteHandles.get(this.getPath(route));
            }
        }
        return null;
    }

    /**
     * Called for the route just opened for the component landed on. Once the component is loaded
     * this method is called.
     * @param route - Route just opened
     * @return - If TRUE, retrieve() and store() methods are called. Otherwise component is created from scratch
     */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const scopedRouteHandles = this.storedRouteHandles.get(this.getCacheParent(route));
        return this.reuseRoute(route) && !!scopedRouteHandles && scopedRouteHandles.has(this.getPath(route));
    }

    /**
     * Invoked when leaving the current route
     *
     * @param route - Route leaving
     * @return - If TRUE, the store() method is called
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return this.reuseRoute(route);
    }

    /**
     * Invoked if shouldDetach() or shouldAttach() returns TRUE. Handles storing the route handle. What is stored here
     * will be used by the retrieve method
     * @param route - The route we are leaving
     * @param detachedTree - The route handle
     */
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        if (!this.routesToNotStore.includes(this.getCacheParent(route))) {
            // this while loop is needed to remove mat-tooltip from persisting on page change that's cached
            // see https://github.com/angular/components/issues/11478#issuecomment-420213238
            let el;
            while (document.getElementsByTagName('mat-tooltip-component').length > 0) {
                el = document.getElementsByTagName('mat-tooltip-component')[0];
                el.parentNode.removeChild(el);
            }

            let scopedStoredRouteHandles = this.storedRouteHandles.get(this.getCacheParent(route));
            if (!scopedStoredRouteHandles) {
                scopedStoredRouteHandles = new Map<string, DetachedRouteHandle>();
            }
            scopedStoredRouteHandles.set(this.getPath(route), detachedTree);
            this.storedRouteHandles.set(this.getCacheParent(route), scopedStoredRouteHandles);
        } else {
            // If route should be destroyed, destroy manually
            try {
                detachedTree['componentRef']['instance'].ngOnDestroy();
            } catch (e) {
            }
        }
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        if (route.routeConfig !== null && route.routeConfig.path !== null) {
            return route.routeConfig.path;
        }
        return '';
    }

    private getCacheParent(snapshot: ActivatedRouteSnapshot) {
        return snapshot.data.cacheParent;
    }

    private reuseRoute(snapshot: ActivatedRouteSnapshot): boolean {
        return !!this.getCacheParent(snapshot);
    }

    private getRoutePath(snapshot: ActivatedRouteSnapshot): string[] {
        const routes: string[] = [];
        for (let i = 0; i < snapshot.pathFromRoot.length; i++) {
            routes.push(this.getPath(snapshot.pathFromRoot[i]));
        }
        return routes;
    }

    private isRouteInRoutePath(route: string, snapshot: ActivatedRouteSnapshot): boolean {
        return this.getRoutePath(snapshot).includes(route);
    }
}
