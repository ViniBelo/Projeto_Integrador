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
  private _profile: Profile;
  private isSubmitted: boolean = false;
  private _edition: boolean = false;
  private _data;
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
      name: ['name', [Validators.required]],
      email: ['email', [Validators.required]],
    })
  }

  showEmail() {
    return getAuth().currentUser.email;
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

  async showLoading(mensagem: string, duracao: number) {
    const loading = await this.loadingCtrl.create({
      message: mensagem,
      duration: duracao,
    });

    loading.present();
  }
}
