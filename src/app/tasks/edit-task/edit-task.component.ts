import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent {

  constructor(private activatedRoute: ActivatedRoute){
    this.activatedRoute.params.subscribe((data) => {
      console.log(data);
    })
  };





}
