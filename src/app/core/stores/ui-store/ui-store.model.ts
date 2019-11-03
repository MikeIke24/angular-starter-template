import {Observable} from 'rxjs';

export interface IUiStore<T> {
    getUiState(): Observable<T>;

    getRawUiState(): T;

    getStateProp<K extends keyof T>(prop: K): Observable<T[K]>;

    updateUiState(uiState: Partial<T>): void;

    resetUiState(): void;

    dispatchUiState(uiState?: T): void;
}

