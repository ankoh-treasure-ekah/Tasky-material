import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDifficult, TaskLevel, TaskStatus } from 'src/app/constants/constants.enum';
import { ITask } from 'src/app/interfaces/task.interface';
import { TasksService } from 'src/app/services/tasks.service';
import { UsersService } from 'src/app/services/users/users.service';
import {Auth, getAuth, onAuthStateChanged} from '@angular/fire/auth'
import {getFirestore} from '@angular/fire/firestore'
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit{

  auth!: Auth;
  uId: string = '';

  spinner: boolean = true;
  tasksPresent: boolean = false;

  pageIndex = 0;
  pageSize = 5;

  constructor(private route: Router ,private taskService: TasksService, private activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef, private usersService: UsersService, private _snackBar: MatSnackBar) {

    this.auth = getAuth(getFirestore().app);

    onAuthStateChanged(this.auth, user =>{
      if(user){
        this.uId = user.uid;
      }
    })

    this.activatedRoute.params.subscribe((params) => {
      console.log(params);

      // console.log(task);
    })

  }

  currentTask!: number;

  @Input() username: string = '';
  @Input() password: string = '';

  canUndo: boolean = false;

  canDelete: boolean = false;

  tasksDisplayed: ITask[] = [];

  @Input() tasks: ITask[] = [
    // {
    //   name: "Teach Javascript",
    //   description: 'js master class',
    //   userId: '1',
    //   status: TaskStatus.PAUSED,
    //   startDate: new Date(Date.now()),
    //   dueDate: new Date("12/04/2023"),
    //   level: TaskLevel.PROGRESS,
    //   difficulty: TaskDifficult.MEDIUM
    // },
    // {
    //   name: "Teach Angular",
    //   description: 'Angular master class',
    //   userId: '2',
    //   status: TaskStatus.SUCCESS,
    //   startDate: new Date(Date.now()),
    //   dueDate: new Date("12/04/2023"),
    //   level: TaskLevel.PROGRESS,
    //   difficulty: TaskDifficult.HIGH
    // }
  ]

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    // this.tasksDisplayed = this.tasks.slice(((this.pageIndex + 1)*this.pageSize)-5, (this.pageIndex+1)*this.pageSize );
    this.tasksDisplayed = [...this.tasks.slice(((this.pageIndex + 1)*this.pageSize)-this.pageSize, (this.pageIndex+1)*this.pageSize )];
    console.log((this.pageIndex+1)*this.pageSize + 1)
    console.log(this.tasksDisplayed.length)
    console.log(e);
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async (data) => {
      console.log(data);
      if(data['id']) {
        const Tasks = await this.taskService.getTasks(this.uId)
        .then(async(dataH)=>{
          if(dataH.status) {
            console.log(dataH)
            
      
            for(let dataHere in dataH.results) {
              let {[dataHere]: identifier} = dataH.results
              if(identifier.id == data['id']) {
                console.log(dataHere, identifier)

                const updated = await this.taskService.deleteTask(dataHere, this.uId, identifier)
                .then(async(data)=>{
                  if(data.status) {
                    this.canUndo = true;
                    const loginSnackBarRef = this._snackBar.open(`task deleted successfully`, undefined, {
                      duration: 2000,
                      horizontalPosition: 'center',
                      verticalPosition: 'top'
                    })
                    let allTasks = await this.taskService.getTasks(this.uId)
                    .then((data)=>{
                      if(data.status){
                        this.tasks = [];
                        for(let dataHere in data.results) {
                          // console.log(dataHere)
                          let {[dataHere]: identifier} = data.results
                          console.log(identifier)
                          this.tasks = [...this.tasks, identifier]
                        }
                        
                        this.tasksPresent = true;
                        console.log(data.results);
                      }
                    })
                    return
                  }
                  const loginSnackBarRef = this._snackBar.open(` failed to delete task`, undefined, {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  })
                  return
                })
                return
              }
            }
    
          }

        })

      }

    })
    let allTasks = await this.taskService.getTasks(this.uId)
    .then((data)=>{
      if(data.status){
        for(let dataHere in data.results) {
          // console.log(dataHere)
          let {[dataHere]: identifier} = data.results
          console.log(identifier)
          this.tasks = [...this.tasks, identifier]
        }
        this.spinner = false;
        this.tasksPresent = true;
        this.tasksDisplayed = this.tasks.slice(this.pageIndex, this.pageSize)
        console.log(data.results);
      }
    })
    console.log(this.tasks)
  }

  editTask(task: ITask) {
    this.currentTask = task.id;

    this.route.navigate(['/dashboard/task-detail', {
      taskId:this.currentTask,
      uId: this.uId
    }])
    
  }

  async unDo() {
    const response = await this.taskService.unDo(this.uId)
    .then(async(data)=>{
      if(data.status) {
        
        let allTasks = await this.taskService.getTasks(this.uId)
        .then((data)=>{
          if(data.status){
            this.tasks = [];
            for(let dataHere in data.results) {

              let {[dataHere]: identifier} = data.results
              console.log(identifier)
              this.tasks = [...this.tasks, identifier]
            }
            const loginSnackBarRef = this._snackBar.open(`task recovered successfully`, undefined, {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            })
            this.canUndo = false;
          }
        })

      }
    })

  }


}
