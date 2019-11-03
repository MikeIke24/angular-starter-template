import {BehaviorSubject, Observable} from 'rxjs';
import {ILoadingStore} from './loading-store.model';

export class LoadingStore implements ILoadingStore {
    protected readonly loadingSubject: BehaviorSubject<boolean>;

    constructor() {
        this.loadingSubject = new BehaviorSubject<boolean>(false);
    }


    get loading(): Observable<boolean> {
        return this.loadingSubject.asObservable();
    }

    startLoading(): void {
        this.loadingSubject.next(true);
    }

    doneLoading(): void {
        this.loadingSubject.next(false);
    }

}
