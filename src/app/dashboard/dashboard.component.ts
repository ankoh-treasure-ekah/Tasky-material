import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UsersService } from '../services/users/users.service';
import {Auth, getAuth, connectAuthEmulator} from '@angular/fire/auth'
import {getFirestore} from '@angular/fire/firestore'
import { AuthserviceService } from '../services/authservice.service';
import { AuthguardService } from '../services/authguard.service';
import { onAuthStateChanged } from 'firebase/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  email: string = '';
  password: string = '';
  userIn: boolean = false;

  auth!: Auth;

  Xsmall: boolean = false
  Small: boolean = false

  userImg: string = ''; 

  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService, private  route: Router, private authService: AuthserviceService, private responsive: BreakpointObserver){
    this.activatedRoute.params.subscribe((data) => {
      if(data) {
        console.log(data);
        this.userIn = true;
        // const user = this.userService.getUser(<unknown>data['id'] as number);
        // console.log(user);
        // this.email = user['username'];
        // this.password = user['password'];
      }
      else {
        throw new Error('something happened and the user information could not be retrieved')
        
      }
    })
    
  }
  
  ngOnInit(): void {
    this.auth = getAuth(getFirestore().app);
    // connectAuthEmulator(this.auth, 'http://localhost:9099');

    this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small])
    .subscribe(results=>{
      const breakPoints = results.breakpoints;

      if(breakPoints[Breakpoints.Small]) {
        console.log('matches Small screen')
        this.Small = true
      }
      if(breakPoints[Breakpoints.XSmall]) {
        console.log('matches Xsmall screen')
        this.Small = true
      }

      else {
        this.Small = false
      }
    })


    onAuthStateChanged(this.auth, user => {
        if (user) {
          console.log('signed in successfully', user.email);
          this.email = user.email as any;
          
          if(user.photoURL) {
            this.userImg = user.photoURL
          }
  
        }
        else {
          console.log('logged out');
        }
    })
    

    let currentUser = this.auth.currentUser;
    if(currentUser) {
      this.authService.setIsauthenticated(true)
      console.log(this.auth.currentUser)
    }

    this.userIn = true;
  }

  viewTask() {
    this.route.navigate(['/dashboard/tasks'])
  }


  sideBarEnabled: boolean = false;

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
