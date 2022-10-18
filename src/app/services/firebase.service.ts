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
  private _PATH: string = 'profile';

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

  deleteUser(profile: Profile) {
    return getAuth().currentUser.delete()
  }

  recoverPassword(profile : Profile){
    return this.auth.sendPasswordResetEmail(profile.email);
  }

  saveDetails(profile: Profile, userId) {
    return this.firestore.collection(this._PATH).doc(userId.uid).set({
      name: profile.name,
      email: profile.email,
      profileImageURL: profile.profileImageURL,
      lol: '',
      steamLink: ''
    })
  }

  editDetails(profile : Profile){
    return this.firestore
    .collection(this._PATH)
    .doc(getAuth().currentUser.uid)
    .update({name : profile.name,
      email : profile.email,
      steamLink: profile.steamLink,
      lol: profile.lol});
   };

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

  readUsers(data) {
    return this.firestore
    .collection(this._PATH, ref => ref.where("uid", "==", data.uid))
    .snapshotChanges();
  }  

  atualizarImagem(profile: Profile) {
    return this.firestore.collection(this._PATH).doc(getAuth().currentUser.uid).update({
      profileImageURL: profile.profileImageURL
    })
  }

  excluirImagem(profileImageURL: any) {
    return this.fireStorage.storage.refFromURL(profileImageURL).delete()
  }

  excluirPerfil(profile: Profile){
    this.excluirImagem(profile.profileImageURL)
    this.deleteUser(profile)
    return this.firestore.collection(this._PATH).doc(getAuth().currentUser.uid).delete()
  }

  excluirImagemStorage(profileImageURL : any){
    return this.fireStorage.storage.refFromURL(profileImageURL).delete();
  }

  excluirProfile(profile : Profile){
    let urlAntigo = profile.profileImageURL;
    this.excluirImagemStorage(urlAntigo);
    return this.firestore
    .collection(this._PATH)
    .doc(getAuth().currentUser.uid)
    .delete();
   };

  editarImagem(imagem:any, profile: Profile){
    const file = imagem.item(0)
    if(file.type.split('/')[0] !== 'image'){
      console.error("Tipo não suportado")
      return
    }
    const path = `images/${new Date().getTime()}_${file.name}`
    const fileRef = this.fireStorage.ref(path)
    let task = this.fireStorage.upload(path, file)
    task.snapshotChanges().pipe(
      finalize(() => {
        let uploadedFile = fileRef.getDownloadURL()
        uploadedFile.subscribe(resp => {
          profile.profileImageURL = resp
          this.editDetails(profile)
          this.atualizarImagem(profile)
        })
      })
    ).subscribe()
    return task
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
    }).catch((error) => {
        // An error happened.
        console.log(error);
      });
  }

}
