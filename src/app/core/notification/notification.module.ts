import {NgModule} from '@angular/core';
import {SnackbarModule} from '../snackbar';

@NgModule({
    imports: [
        SnackbarModule],
    providers: [],
    exports: []
})
export class NotificationModule {
    constructor() {
    }
}
