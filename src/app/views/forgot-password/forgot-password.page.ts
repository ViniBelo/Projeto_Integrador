import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getAuth} from "firebase/auth";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  auth = getAuth();
  email : any;
  public formForgot : FormGroup;
  private _isSubmitted: boolean = false


  constructor(private _fb : FirebaseService,
    private _router : Router,
    private formBuilder: FormBuilder,
    private profile: FirebaseService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    ) { }

  ngOnInit() {
    this.formForgot = this.formBuilder.group({
      email: ['', [Validators.required]],
    })
  }

  async logout(){
    await this._fb.logout();
    this._router.navigate(['/loginscreen'])
  }

  submitForm() {
    this._isSubmitted = true
    if(!this.formForgot.valid) {
      this.presentAlert('Redefinir Senha', 'ERRO!', 'Preencha o campo de email!')
      return false
    } else{
      this.redefinirSenha()
    }
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

  redefinirSenha(){
    this.showLoading('Aguarde', 10000)
    this.profile.recoverPassword(this.formForgot.value)
    .then(() => {
      // Password reset email sent!
      // ..
      this.showLoading('Aguarde', 10)
      this.loadingCtrl.dismiss()
        this.presentAlert('Redefinir Senha', 'BEM-SUCEDIDO!', 'Verifique seu email!')
        this._router.navigate(['/loginscreen'])
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      this.loadingCtrl.dismiss()
          this.presentAlert('Cadastro', 'ERRO!', error)
          console.log(errorCode);
          console.log(errorMessage);
      // ..
    });
  }


}
