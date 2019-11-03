import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AppMaterialModule} from './app-material/app-material.module';
import {Fa5Module} from './fa5/fa5.module';

import {NotificationModule} from './notification/notification.module';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FlexLayoutModule,
    RouterModule,
    HttpClientModule,
    FontAwesomeModule,
    Fa5Module,
    NotificationModule
  ],
  declarations: [
    SplashScreenComponent
  ],
  exports: [
    RouterModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    Fa5Module,
    NotificationModule,
    SplashScreenComponent,
    AppMaterialModule]
})
export class CoreModule {
}
