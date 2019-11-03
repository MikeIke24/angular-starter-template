import {BehaviorSubject, Observable} from 'rxjs';
import * as _ from 'lodash';
import {LoadingStore} from '../loading-store/loading-store';
import {IMessageStore} from './message-store.model';
import {AppMessage} from '../../models/messages/app-message.model';
import {StoreMessage} from '../../models/messages/store-message.model';
import {E2MessageType} from '../../models/messages/e2-message-type.enum';
import {RemoveMessage} from '../../models/messages/remove-message.model';
import {E2Page} from '../../models/messages/e2-page.enum';

export class MessageStore extends LoadingStore implements IMessageStore<StoreMessage, AppMessage> {
    protected readonly messageSubject: BehaviorSubject<StoreMessage[]>;
    public storeId: string;

    constructor() {
        super();
        this.messageSubject = new BehaviorSubject<StoreMessage[]>([]);
        this.storeId = this.generateId('storeId');
    }

    get messages(): Observable<StoreMessage[]> {
        return this.messageSubject.asObservable();
    }

    get rawMessages(): StoreMessage[] {
        return _.cloneDeep(this.messageSubject.value);
    }

    addMessage(appMessage: AppMessage): StoreMessage {
        if (!appMessage.type) {
            console.log('Message not given type. Setting to info message as default');
            appMessage.type = E2MessageType.INFO;
        }
        if (!appMessage.pageScopes) {
            appMessage.pageScopes = [];
        }
        const date = new Date();
        const time = date.toLocaleString();
        let ms = date.getTime().toString(10);
        ms = ms.slice(ms.length - 3, ms.length);
        const ts = this.insertString(time, `.${ms}`, time.length - 3);
        const storeMessage: StoreMessage = {
            ...appMessage,
            timestamp: ts,
            id: this.generateId(ts + appMessage.message + appMessage.title + appMessage.type) + this.randomString()
        };
        const messages = this.rawMessages;
        messages.unshift(storeMessage);
        this.dispatchMessages(messages);
        return storeMessage;
    }

    addInfoMessage(appMessage: AppMessage): StoreMessage {
        appMessage.type = E2MessageType.INFO;
        return this.addMessage(appMessage);
    }

    addSuccessMessage(appMessage: AppMessage): StoreMessage {
        appMessage.type = E2MessageType.SUCCESS;
        return this.addMessage(appMessage);
    }

    addErrorMessage(appMessage: AppMessage): StoreMessage {
        appMessage.type = E2MessageType.ERROR;
        return this.addMessage(appMessage);
    }

    addWarningMessage(appMessage: AppMessage): StoreMessage {
        appMessage.type = E2MessageType.WARNING;
        return this.addMessage(appMessage);
    }

    removeMessage(messageId: string, removePersisting = false): void {
        const messages = this.rawMessages;
        const i = messages.findIndex(m => m.id === messageId);
        if (i === -1) {
            throw new Error(`Could not find message with id: ${messageId}`);
        }
        if (!removePersisting && messages[i].persistOnDestroy) {
            throw new Error('Could not remove message. It is set to persist on destroy. Pass in extra parameter to remove.');
        }
        messages.splice(i, 1);
        this.dispatchMessages(messages);
    }

    removeMessages(removeMessages: RemoveMessage[], removePersisting = false): void {
        let messages = this.rawMessages;
        removeMessages = removeMessages.filter(rm => rm.storeId === this.storeId);
        messages = messages.filter(m => {
            const i = removeMessages.findIndex(rm => m.id === rm.messageId);
            return !(i !== -1 || (!removePersisting && m.persistOnDestroy));
        });
        this.dispatchMessages(messages);
    }

    removeMessagesByType(type: E2MessageType, removePersisting = false): void {
        const messages = this.rawMessages.filter(m => m.type !== type || (m.persistOnDestroy && !removePersisting));
        this.dispatchMessages(messages);
    }

    removeMessagesByTypeAndPage(type: E2MessageType, pagesToClear: E2Page[], removePersisting = false): void {
        const messages = this.rawMessages.filter(m => (m.persistOnDestroy && !removePersisting) ||
            !m.pageScopes.map(page => pagesToClear.includes(page)).includes(true) || m.type !== type);
        this.dispatchMessages(messages);
    }

    removeMessagesByPageType(pagesToClear: E2Page[], removePersisting = false): void {
        const messages = this.rawMessages.filter(m => (m.persistOnDestroy && !removePersisting) ||
            !m.pageScopes.map(page => pagesToClear.includes(page)).includes(true));
        this.dispatchMessages(messages);
    }

    removeAllMessages(removePersisting = false): void {
        const messages = removePersisting ? [] : this.rawMessages.filter(m => m.persistOnDestroy);
        this.dispatchMessages(messages);
    }

    dispatchMessages(messages?: StoreMessage[]): void {
        !!messages ? this.messageSubject.next(_.cloneDeep(messages)) : this.messageSubject.next(this.rawMessages);
    }

    private generateId(s: string): string {
        let h: number;
        for (let i = 0; i < s.length; i++) {
            // tslint:disable-next-line:no-bitwise
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        }
        return h.toString(10);
    }

    private insertString(s: string, stringToInsert = '', pos = 0): string {
        return s.slice(0, pos) + stringToInsert + s.slice(pos);
    }

    private randomString(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
