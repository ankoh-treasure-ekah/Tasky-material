import { Injectable } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { LocalStoreService } from '../store/local-store-service.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private storeService: LocalStoreService, private router: Router, private authService:AuthserviceService) { }

  observer = new Subject();
  public subscribers = this.observer.asObservable();

  async login(auth:Auth, userData: Omit<IUser, 'username'>): Promise<{success: boolean, user: UserCredential} | {success: boolean, err: any}> {
    console.log(typeof(userData.email) , typeof(userData.password) )


    const user = await signInWithEmailAndPassword(auth, userData.email, userData.password)
    .then((user)=>{this.authService.setIsauthenticated(true); return {success: true, user: user}})
    .catch((err)=>{ return {success: false, err: err}})

    return user
  }

  logout() {
    this.authService.setIsauthenticated(false);
    this.router.navigate(['/']);
  }

  async register(auth: Auth,userData: IUser) {
    // const response = this.storeService.set('users', userData);
    // if (response) {
    //   return {
    //     success: true
    //   }
    // }
    // return {
    //   success: false
    // }
    console.log(userData)
    let response = await
    this.storeService.createUser(auth, userData)
    .then((data)=>{
      console.log(data);
      // response = data;
      return data
    })
    
    // console.log(response.user)
    return response


    // if(user)

    // if(user) {

    // }
    // if(response.state) {
    //   return {success: true}
    // }
    // return {success: false}
  }

  getUser(userId: number) {
    const response = this.storeService.get('users');
    if(response.status) {
      const User = response.data[userId];
      return User;
    }
  }
  
}
