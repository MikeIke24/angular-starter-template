import {inject, TestBed} from '@angular/core/testing';
import {SnackbarService} from './snackbar.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material';

describe('SnackbarService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SnackbarService, MatSnackBar],
            imports: [MatSnackBarModule]
        });
    });

    it('should be created', inject([SnackbarService], (service: SnackbarService) => {
        expect(service).toBeTruthy();
    }));
});
