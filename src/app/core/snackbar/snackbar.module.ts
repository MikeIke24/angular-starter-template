import {NgModule, ModuleWithProviders} from '@angular/core';
import {SnackbarService} from './snackbar.service';
import {MatSnackBarModule} from '@angular/material';

@NgModule({
    imports: [MatSnackBarModule]
})
export class SnackbarModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SnackbarModule,
            providers: [SnackbarService]
        };
    }
}
