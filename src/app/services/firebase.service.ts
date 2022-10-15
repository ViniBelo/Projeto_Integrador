import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Profile } from '../models/profile';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';



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
    return this.firestore.collection(this._PATH).doc(userId.uid).set({
      name: profile.name,
      email: profile.email
    })
  }

  getDetails(data) {
    return this.firestore.collection(this._PATH).doc(data.uid).valueChanges()
  }

  getUsers(){
    return this.firestore
    .collection(this._PATH)
    .snapshotChanges();
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
