import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Firestore, getFirestore, collection, getDocsFromServer, getDocs, setDoc, doc, getDoc, addDoc, query, where } from '@angular/fire/firestore';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup,GoogleAuthProvider,signInWithRedirect, getRedirectResult  } from '@angular/fire/auth';
import { IUser } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users/users.service';
import { Auth } from 'firebase/auth';
import { Route, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  auth!: Auth;
  error: string = ''
  Xsmall: boolean = false;
  Small: boolean = false;
  hidePass: boolean = true;
  provider = new GoogleAuthProvider();

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')])
  })

  userNameValid() {
    if(this.registerForm.hasError('required', 'username')) {
      return 'username required'
    }
    return
  }

  passwordValid() {
    if(this.registerForm.hasError('required', 'password')) {
      this.error = ''
      return 'password required'
    }

    if(this.registerForm.hasError('pattern', 'password')) {
      this.error = 'Password must be a combination of lower-case, upper-case, numbers and at least 9 characters long';
      // const loginSnackBarRef = this._snackBar.open(`${this.error}`, undefined, {
      //   duration: 8000,
      //   horizontalPosition: 'center',
      //   verticalPosition: 'top'
      // }) 
      return
    }

    this.error = ''
    return
  }

  emailValid() {
    if(this.registerForm.hasError('required', 'email')) {
      return 'email required'
    }

    if(this.registerForm.hasError('email', 'email')) {
      return 'invalid email';
    }
    return
  }


  constructor(private userService: UsersService, private firestore: Firestore, private router: Router, private responsive: BreakpointObserver, private _snackBar: MatSnackBar) {
    // const db = collection(this.firestore, 'users');
    const db = getFirestore();
    const users = collection(db, 'users');
    console.log(users);

    this.auth = getAuth(db.app);
    // try{
    //   connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
    //   connectFirestoreEmulator(db, 'localhost', 8080);
    // }catch(err){console.log(err)}



    // try {
    //   const user = signInWithEmailAndPassword(this.auth, 'ankohtreasure1@gmail.com', 'helloworld');
    //   user.then((data) => { console.log(data.user) })
    //   user.catch((err) => { console.log(err) })
    // }
    // catch (error) {
    //   console.log(error)
    // }


    // const result = setDoc(doc(users, "treasure-senior-programmer"), {
    //   name: "ankoh treasure", state: "CA", country: "cameroon",
    //   capital: false, population: 860000,
    //   regions: ["west_coast", "norcal"] 
    // });
    // result.then(() => {
    //   alert('completed successfully');
    // })
    // result.catch((err) => {
    //   alert(err);
    // })


    // addDoc(users, {
    //   name: 'ankoh treasure',
    //   age: 20,
    //   occupation: 'programmer'
    // }).then((result) => {
    //   console.log(result)
    // }).catch((err)=> {
    //   alert(err);
    // })





    const gotten = getDoc(doc(users));
    gotten.then((data) => {
      console.log(data);
    })
    gotten.catch((err)=> {
      console.log(err);
    })

    const q = query(users);

    getDocs(q)
      .catch((err) => { console.log(err) })
      .then((data) => {
        try {
          if(data)
          data.forEach((data) => { console.log(data.ref) })
        }
        catch (err) { console.log(err) }
      })
    // async () => {
    //   // const usersSnapshot = await getDocs(users);
    //   // console.log(usersSnapshot);

    //   console.log(result)
    // } 



    // console.log(getUsersSnapShot);
    // const db = getFirestore()


  }


  ngOnInit(): void {
    this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small])
    .subscribe(results=>{
      const breakPoints = results.breakpoints;

      if(breakPoints[Breakpoints.Small]) {
        console.log('matches Small screen')
        this.Small = true;
        this.Xsmall = false;
      }
      else if(breakPoints[Breakpoints.XSmall]) {
        console.log('matches Xsmall screen')
        this.Small = false;
        this.Xsmall = true
      }
      else {
        this.Small = true
        this.Xsmall = false
      }
    })

    onAuthStateChanged(this.auth, user => {
      if (user) {
        console.log('signed in successfully', user);
      }
      else {
        console.log('logged out');
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

  @Output() registerSuccess: EventEmitter<IUser> = new EventEmitter();

  // consumerForRegisterSuccess() {

  // }


  register(e: any) {

    if(this.registerForm.invalid){

      const loginSnackBarRef = this._snackBar.open(` not all fields match there requirements`, undefined, {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      return
    }

    if(this.registerForm.value.username && this.registerForm.value.email && this.registerForm.value.password) {
      const data = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      }
      const response = this.userService.register(this.auth, data);
      response.then((data) => {
        if (data.state) {
          const loginSnackBarRef = this._snackBar.open(`${this.registerForm.value.email} created successfully`, undefined, {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          })
          this.router.navigate(['dashboard', {
            user: data.user.user.uid
          }]);
          console.log(this.auth.currentUser)
  
          return
        }
        if (String(data.user as any).includes('auth/email-already-in-use')) {
          const loginSnackBarRef = this._snackBar.open(` user exists`, undefined, {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          })
          console.log(this.auth.currentUser)
          return
        }
  
        const loginSnackBarRef = this._snackBar.open(` failed to create user`, undefined, {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        console.log(String(data.user as any));
  
      })
    }
    

  }

  sideBarEnabled: boolean = false;
  userIn: boolean = false;

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

  generatePass() {
    let pass = ''
    let strAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let strNum = '0123456789';
    let strSmall = 'abcdefghijklmnopqrstuvwxyz' 
    
     for (let i = 1; i <= 5; i++) {
        var char = Math.floor(Math.random() * strAlpha.length + 1);
        pass += strAlpha.charAt(char)
        var char = Math.floor(Math.random() * strSmall.length + 1);
        pass += strSmall.charAt(char)
        var char = Math.floor(Math.random() * strNum.length + 1);
        pass += strNum.charAt(char)

      }

      console.log(pass)
      this.registerForm.patchValue({password: pass})
      return
  }

  googleSignin() {
    signInWithPopup(this.auth, this.provider)
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
      this.router.navigate(['dashboard', {
        user: user.uid
      }]);

    })
    .catch((error)=>{
      // handle errors here
      const errorCode = error.errorCode;
      const errorMessage = error.message;
      // email of the users account used
      const email = error.customData.email;
      //the authentication credential type that was used
      const credential = GoogleAuthProvider.credentialFromError(error);
    })
  }

  async googleSignInRedirect() {
    await signInWithRedirect(this.auth, this.provider);
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
      console.log(error)
      const errorMessage = error.message;
      //the email of the users account used
      const email = error.customData.email
      // the auth credential that was used
      const credential = GoogleAuthProvider.credentialFromError(error)
    })
  }


}
function connectFirestoreEmulator(db: Firestore, arg1: string, arg2: number) {
  throw new Error('Function not implemented.');
}

