import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { LoginComponent } from './login.component';
import { routing } from './login.routes';
import { SiteModule } from '../../site.module';

@NgModule({
  imports: [CommonModule, SiteModule, CardModule, MessageModule, routing],
  declarations: [LoginComponent],
  providers: [],
  exports: [],
  entryComponents: [],
})
export class LoginModule {}
