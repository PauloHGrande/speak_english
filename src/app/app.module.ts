import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ModulesMenuComponent } from './modules-menu/modules-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    AvatarComponent,
    ModulesMenuComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
