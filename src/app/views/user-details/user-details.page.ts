import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from './../../services/firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {
  public profile: Profile;
  private _image: any
  private isSubmitted: boolean = false;
  private _edition: boolean = false;
  private _data: any;
  public formEdit: FormGroup;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    private angularFirestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.formEdit = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      profileImageURL: ['', [Validators.required]],
      lol: [''],
      steamLink: ['']
    })
    this.firebaseService.getDetails(getAuth().currentUser).subscribe(res => {
      this._data = res
      this.profile = this._data
      this.formEdit.controls['name'].setValue(this.profile.name)
      this.formEdit.controls['email'].setValue(this.profile.email)
      this.formEdit.controls['profileImageURL'].setValue(this.profile.profileImageURL)
      this.formEdit.controls['lol'].setValue(this.profile.lol)
      this.formEdit.controls['steamLink'].setValue(this.profile.steamLink)
    })
    
  }

  editar() {
    this.showLoading('Aguarde', 10000)
    
    if(this._image) {
      this.firebaseService.editarImagem(this._image,
        this.formEdit.value)
        .then(() => {
          
          this.firebaseService.excluirImagem(this.profile.profileImageURL)
          this.loadingCtrl.dismiss()
          this.presentAlert('Perfil', 'SUCESSO!', 'profile Editado!')
          this.router.navigate(['/tabs/tabs/home'])
        })
        .catch((error) => {
          this.loadingCtrl.dismiss()
          this.presentAlert('Perfil', 'ERRO!', 'Erro ao editar perfil!')
          console.log(error)
        })
    } else {
      this.firebaseService.editDetails(this.formEdit.value)
        .then(() => {
          this.loadingCtrl.dismiss()
          this.presentAlert('Perfil', 'SUCESSO!', 'profile Editado!')
          this.router.navigate(['/tabs/tabs/home'])
        })
        .catch((error) => {
          this.loadingCtrl.dismiss()
          this.presentAlert('Perfil', 'ERRO!', 'Erro ao editar profile!')
          console.log(error)
        })
    }
  }

  submitForm() {
    this.isSubmitted = true
    if(!this.formEdit.valid) {
      this.presentAlert('Perfil', 'ERRO!', 'Todos os campos são obrigatórios')
      return false
    } else{
      this.editar()
    }
  }

  excluir() {
    this.presentAlertConfirm(
      'Perfil',
      'Excluir contato',
      'Você realmente deseja excluir o contato?'
    )
  }

  private deleteProfile(profile: Profile) {
    this.firebaseService.excluirContato(profile)
    .then(() => {
      this.presentAlert('Perfil', 'Excluir', 'Exclusao realizada!')
      this.router.navigate(['/tabs/tabs/home'])
    })
    .catch((error) => {
      this.presentAlert('Perfil', 'Excluir', 'Contato não encontrado!')
      console.log(error)
    })
  }

  uploadFile(image: any) {
    this._image = image.files
  }

  async logout(){
    await this.firebaseService.logout();
    this.router.navigate(['/'])
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentAlertConfirm(
    header: string,
    subHeader: string,
    message: string
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.deleteProfile(this.profile);
          },
        },
      ],
    });

    await alert.present();
  }

  async showLoading(mensagem: string, duracao: number) {
    const loading = await this.loadingCtrl.create({
      message: mensagem,
      duration: duracao,
    });

    loading.present();
  }
}
