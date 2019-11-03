import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';

export enum SnackbarMessageType {
  ERROR = 'snackbar-error',
  WARN = 'snackbar-warn',
  INFO = 'snackbar-info',
  SUCCESS = 'snackbar-success'
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  success(message: string, action: string, duration = 5000000) {
    return this.open(message, action, duration, SnackbarMessageType.SUCCESS);
  }

  error(message: string, action: string, duration = 5000000) {
    return this.open(message, action, duration, SnackbarMessageType.ERROR);
  }


  open(message: string, action: string, duration?: number, theme?: SnackbarMessageType): MatSnackBarRef<SimpleSnackBar> {
    console.log(theme);
    return this.snackBar.open(message, action, {
      duration,
      panelClass: [theme]
    });
  }
}
