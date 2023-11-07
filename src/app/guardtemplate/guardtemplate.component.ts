import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
@Component({
  selector: 'app-guardtemplate',
  templateUrl: './guardtemplate.component.html',
  styleUrls: ['./guardtemplate.component.scss']
})
export class GuardtemplateComponent implements OnInit {

  auth!: Auth;

  constructor() {

    
  }
  ngOnInit(): void {
    
  }

}
