import { FirebaseService } from './../../services/firebase.service';
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AlertController, LoadingController } from '@ionic/angular'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  private _date: string
  private _isSubmited: boolean = false
  private _image: any
  public formSignUp: FormGroup

  constructor(
    private alertController: AlertController,
    private router: Router,
    private profile: FirebaseService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this._date = new Date().toISOString()
    this.formSignUp = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      image: ['', [Validators.required]]
    })
  }

  uploadFile(image: any) {
    this._image = image.files
  }

  get errorControl() {
    return this.formSignUp.controls
  }

  submitForm() {
    this._isSubmited = true
    if(!this.formSignUp.valid) {
      this.presentAlert('Cadastro', 'ERRO!', 'Preencha os campos obrigatórios!')
      return false
    } else{
      this.signUp()
    }
  }

  private signUp() {
    this.showLoading('Aguarde', 10000)
    this.profile.signUp(this.formSignUp.value)
    .then(res => {
      if(res.user.uid){
        this.profile.enviarImagem(this._image, this.formSignUp.value, {uid:res.user.uid})
        .then(res => {
          this.showLoading('Aguarde', 10)
          this.loadingCtrl.dismiss()
          this.presentAlert('Cadastro', 'BEM-SUCEDIDO!', 'Cadastro realizado com sucesso!')
          this.router.navigate(['/loginscreen'])
        }).catch((err) => {
          this.showLoading('Aguarde', 10)
          this.loadingCtrl.dismiss()
          this.presentAlert('Cadastro', 'ERRO!', err)
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
