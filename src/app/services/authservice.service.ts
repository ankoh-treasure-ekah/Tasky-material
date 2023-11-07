import { Injectable, OnInit } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthserviceService implements OnInit {

  auth!: Auth;
  constructor() { }

  ngOnInit(): void {
    this.auth = getAuth(getFirestore().app)
    
    if(this.auth.currentUser) {
      this.setIsauthenticated(true);
    }
    
  }

  private isAuthenticated!: boolean;

  getIsRouteActivated(): boolean {
    return this.isAuthenticated;
  }

  setIsauthenticated(isAuth: boolean): void {
    this.isAuthenticated = isAuth;
  }

}
