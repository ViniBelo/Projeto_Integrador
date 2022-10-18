import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FirebaseService } from './../../services/firebase.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { getAuth, updateCurrentUser } from 'firebase/auth'

@Component({
  selector: 'app-loginscreen',
  templateUrl: './loginscreen.page.html',
  styleUrls: ['./loginscreen.page.scss'],
})
export class LoginscreenPage implements OnInit {
  private _isSubmitted: boolean = false
  public formLogin: FormGroup

  constructor(
    private alertController: AlertController,
    private router: Router,
    private profile: FirebaseService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  goToSignUp() {
    this.router.navigate(['/signup'])
  }

  goToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }

  get errorControl() {
    return this.formLogin.controls
  }

  submitForm() {
    this._isSubmitted = true
    if(!this.formLogin.valid) {
      this.presentAlert('Login', 'ERRO!', 'Preencha todos os campos!')
      return false
    } else{
      this.login()
    }
  }

  login() {
    this.showLoading('Aguarde', 10000)
    this.profile.loginWithEmail(this.formLogin.value)
    .then(res => {
      if(res.user.uid) {
        this.profile.getDetails({uid:res.user.uid}).subscribe(res => {
          this.loadingCtrl.dismiss()
          this.presentAlert('Login', 'BEM-SUCEDIDO!', 'Seja bem-vindo!')
          this.router.navigate(['tabs/tabs/home'])
        }, err => {
          this.showLoading('Aguarde', 10000)
          this.loadingCtrl.dismiss()
          this.presentAlert('Login', 'ERRO!', err)
          console.log(err)
        })
      }
    })
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present()
  }

  async showLoading(mensagem: string, duracao: number) {
    const loading = await this.loadingCtrl.create({
      message: mensagem,
      duration: duracao,
    });

    loading.present();
  }
}
