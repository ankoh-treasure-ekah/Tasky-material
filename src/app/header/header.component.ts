import { Component, Input, OnInit } from '@angular/core';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private responsive: BreakpointObserver) {}
  @Input() title:string = '';
  Small: boolean = false;
  Xsmall: boolean = false;

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
    console.log('this component has just been created');

    
  }

  changeableText: string[] = ['Creative', 'Innovative', 'Inspiring', 'Genius', 'Professional'];
  stringTo: string = '';


  // gradient = `linear-gradient(to right, rgba(0, 0, 255, 0.698), rgba(255, 0, 0, 0.777))`;
  
  // colors = ['red', 'green', 'yellow', 'blue', 'white'];

  stringChanger() {
    let myString: string = 'creative';
    
  }

  stringIncrement() {
    this.stringTo = 'hello';
  }

  // toggleColor(e: Event){
  //   // const randNum1 = Math.floor(Math.random() * this.colors.length);
  //   // const randNum2 = Math.floor(Math.random() * this.colors.length);
  //   // this.gradient = `linear-gradient(to right, ${this.colors[randNum1]}, ${this.colors[randNum2]})`
  //   const color1 = this.colorGenerator();
  //   const color2 = this.colorGenerator();
  //   const color3 = this.colorGenerator();

  //   this.gradient = `linear-gradient(to right, rgba(${color1}, ${color2}, ${color3}, 0.5), rgba(${color1}, ${color2}, ${color3}, 0.5))`
  // }

  // // colorGenerator(): string {
  // //   const color = Math.ceil(Math.random() * 1000000);
  // //   return `#${color}`;
  // // }
  // colorGenerator(): number {
  //   const color = Math.floor(Math.random() * 255);
  //   return color;
  // }

}
