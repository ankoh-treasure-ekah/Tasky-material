import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, connectAuthEmulator, onAuthStateChanged } from '@angular/fire/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  email: string = '';
  password: string = '';
  userIn: boolean = false;

  auth!: Auth;

  sideBarEnabled: boolean = false;

  Small: boolean = false;
  
  constructor(private firestore: Firestore, private responsive: BreakpointObserver) {
    this.auth = getAuth(getFirestore().app);
    let db = getFirestore();
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // try{
    //   connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
    // }
    // catch(err){console.log(err)}
  }

  ngOnInit(): void {
    this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small])
    .subscribe(results=>{
      const breakPoints = results.breakpoints;

      if(breakPoints[Breakpoints.Small]) {
        console.log('matches Small screen')
        this.Small = true;
      }
      else if(breakPoints[Breakpoints.XSmall]) {
        console.log('matches Xsmall screen')
        this.Small = true;
      }

      else {
        this.Small = false
      }

    })

    onAuthStateChanged(this.auth, user => {
        if (user) {
          console.log('signed in successfully', user.email);
          this.email = user.email as any;
  
        }
        else {
          console.log('logged out');
        }
    })
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

}
