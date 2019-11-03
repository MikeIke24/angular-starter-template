import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingStore } from '../loading-store/loading-store';
import { IUiStore } from './ui-store.model';

export class UiStore<T> extends LoadingStore implements IUiStore<T> {
    private readonly uiStateSubject: BehaviorSubject<T>;
    private readonly INITIAL_UI_STATE: Partial<T>;

    constructor(initialState: Partial<T>) {
        super();
        this.uiStateSubject = new BehaviorSubject<T>(initialState as T);
        this.INITIAL_UI_STATE = initialState;
    }

    getUiState(): Observable<T> {
        return this.uiStateSubject.asObservable();
    }

    getRawUiState(): T {
        return _.cloneDeep(this.uiStateSubject.value);
    }

    getStateProp<K extends keyof T>(prop: K): Observable<T[K]> {
        return this.getUiState().pipe(map(state => state[prop]));
    }

    updateUiState(uiState: Partial<T>) {
        const targetUiState = this.getRawUiState();
        this.dispatchUiState(Object.assign(targetUiState, uiState as T));
    }

    resetUiState() {
        this.dispatchUiState(this.INITIAL_UI_STATE as T);
    }

    dispatchUiState(uiState?: T): void {
        !!uiState ? this.uiStateSubject.next(_.cloneDeep(uiState)) : this.uiStateSubject.next(this.getRawUiState());
    }

    protected getRawUiStateNoClone(): T {
        return this.uiStateSubject.value;
    }

    protected generateId(s: string): string {
        let h: number;
        for (let i = 0; i < s.length; i++) {
            // tslint:disable-next-line:no-bitwise
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        }
        return h.toString(10);
    }

    protected insertString(string: string, stringToInsert = '', pos = 0): string {
        return string.slice(0, pos) + stringToInsert + string.slice(pos);
    }

    protected randomString(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
