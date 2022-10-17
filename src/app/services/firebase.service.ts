import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Profile } from '../models/profile';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getAuth, signOut } from '@angular/fire/auth';
import { finalize } from 'rxjs/operators'



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _PATH: string = 'profile'

  constructor(
    public firestore: AngularFirestore,
    public fireStorage: AngularFireStorage,
    public auth: AngularFireAuth,
  ) { }

  loginWithEmail(profile: Profile) {
    return this.auth.signInWithEmailAndPassword(profile.email, profile.password)
  }

  signUp(profile: Profile) {
    return this.auth.createUserWithEmailAndPassword(profile.email, profile.password)
  }

  recoverPassword(profile : Profile){
    return this.auth.sendPasswordResetEmail(profile.email);
  }

  saveDetails(profile: Profile, userId) {
    return this.firestore.collection(this._PATH)
    .doc(userId.uid)
    .set({
      name: profile.name,
      email: profile.email,
      profileImageURL: profile.profileImageURL
    })
  }

  getDetails(data) {
    return this.firestore
    .collection(this._PATH)
    .doc(data.uid)
    .valueChanges()
  }

  getUsers(){
    return this.firestore
    .collection(this._PATH)
    .snapshotChanges();
  }

  enviarImagem(imagem: any, profile: Profile, userId) {
    const file = imagem.item(0)
    if(file.type.split('/')[0] !== 'image') {
      console.error('Tipo não suportado!')
      return
    }
    const path = `images/${new Date().getTime()}_${file.name}`
    const fileRef = this.fireStorage.ref(path)
    let task = this.fireStorage.upload(path, file)
    task.snapshotChanges().pipe(
      finalize(() => {
        let uploadedFileURL = fileRef.getDownloadURL()
        uploadedFileURL.subscribe((resp)=>{
          profile.profileImageURL = resp
          this.saveDetails(profile, userId)
        })
      })
    ).subscribe()
    return task
  }

  logout(){
    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
        // An error happened.
        console.log(error);
      });
  }
}
