import { Injectable } from '@angular/core';
import { LocalStoreService } from './store/local-store-service.service';
import { ITask } from '../interfaces/task.interface';
import { TaskDetailsComponent } from '../tasks/task-details/task-details.component';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TasksService {


  constructor(private store: LocalStoreService) {
    
    
  };

  observer = new Subject();
  public subscribers = this.observer.asObservable();

  // add task
  async addTask(task:ITask, uid: string) {

    const response = await this.store.setFireStore('Tasks', uid, task)
    .then((data)=>{
      return data;
    })
    
    return response;

  }

  //edit
  editTask() {}

  //delete
  async deleteTask(task: string, uId: string, data: any) {
    console.log(task, uId);
    this.store.sessionStorage('recover', data);
    const response = await this.store.deleteItemFirestore('Tasks', uId, task)
    .then((data)=>{
      return data
    })

    return response;
    
  }

  async unDo(uId: string) {
    const response = this.store.sessionStorageGet('recover');
    if(response) {
      console.log(response.data);

      const respons = await this.store.setFireStore('Tasks', uId, response.data)
      .then((data)=>{
        this.store.clearSStorage();
        return data;
      })
      
      return response;
      
    }

    return {status: false, response: undefined}

  }

  //get one
  getTaskById() {}

  //get all
  async getTasks(uId: string) {
  
    const response = await this.store.getFireStore('Tasks', uId)
    .then((data)=>{
      console.log(data.results)
      return data
    })
    return response;
  }

  //get by user
  getUserTask() {}

}
