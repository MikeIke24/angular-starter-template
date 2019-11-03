import {MessageStore} from './message-store';
import {AppMessage} from '../../../shared/models/messages/app-message.model';
import {E2MessageType} from '../../../shared/models/messages/e2-message-type.enum';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {E2Page} from '../../../shared/models/messages/e2-page.enum';

describe('MessageStore', () => {

    let messageStore: MessageStore;
    const unsubscribe$ = new Subject<boolean>();

    beforeEach(() => {
        messageStore = new MessageStore();
    });

    it('should create', () => {
        expect(messageStore).toBeTruthy();
    });

    it('should return an empty list from subscribing', (done) => {
        messageStore.messages.subscribe(m => {
            expect(m.length).toBe(0);
            done();
        });
    });

    it('should return an empty list from value', () => {
        expect(messageStore.rawMessages.length).toBe(0);
    });

    it('should add a message and verify id and timestamp was created', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test',
            type: E2MessageType.INFO
        };
        messageStore.messages.subscribe(messages => {
            if (messages.length > 0) {
                const timestampDate = new Date(messages[0].timestamp);
                const currentDate = new Date();
                expect(messages[0].id).toBeTruthy();
                expect(timestampDate.getDate()).toBe(currentDate.getDate());
                expect(messages[0].message).toBe('test message');
                expect(messages[0].title).toBe('Test');
                expect(messages[0].type).toBe(E2MessageType.INFO);
                done();
            }
        });
        messageStore.addMessage(appMessage);
    });

    it('should add an INFO message and verify id and timestamp was created', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        messageStore.messages.subscribe(messages => {
            if (messages.length > 0) {
                const timestampDate = new Date(messages[0].timestamp);
                const currentDate = new Date();
                expect(messages[0].id).toBeTruthy();
                expect(timestampDate.getDate()).toBe(currentDate.getDate());
                expect(messages[0].message).toBe('test message');
                expect(messages[0].title).toBe('Test');
                expect(messages[0].type).toBe(E2MessageType.INFO);
                done();
            }
        });
        messageStore.addInfoMessage(appMessage);
    });

    it('should add a SUCCESS message and verify id and timestamp was created', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        messageStore.messages.subscribe(messages => {
            if (messages.length > 0) {
                const timestampDate = new Date(messages[0].timestamp);
                const currentDate = new Date();
                expect(messages[0].id).toBeTruthy();
                expect(timestampDate.getDate()).toBe(currentDate.getDate());
                expect(messages[0].message).toBe('test message');
                expect(messages[0].title).toBe('Test');
                expect(messages[0].type).toBe(E2MessageType.SUCCESS);
                done();
            }
        });
        messageStore.addSuccessMessage(appMessage);
    });

    it('should add a WARNING message and verify id and timestamp was created', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        messageStore.messages.subscribe(messages => {
            if (messages.length > 0) {
                const timestampDate = new Date(messages[0].timestamp);
                const currentDate = new Date();
                expect(messages[0].id).toBeTruthy();
                expect(timestampDate.getDate()).toBe(currentDate.getDate());
                expect(messages[0].message).toBe('test message');
                expect(messages[0].title).toBe('Test');
                expect(messages[0].type).toBe(E2MessageType.WARNING);
                done();
            }
        });
        messageStore.addWarningMessage(appMessage);
    });

    it('should add an ERROR message and verify id and timestamp was created', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        messageStore.messages.subscribe(messages => {
            if (messages.length > 0) {
                const timestampDate = new Date(messages[0].timestamp);
                const currentDate = new Date();
                expect(messages[0].id).toBeTruthy();
                expect(timestampDate.getDate()).toBe(currentDate.getDate());
                expect(messages[0].message).toBe('test message');
                expect(messages[0].title).toBe('Test');
                expect(messages[0].type).toBe(E2MessageType.ERROR);
                done();
            }
        });
        messageStore.addErrorMessage(appMessage);
    });

    it('should delete a single message by ID', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId = messageStore.addErrorMessage(appMessage).id;
        messageStore.addErrorMessage(appMessage);
        messageStore.addErrorMessage(appMessage);
        messageStore.messages.subscribe(messages => {
            if (messages.length === 3 && messages[2].id === storeMessageId) {
                messageStore.removeMessage(storeMessageId);
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 2) {
                        expect(messages2.find(m => m.id === storeMessageId)).toBeFalsy();
                        done();
                    }
                });
            }
        });
    });

    it('should NOT delete a single message by ID if set to persist', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test',
            persistOnDestroy: true
        };
        const storeMessageId = messageStore.addErrorMessage(appMessage).id;
        messageStore.addErrorMessage(appMessage);
        messageStore.addErrorMessage(appMessage);
        messageStore.messages.pipe(takeUntil(unsubscribe$)).subscribe(messages => {
            if (messages.length === 3 && messages[2].id === storeMessageId) {
                try {
                    messageStore.removeMessage(storeMessageId);
                } catch (e) {
                    expect(e.message).toBe('Could not remove message. It is set to persist on destroy. Pass in extra parameter to remove.');
                    unsubscribe$.next(true);
                    messageStore.dispatchMessages();
                    messageStore.messages.subscribe(messages2 => {
                        if (messages2.length === 3) {
                            expect(messages2.find(m => m.id === storeMessageId)).toBeTruthy();
                            done();
                        }
                    });
                }
            }
        });
    });

    it('should delete multiple messages by message id and store id', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId1 = messageStore.addErrorMessage(appMessage).id;
        const storeMessageId2 = messageStore.addErrorMessage(appMessage).id;
        messageStore.addErrorMessage(appMessage);
        messageStore.messages.subscribe(messages => {
            if (messages.length === 3 && messages[2].id === storeMessageId1 && messages[1].id === storeMessageId2) {
                messageStore.removeMessages([
                    {
                        storeId: messageStore.storeId,
                        messageId: storeMessageId1
                    },
                    {
                        storeId: messageStore.storeId,
                        messageId: storeMessageId2
                    }
                ]);
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 1) {
                        expect(messages2.find(m => m.id === storeMessageId1)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId2)).toBeFalsy();
                        done();
                    }
                });
            }
        });
    });

    it('should delete 1 messages by message id and store id', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId1 = messageStore.addErrorMessage(appMessage).id;
        const storeMessageId2 = messageStore.addErrorMessage(appMessage).id;
        messageStore.addErrorMessage(appMessage);
        messageStore.messages.subscribe(messages => {
            if (messages.length === 3 && messages[2].id === storeMessageId1 && messages[1].id === storeMessageId2) {
                messageStore.removeMessages([
                    {
                        storeId: messageStore.storeId,
                        messageId: storeMessageId1
                    },
                    {
                        storeId: '1',
                        messageId: storeMessageId2
                    }
                ]);
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 2) {
                        expect(messages2.find(m => m.id === storeMessageId1)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId2)).toBeTruthy();
                        done();
                    }
                });
            }
        });
    });


    it('should remove all error messages only', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId1 = messageStore.addErrorMessage(appMessage).id;
        const storeMessageId2 = messageStore.addErrorMessage(appMessage).id;
        const storeMessageId3 = messageStore.addInfoMessage(appMessage).id;

        messageStore.messages.subscribe(messages => {
            if (messages.length === 3 && messages[2].id === storeMessageId1 && messages[1].id === storeMessageId2) {
                messageStore.removeMessagesByType(E2MessageType.ERROR);
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 1) {
                        expect(messages2.find(m => m.id === storeMessageId1)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId2)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId3)).toBeTruthy();
                        done();
                    }
                });
            }
        });
    });

    it('should remove all Profile Overview messages only', (done) => {
        const appMessageProfileOverview: AppMessage = {
            message: 'test message',
            title: 'Test',
            pageScopes: [E2Page.PROFILE_OVERVIEW]
        };
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId1 = messageStore.addErrorMessage(appMessageProfileOverview).id;
        const storeMessageId2 = messageStore.addErrorMessage(appMessageProfileOverview).id;
        const storeMessageId3 = messageStore.addInfoMessage(appMessage).id;

        messageStore.messages.subscribe(messages => {
            if (messages.length === 3 && messages[2].id === storeMessageId1 && messages[1].id === storeMessageId2) {
                messageStore.removeMessagesByPageType([E2Page.PROFILE_OVERVIEW]);
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 1) {
                        expect(messages2.find(m => m.id === storeMessageId1)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId2)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId3)).toBeTruthy();
                        done();
                    }
                });
            }
        });
    });

    it('should remove all Profile Overview and Routing Pool messages only', (done) => {
        const appMessageProfileOverview: AppMessage = {
            message: 'test message',
            title: 'Test',
            pageScopes: [E2Page.PROFILE_OVERVIEW]
        };
        const appMessageRoutingPools: AppMessage = {
            message: 'test message',
            title: 'Test',
            pageScopes: [E2Page.ROUTING_POOLS]
        };
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId1 = messageStore.addErrorMessage(appMessageProfileOverview).id;
        const storeMessageId2 = messageStore.addErrorMessage(appMessageRoutingPools).id;
        const storeMessageId3 = messageStore.addInfoMessage(appMessage).id;

        messageStore.messages.subscribe(messages => {
            if (messages.length === 3 && messages[2].id === storeMessageId1 && messages[1].id === storeMessageId2) {
                messageStore.removeMessagesByPageType([E2Page.PROFILE_OVERVIEW, E2Page.ROUTING_POOLS]);
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 1) {
                        expect(messages2.find(m => m.id === storeMessageId1)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId2)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId3)).toBeTruthy();
                        done();
                    }
                });
            }
        });
    });

    it('should remove all Profile Overview and Routing Pool warning messages only', (done) => {
        const appMessageProfileOverview: AppMessage = {
            message: 'test message',
            title: 'Test',
            pageScopes: [E2Page.PROFILE_OVERVIEW]
        };
        const appMessageRoutingPools: AppMessage = {
            message: 'test message',
            title: 'Test',
            pageScopes: [E2Page.ROUTING_POOLS]
        };
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId1 = messageStore.addErrorMessage(appMessageProfileOverview).id;
        const storeMessageId2 = messageStore.addErrorMessage(appMessageRoutingPools).id;
        const storeMessageId3 = messageStore.addInfoMessage(appMessage).id;
        const storeMessageId4 = messageStore.addWarningMessage(appMessageProfileOverview).id;
        const storeMessageId5 = messageStore.addWarningMessage(appMessageRoutingPools).id;

        messageStore.messages.subscribe(messages => {
            if (messages.length === 5) {
                messageStore.removeMessagesByTypeAndPage(E2MessageType.WARNING, [E2Page.PROFILE_OVERVIEW, E2Page.ROUTING_POOLS]);
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 3) {
                        expect(messages2.find(m => m.id === storeMessageId1)).toBeTruthy();
                        expect(messages2.find(m => m.id === storeMessageId2)).toBeTruthy();
                        expect(messages2.find(m => m.id === storeMessageId3)).toBeTruthy();
                        expect(messages2.find(m => m.id === storeMessageId4)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId5)).toBeFalsy();
                        done();
                    }
                });
            }
        });
    });

    it('should remove all messages', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const storeMessageId1 = messageStore.addErrorMessage(appMessage).id;
        const storeMessageId2 = messageStore.addErrorMessage(appMessage).id;
        const storeMessageId3 = messageStore.addInfoMessage(appMessage).id;

        messageStore.messages.subscribe(messages => {
            if (messages.length === 3) {
                messageStore.removeAllMessages();
                messageStore.messages.subscribe(messages2 => {
                    if (messages2.length === 0) {
                        expect(messages2.find(m => m.id === storeMessageId1)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId2)).toBeFalsy();
                        expect(messages2.find(m => m.id === storeMessageId3)).toBeFalsy();
                        done();
                    }
                });
            }
        });
    });

    it('should add an ERROR message by dispatching it manually', (done) => {
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        const message = messageStore.addErrorMessage(appMessage);
        message.message = 'new message';
        messageStore.dispatchMessages([message]);
        messageStore.messages.subscribe(messages => {
            if (messages.length > 0 && messages[0].message === 'new message') {
                const timestampDate = new Date(messages[0].timestamp);
                const currentDate = new Date();
                expect(messages[0].id).toBeTruthy();
                expect(timestampDate.getDate()).toBe(currentDate.getDate());
                expect(messages[0].message).toBe('new message');
                expect(messages[0].title).toBe('Test');
                expect(messages[0].type).toBe(E2MessageType.ERROR);
                done();
            }
        });
    });

    it('should push out existing message if no parameter given to dispatch method', (done) => {
        let count = 0;
        const appMessage: AppMessage = {
            message: 'test message',
            title: 'Test'
        };
        messageStore.messages.subscribe(messages => {
            if (messages.length === 1) {
                count++;
                if (count === 2) {
                    const timestampDate = new Date(messages[0].timestamp);
                    const currentDate = new Date();
                    expect(messages[0].id).toBeTruthy();
                    expect(timestampDate.getDate()).toBe(currentDate.getDate());
                    expect(messages[0].message).toBe('test message');
                    expect(messages[0].title).toBe('Test');
                    expect(messages[0].type).toBe(E2MessageType.ERROR);
                    done();
                }
            }
        });

        messageStore.addErrorMessage(appMessage);
        messageStore.dispatchMessages();
    });

});
