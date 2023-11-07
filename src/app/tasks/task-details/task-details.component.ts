import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ITask } from 'src/app/interfaces/task.interface';
import { TasksService } from 'src/app/services/tasks.service';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth'
import { getFirestore } from '@angular/fire/firestore'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  auth!: Auth;
  userId: string = '';

  tasksPresent: boolean = false;

  observer = new Subject();
  public subscribers = this.observer.asObservable();


  task!: ITask;
  taskId!: number;

  username: string = '';
  userIn: boolean = false;

  constructor(private route: Router ,private activatedRoute: ActivatedRoute, private taskService: TasksService, private responsive: BreakpointObserver){
    this.auth = getAuth(getFirestore().app)
    onAuthStateChanged(this.auth, user =>{
      if(user) {
        this.userId = user.uid;
      }
    })

    this.activatedRoute.params.subscribe(async (data) => {
      console.log(data['uId'])
      this.taskId = data['taskId'];
      const response = await this.taskService.getTasks(data['uId'])
      .then((dataH)=>{
        for(let dataHere in dataH.results) {
          let {[dataHere]: identifier} = dataH.results
          if(identifier.id == data['taskId']) {
            this.task = identifier;
            this.tasksPresent = true;
            return
          }
        }
      })
      

    })
  }

  Small: boolean = false
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
  }

  deleteTask(e: any) {

    this.route.navigate(['/dashboard/tasks', {
        id: this.taskId
      }
    ])

  } 


}
