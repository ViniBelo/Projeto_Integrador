import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Profile } from 'src/app/models/profile';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  profiles: Profile[];
  auth = getAuth();

  constructor(private _router: Router, private profileFS: FirebaseService) {
    this.carregarUsers();
  }

  ngOnInit() {}

  carregarUsers() {
    this.profileFS.getUsers().subscribe((res) => {
      this.profiles = res.map((p) => {
        //if (p.payload.doc.id === getAuth().currentUser.uid)
          return {
            id: p.payload.doc.id,
            ...(p.payload.doc.data() as Profile),
          } as unknown as Profile;
      });
    });
  }

  doRefresh(event) {
    this.carregarUsers();
    
    setTimeout(() => {
      event.target.complete();
    }, 5);
  }

}
