import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FirebaseService } from 'src/app/services/firebase.service'
import { Profile } from 'src/app/models/profile'
import { getAuth, onAuthStateChanged } from "firebase/auth"

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  profiles : Profile[];
  auth = getAuth();

  constructor(private _router : Router, private profileFS: FirebaseService) {
    this.carregarUsers();
   }

  ngOnInit() {
  }

  carregarUsers(){
    this.profileFS.getUsers().subscribe(res=>{
      this.profiles = res.map( p =>{
        return{
          id: p.payload.doc.id,
          ...p.payload.doc.data() as Profile
        } as unknown as Profile;
      })
    })
  }

  checksession(){
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);
        // ...
      } else {
        // User is signed out
        // ...
        alert("You're not logged in")
        this._router.navigate(['/loginscreen'])
      }
    });
  }

  async logout(){
    await this.profileFS.logout();
    this._router.navigate(['/login'])
  }

}