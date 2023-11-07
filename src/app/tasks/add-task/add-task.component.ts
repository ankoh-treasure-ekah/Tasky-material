import { Component } from '@angular/core';
import { TaskDifficult, TaskLevel, TaskStatus } from 'src/app/constants/constants.enum';
import { ITask } from 'src/app/interfaces/task.interface';
import { LocalStoreService } from 'src/app/services/store/local-store-service.service';
import { TasksService } from 'src/app/services/tasks.service';
import { onAuthStateChanged, Auth, getAuth } from '@angular/fire/auth'
import { getFirestore } from '@angular/fire/firestore'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent  {

  addTaskForm = new FormGroup({
    taskName: new FormControl('', [Validators.required, Validators.maxLength(14)]),
    taskDescription: new FormControl('', [Validators.required]),
    taskDueDate: new FormControl('', [Validators.required]),
    taskStartDate: new FormControl('', [Validators.required]),
    taskDifficulty: new FormControl('', [Validators.required])
  })

  taskDifficulty: string[] = [TaskDifficult.HIGH, TaskDifficult.MEDIUM, TaskDifficult.STANDARD];

  Xsmall: boolean = false
  Small: boolean = false

  taskNameValid() {
    if(this.addTaskForm.hasError('required', 'taskName')) {
      return 'field cannot be empty'
    }
    // if(this.addTaskForm.hasError('maxLength', 'taskName')) {
    //   return 'task name cannot be aboce nine characters'
    // }
    return
  }

  taskDecriptionValid() {
    if(this.addTaskForm.hasError('required', 'taskDescription')) {
      return 'field cannot be empty'
    }
    return
  }

  startDateValid() {
    if(this.addTaskForm.hasError('required', 'taskStartDate')) {
      return 'field cannot be empty'
    }
    return
  }

  dueDateValid() {
    if(this.addTaskForm.hasError('required', 'taskDueDate')) {
      return 'field cannot be empty'
    }
    return
  }

  taskDifficultyValid() {
    if(this.addTaskForm.hasError('required', 'taskDifficulty')) {
      return 'field cannot be empty'
    }
    return
  }

  auth!: Auth;
  uid: string = '';
  constructor(private taskService: TasksService, private _snackBar: MatSnackBar, private responsive: BreakpointObserver) {
    this.auth = getAuth(getFirestore().app)
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
      }

      else {
        this.Small = false
      }
    })

    onAuthStateChanged(this.auth, user =>{
      if(user) {
        console.log(user)
        this.uid = user.uid;
      }
      else {
        console.log('logged out')
      }
    }) 
  }

  task: ITask = {
    name: '',
    description: '',
    dueDate: '',
    startDate: '',
    level: TaskLevel.NOT_STARTED,
    difficulty: TaskDifficult.STANDARD,
    status: TaskStatus.PROCESSING,
    userId: '',
    id: 0
  }

  async saveTask() {
    if(this.addTaskForm.invalid) {
      const loginSnackBarRef = this._snackBar.open(` not all fields meet the requirements`, undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
    }

    this.task.name = this.addTaskForm.value.taskName as any;
    this.task.description = this.addTaskForm.value.taskDescription as any;
    this.task.dueDate = this.addTaskForm.value.taskDueDate as any;
    this.task.startDate = this.addTaskForm.value.taskStartDate as any;

    if (this.task.name.length < 5 || this.task.description.length < 20) {
      const loginSnackBarRef = this._snackBar.open(`Name or description has an invalid length `, undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      return
    }
    const response = await this.taskService.addTask(this.task, this.uid);

    if(response.state){
      const loginSnackBarRef = this._snackBar.open(` task created successfully`, undefined, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      return
    }
  }



}
