import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { VariableComponent } from './variable/variable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalStoreService } from './services/store/local-store-service.service';
import { UsersService } from './services/users/users.service';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomsListComponent } from './rooms/rooms-list/rooms-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { AddTaskComponent } from './tasks/add-task/add-task.component';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthserviceService } from './services/authservice.service';
import { AuthguardService } from './services/authguard.service';
import { GuardtemplateComponent } from './guardtemplate/guardtemplate.component';
import { HomepageComponent } from './homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat'
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import {  MatCardModule } from '@angular/material/card'
import { MatDatepickerModule } from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator'
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { UserprofileComponent } from './userprofile/userprofile.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    VariableComponent,
    RoomsComponent,
    RoomsListComponent,
    RegisterComponent,
    LoginComponent,
    TaskListComponent,
    AddTaskComponent,
    EditTaskComponent,
    TaskDetailsComponent,
    DashboardComponent,
    GuardtemplateComponent,
    HomepageComponent,
    SidenavbarComponent,
    UserprofileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressBarModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ],
  providers: [
    LocalStoreService,
    AuthserviceService,
    UsersService,
    AuthguardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
