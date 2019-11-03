import {Injectable} from '@angular/core';
import {SnackbarService} from '../snackbar';
import {MatSnackBarRef, SimpleSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // private readonly DEFAULT_TOASTR_CONFIG: Partial<IndividualConfig> = {
  //     closeButton: true,
  //     progressBar: true,
  //     timeOut: 2000,
  //     extendedTimeOut: 1000,
  //     toastClass: 'notification-toast toast',
  //     positionClass: 'toast-bottom-left'
  // };

  constructor(private snackbar: SnackbarService) {
  }

  snackbarSuccess(message = '', title = 'Success!'): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.success(message, title);
  }

  // success(message = '', title = 'Success!', config: Partial<IndividualConfig> = this.DEFAULT_TOASTR_CONFIG): ActiveToast<any> {
  //     return this.toastr.success(message, title, {...this.DEFAULT_TOASTR_CONFIG, ...config});
  // }
  //
  // info(message = '', title = 'Info!', config: Partial<IndividualConfig> = this.DEFAULT_TOASTR_CONFIG): ActiveToast<any> {
  //     return this.toastr.info(message, title, {...this.DEFAULT_TOASTR_CONFIG, ...config});
  // }
  //
  // warning(message = '', title = 'Warning!', config: Partial<IndividualConfig> = this.DEFAULT_TOASTR_CONFIG): ActiveToast<any> {
  //     return this.toastr.warning(message, title, {...this.DEFAULT_TOASTR_CONFIG, ...config});
  // }
  //
  error(message = '', title = 'Error!'): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.error(message, title);
  }

  //
  // errorFromError(error: Error, config: Partial<IndividualConfig> = this.DEFAULT_TOASTR_CONFIG): ActiveToast<any> {
  //     return this.toastr.error(error.message, error.name, {...this.DEFAULT_TOASTR_CONFIG, ...config});
  // }
  //
  // clearAll() {
  //     this.toastr.toasts.forEach(toast => this.toastr.clear(toast.toastId));
  // }

}
