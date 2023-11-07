import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users/users.service';
import {Auth, getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult} from '@angular/fire/auth'
import {getFirestore} from '@angular/fire/firestore'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  registerForm = new FormGroup({
    emailValu: new FormControl('', [Validators.required, Validators.email]),
    passwordValu: new FormControl('', [Validators.required])
  })

  error: string = ''

  auth!: Auth;
  Xsmall: boolean = false;
  Small: boolean = false;
  hidePass: boolean = true;
  provider = new GoogleAuthProvider();
  
  loader: boolean = false;

  getErrorMessage() {
    if (this.registerForm.hasError('required', 'emailValu')) {
      // console.log(this)
      return 'You must enter a value';
    }
    return this.registerForm.hasError('email', 'emailValu') ? 'Not a valid email' : '';
  }

  getPassErroMessage() {
    if(this.registerForm.hasError('required', 'passwordValu')) {
      this.error = ''
      return 'You must enter a value';
    }


    return
  }

  constructor(private service: UsersService, private router: Router, private cdr: ChangeDetectorRef, private responsive: BreakpointObserver, private _snackBar: MatSnackBar){
    this.auth = getAuth(getFirestore().app);
    // try {

    //   connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');

    // }
    // catch(err) {
    //   console.log(err);
    // }
  }

  ngOnInit(): void {
    this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small])
    .subscribe(results=>{
      const breakPoints = results.breakpoints;

      if(breakPoints[Breakpoints.Small]) {
        console.log('matches Small screen')
        this.Xsmall = false;
        this.Small = true;
      }
      else if(breakPoints[Breakpoints.XSmall]) {
        console.log('matches Xsmall screen')
        this.Small = false;
        this.Xsmall = true;
      }
      else {
        this.Small = false
        this.Xsmall = false
      }
    })

    getRedirectResult(this.auth)
    .then((result)=>{
      console.log(result)
      //gives you a google access token which you can use to access the google api
      const credential = GoogleAuthProvider.credentialFromResult(result as any);
      const token = credential?.accessToken;

      //the signed in user info
      const user = result?.user;
      console.log(user)

      const loginSnackBarRef = this._snackBar.open(`${user?.email} signed in successfully`, undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      this.router.navigate(['dashboard', {
        user: user?.uid
      }]);

    })
    .catch((error)=>{
      //handle errors

      const errorCode = error.errorCode;
      console.log(error.message)
      if(error.message.includes('Cannot destructure property')) {
        return
      }
      const errorMessage = error.message;
      //the email of the users account used
      const email = error.customData.email
      // the auth credential that was used
      const credential = GoogleAuthProvider.credentialFromError(error)
    })

    


  }

  email = '';
  password = '';
  userIn: boolean = false;

  sideBarEnabled: boolean = false;


  async login(e: any) {

    if(this.registerForm.invalid) {
      const loginSnackBarRef = this._snackBar.open(` not all fields match there requirements`, undefined, {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      return
    }

    if(this.registerForm.value.emailValu && this.registerForm.value.passwordValu) {

      const response = await this.service.login(this.auth, {
        email: this.registerForm.value.emailValu,
        password: this.registerForm.value.passwordValu
      })
  
      if(response.success) {
        const loginSnackBarRef = this._snackBar.open(`${this.registerForm.value.emailValu} user logged in successfully`, undefined, {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        console.log((response as any).user)
  
        this.router.navigate(["dashboard", {
              id: (response as any).user.user.uid
            }]);
        return
      }

  
      if(String((response as any).err).includes('auth/invalid-email') ||
        String((response as any).err).includes('auth/wrong-password')) {
  
        console.log('user does not exist', (response as any).err);
        const loginSnackBarRef = this._snackBar.open(`email or password incorrect`, undefined, {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        return
      }

      if(String((response as any).err).includes('auth/network-request-failed')) {
        const loginSnackBarRef = this._snackBar.open(`connection error. check your network`, undefined, {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        return
      }

    }

  

    

  }

  sideNavToggle(e: boolean, drawer: MatSidenav) {
    if(e) {
      console.log(drawer);
      this.sideBarEnabled = true;
      drawer.toggle()
    }
  }

  sideBarGone(drawer: MatSidenav) {
    this.sideBarEnabled = false;
    drawer.toggle()
  }

  async googleSignin() {
    this.loader = true
    await signInWithPopup(this.auth, this.provider)
    .then((result)=>{
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // the signedin user info
      const user = result.user;
      console.log(user)

      const loginSnackBarRef = this._snackBar.open(`${user.email} signed in successfully`, undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      this.loader = false
      this.router.navigate(['dashboard', {
        user: user.uid
      }]);

    })
    .catch((error)=>{
      // handle errors here
      const errorCode = error.errorCode;
      const errorMessage = error.message;
      console.log(error)
      if(String(errorMessage).includes('auth/internal-error')) {
        const loginSnackBarRef = this._snackBar.open(`${errorMessage} check your network`, undefined, {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        this.loader = false
        return
      }
      // email of the users account used
      const email = error.customData.email;
      //the authentication credential type that was used
      const credential = GoogleAuthProvider.credentialFromError(error);
    })
  }

  async googleSignInRedirect() {
    this.loader = true;
    await signInWithRedirect(this.auth, this.provider).catch((error)=>{
      console.log(error)
      if(String(error.message).includes('auth/network-request-failed')) {
        const loginSnackBarRef = this._snackBar.open(`connection error. check your network`, undefined, {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        this.loader = false;
        return
      }
    });
    getRedirectResult(this.auth)
    .then((result)=>{
      console.log(result)
      // if(result == null) {return}
      //gives you a google access token which you can use to access the google api
      const credential = GoogleAuthProvider.credentialFromResult(result as any);
      const token = credential?.accessToken;

      //the signed in user info
      const user = result?.user;
      console.log(user)

      const loginSnackBarRef = this._snackBar.open(`${user?.email} signed in successfully`, undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      this.loader = false;
      this.router.navigate(['dashboard', {
        user: user?.uid
      }]);

    })
    .catch((error)=>{
      //handle errors

      const errorCode = error.errorCode;
      console.log(error)
      const errorMessage = error.message;
      this.loader = false;
      //the email of the users account used
      // the auth credential that was used
      // const credential = GoogleAuthProvider.credentialFromError(error)

    })
  }

}

