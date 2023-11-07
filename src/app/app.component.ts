import { Component } from '@angular/core';
import { IUser } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tasky';
  description = 'This is our great and Amazing Angular Project';
  role = 'admin';

  notifications: number = 0;

  getElements(data: IUser) {
    console.log('this created ', data)
    this.notifications += 1;
  }
 

}
