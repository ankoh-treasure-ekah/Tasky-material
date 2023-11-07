import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RegisterComponent } from './auth/register/register.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { AddTaskComponent } from './tasks/add-task/add-task.component';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthguardService } from './services/authguard.service';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { HomepageComponent } from './homepage/homepage.component';
import { GuardtemplateComponent } from './guardtemplate/guardtemplate.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'signup',
    component: RegisterComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthguardService],
    children: [
      {
        path: 'task-detail',
        component: TaskDetailsComponent
      },
      {
        path: 'tasks',
        component: TaskListComponent,
      },

      {
        path: 'add-task',
        component: AddTaskComponent
      }
      
    ]
  },
  {
    path: 'page-404',
    component: GuardtemplateComponent
  },
  {
    path: '**',
    component: GuardtemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
