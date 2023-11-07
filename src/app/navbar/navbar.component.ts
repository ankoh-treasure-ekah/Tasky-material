import { ImplicitReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UsersService } from '../services/users/users.service';
import { IUser } from '../interfaces/user.interface';
import { Auth, getAuth, connectAuthEmulator, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { UserprofileComponent } from '../userprofile/userprofile.component';


// import {}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private service: UsersService, private responsive: BreakpointObserver, private dialog: MatDialog){
    this.auth = getAuth(getFirestore().app)
    // try{
    //   connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
    // }
    // catch(err){console.log(err)}
  };

  notifications: number = 0;

  @Input() userIn: boolean = false;

  @Input() userName = '';

  auth!: Auth;

  navLinks: boolean = true;

  @Input() sideNavEnabled: boolean = false;

  @Output()sideNav = new EventEmitter<boolean>();

  Xsmall: boolean = false
  Small: boolean = false

  @Input() userImg: string = '';

  ngOnInit(): void {
    this.responsive.observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.XSmall] )
      .subscribe(result => {

        const breakPoints = result.breakpoints;

        if(breakPoints[Breakpoints.Medium]) {
          console.log("screens matches medium");
          this.navLinks = true;
          // this.Xsmall = false
          this.Small = false
        }
        else if (breakPoints[Breakpoints.Small]) {
          console.log("screens matches small");
          this.navLinks = false;
          // this.Xsmall = false
          this.Small = false
          
        }

        else if(breakPoints[Breakpoints.XSmall]) {
          this.navLinks = false;
          this.Small = true
          console.log("screen matches xsmall")
        }

        else {
          this.navLinks = true;
          this.Small = false
        }


    });

    onAuthStateChanged(this.auth, user => {
      if (user) {
        console.log('signed in successfully', user.email);
        this.userIn = true;
        this.userName = user.email as any;

      }
      else {
        console.log('logged out');
      }
  })
    

    this.service.observer.subscribe((data) => {
      console.log((data as any).username);
      ++this.notifications;

      this.userName = (data as any).username

      this.userIn = !this.userIn;
    })
  }

  display = false;

  

  logInUser(e: any) {
    console.log(e);
  }

  async logout(e: any) {
    this.userIn = !this.userIn;
    await signOut(this.auth);
    this.service.logout();
  }

  openDrawer() {
    // this.sideNavEnabled = true;
    this.sideNav.emit(true);
  }

  openuserDialog() {
    let dialogRef = this.dialog.open(UserprofileComponent, {
      width: '30%',
      data: {
        notifications: this.notifications,
        userImg: this.userImg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });

  }

}
