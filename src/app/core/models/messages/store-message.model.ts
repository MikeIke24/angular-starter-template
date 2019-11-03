import {AppMessage} from './app-message.model';
import {E2MessageType} from './e2-message-type.enum';

export interface StoreMessage<T extends E2MessageType = any> extends AppMessage<T> {
    id: string;
    timestamp: string;
}
