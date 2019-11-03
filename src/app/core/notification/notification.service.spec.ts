import {TestBed} from '@angular/core/testing';

import {NotificationService} from './notification.service';
import {NotificationModule} from './notification.module';

describe('NotificationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NotificationModule],
        });
    });

    it('should be created', () => {
        const service: NotificationService = TestBed.get(NotificationService);
        expect(service).toBeTruthy();
    });
});
