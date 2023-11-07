import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../services/users/users.service';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit,OnChanges {

  constructor(private responsive: BreakpointObserver) {}

  Small: boolean = false;
  Xsmall: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('onchanges Method not implemented.');
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
        this.Small = true;
        this.Xsmall = true;
      }

      else {
        this.Small = false
      }

    })
  }

  
}
