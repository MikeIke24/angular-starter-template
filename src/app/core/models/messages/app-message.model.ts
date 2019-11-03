import {E2MessageType} from './e2-message-type.enum';
import {E2Page} from './e2-page.enum';

export interface AppMessage<T extends E2MessageType = any> {
    title: string;
    message: string;
    type?: T; // Error, Warning, Success, or Info
    pageScopes?: E2Page[]; // A list of pages that the message will show up on, and on page destroy will clear the message from the store
    persistOnDestroy?: boolean; // Defaults to false. If true, can only be removed by passing in an extra flag to the clear message methods of the store
    /* Input a css string that matches an element. When clicked, the element will get focus and the page will scroll to the element
     Currently experimental! */
    linkToElWithCss?: string;
}
