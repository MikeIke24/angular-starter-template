import {Observable} from 'rxjs';

export interface ILoadingStore {
    loading: Observable<boolean>;

    startLoading(): void;

    doneLoading(): void;
}

