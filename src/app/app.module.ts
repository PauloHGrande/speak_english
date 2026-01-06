import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ModulesMenuComponent } from './modules-menu/modules-menu.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SessionHistoryComponent } from './session-history/session-history.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    AvatarComponent,
    ModulesMenuComponent,
    LoginComponent,
    HomeComponent,
    SessionHistoryComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
