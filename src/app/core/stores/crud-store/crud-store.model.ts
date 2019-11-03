import {Observable} from 'rxjs';
import {IEntityStore} from '../entity-store/entity-store.model';
import {IMessageStore} from '../message-store/message-store.model';
import {ILoadingStore} from '../loading-store/loading-store.model';
import {StoreMessage} from '../../models/messages/store-message.model';
import {AppMessage} from '../../models/messages/app-message.model';


export interface StoreModel<T, E> {
    entities: T[];
    messages: E[];
    loading: boolean;
}

export interface ICRUDStore<T, E> extends IEntityStore<T>, IMessageStore<StoreMessage, AppMessage>, ILoadingStore {
    state: Observable<StoreModel<T, E>>;
    clearState(): void;
}


