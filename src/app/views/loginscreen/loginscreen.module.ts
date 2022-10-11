import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { LoginscreenPageRoutingModule } from './loginscreen-routing.module'

import { LoginscreenPage } from './loginscreen.page'
import { BrMaskerModule } from 'br-mask'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BrMaskerModule,
    LoginscreenPageRoutingModule
  ],
  declarations: [LoginscreenPage]
})
export class LoginscreenPageModule {}
