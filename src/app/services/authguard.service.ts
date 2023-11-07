import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { AuthserviceService } from './authservice.service';
import { Observable } from 'rxjs';
import { Auth, getAuth, connectAuthEmulator, onAuthStateChanged } from '@angular/fire/auth';
import { getFirestore, Firestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {
  
  auth!: Auth;
  constructor(private authservice: AuthserviceService, private router: Router, private firestore: Firestore) {
    this.auth = getAuth(getFirestore().app);
    // try{
    //   connectAuthEmulator(this.auth, 'http://localhost:9099');

    // }
    // catch(error) {
    //   console.log(error)
    // }

   }

   async emulatorReady(){
    let response = await fetch('http://172.0.0.1:9099');
    return response;
   }

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('guarded');
    console.log(this.auth.currentUser)

    return new Promise((resolve, reject)=>{
      onAuthStateChanged(this.auth, user => {
          if (user) {
            console.log('signed in successfully', user);
            this.authservice.setIsauthenticated(true);
            resolve(true);
            // return true;
    
          }
          else {
            console.log('logged out');
            this.authservice.setIsauthenticated(false);
            this.router.navigate(['login']);
            resolve(false);
            // return false
          }
        })
    })

  }
}
