import {Observable} from 'rxjs';
import {StoreMessage} from '../../models/messages/store-message.model';
import {AppMessage} from '../../models/messages/app-message.model';
import {E2MessageType} from '../../models/messages/e2-message-type.enum';
import {E2Page} from '../../models/messages/e2-page.enum';

export interface IMessageStore<E extends StoreMessage, A extends AppMessage> {

    storeId: string;

    messages: Observable<E[]>;

    addMessage(appMessage: A): E;

    addInfoMessage(appMessage: A): E;

    addSuccessMessage(appMessage: A): E;

    addErrorMessage(appMessage: A): E;

    addWarningMessage(appMessage: A): E;

    removeMessage(messageId: string): void;

    removeMessagesByType(type: E2MessageType): void;

    removeMessagesByPageType(type: E2Page[]): void;

    removeAllMessages(removePersisting: boolean): void;

    dispatchMessages(messages?: A[]): void;
}


