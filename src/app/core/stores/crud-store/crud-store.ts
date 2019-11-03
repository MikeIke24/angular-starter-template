import {combineLatest, Observable} from 'rxjs';
import {EntityStore} from '../entity-store/entity-store';
import {StoreModel} from './crud-store.model';
import {map} from 'rxjs/operators';
import {StoreMessage} from '../../models/messages/store-message.model';

export class CRUDStore<T> extends EntityStore<T> {
    constructor() {
        super();
    }

    get state(): Observable<StoreModel<T, StoreMessage>> {
        return combineLatest([this.entitySubject, this.messageSubject, this.loadingSubject]).pipe(map(arr => {
            return {
                entities: arr[0],
                messages: arr[1],
                loading: arr[2]
            };
        }));
    }

    clearState(): void {
        // TODO Implement some way that this will not cause the state to emit 3 times
        this.removeAllEntities();
        this.removeAllMessages();
        this.doneLoading();
    }

}
