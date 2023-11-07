import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      notifications: number
      userImg: string
    }){}

    fileName: string = '';
    src:string = ''

    onFileSelected(e: any) {
      const file:File = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.src = reader.result as any
      }

      console.log(e.target.files)
      this.fileName = file.name
      // this.src = URL.createObjectURL(file);
      // console.log(this.src)
    }
}
