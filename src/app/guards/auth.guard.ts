import { FirebaseService } from './../services/firebase.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(res => {
      this.firebaseService.auth.onAuthStateChanged(user => {
        if(!user) {
          this.router.navigate(['/'])
        }
        res(user ? true : false)
      })
    });
  }
  
}
