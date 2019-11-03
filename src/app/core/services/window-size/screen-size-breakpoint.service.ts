import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

export interface IBreakpointMatchers {
    XSmall: string;
    Small: string;
    Medium: string;
    Large: string;
    XLarge: string;
    Handset: string;
    Tablet: string;
    Web: string;
    HandsetPortrait: string;
    TabletPortrait: string;
    WebPortrait: string;
    HandsetLandscape: string;
    TabletLandscape: string;
    WebLandscape: string;

}

export type BreakpointMatchers = keyof IBreakpointMatchers;

export interface IBreakpointSizes {
    XSmall?: string;
    Small?: string;
    Medium?: string;
    Large?: string;
    XLarge?: string;
}

export type BreakpointSizes = keyof IBreakpointSizes;

@Injectable({
    providedIn: 'root'
})
export class ScreenSizeBreakpointService {
    breakpointChanges$: Observable<BreakpointMatchers>;
    sizeChanges$: Observable<BreakpointSizes>;
    private breakpointKeys: BreakpointMatchers[] = Object.keys(Breakpoints as IBreakpointMatchers) as BreakpointMatchers[];
    private breakpointValues: string[] = Object.keys(Breakpoints as IBreakpointMatchers).map(e => Breakpoints[e]);
    private breakpointSizeKeys: BreakpointSizes[] = ['XSmall', 'Small', 'Medium', 'Large', 'XLarge'];
    private breakpointSizeValues: string[] = this.breakpointSizeKeys.map(key => Breakpoints[key]);

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointChanges$ = this.breakpointObserver.observe(this.breakpointValues)
            .pipe(
                map((result: BreakpointState) => {
                    for (let i = 0; i < this.breakpointValues.length; i++) {
                        if (result.breakpoints[this.breakpointValues[i]]) {
                            return this.breakpointKeys[i];
                        }
                    }
                }));

        this.sizeChanges$ = this.breakpointObserver.observe(this.breakpointSizeValues)
            .pipe(
                map((result: BreakpointState) => {
                    for (let i = 0; i < this.breakpointSizeValues.length; i++) {
                        if (result.breakpoints[this.breakpointSizeValues[i]]) {
                            return this.breakpointSizeKeys[i];
                        }
                    }
                }));
    }

    is(size: BreakpointMatchers) {
        return this.breakpointObserver.isMatched(Breakpoints[size]);
    }

    isSize(size: BreakpointSizes) {
        return this.breakpointObserver.isMatched(this.getSizesUpTo(size));
    }

    getChangesForMatcher(matcher: BreakpointMatchers): Observable<boolean> {
        return this.breakpointObserver.observe(Breakpoints[matcher])
            .pipe(
                map((result: BreakpointState) => result.matches));
    }

    getChangesForSize(size: BreakpointSizes): Observable<boolean> {
        const sizes = this.getSizesUpTo(size);
        return this.breakpointObserver.observe(sizes)
            .pipe(
                map((result: BreakpointState) => result.matches));
    }

    getSizesUpTo(size: BreakpointSizes) {
        return this.breakpointSizeKeys.slice(0, this.breakpointKeys.indexOf(size) + 1).map(name => Breakpoints[name]);
    }
}
