import { Component, OnInit } from '@angular/core';
import { IRoom, IRoomList } from './rooms';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  hotelname: string = 'Hotel Inventory';

  numberOfRooms: number = 10;

  hideRooms = false;

  selectedRoom!: IRoomList;

  rooms: IRoom = {
    totalRooms: 20,
    availableRooms: 10,
    bookedRooms: 5
  }

  roomList: IRoomList[] = [];

  
  toggle() {
    this.hideRooms = !this.hideRooms;
  }
  
  ngOnInit(): void {
    this.roomList = [{
      roomNumber: 1,
      roomType: 'apertment',
      amenities: 'Air conditioner, free wifi, TV',
      price: 500,
      photos: 'http://github.com/154749494/treasure.jpg',
      checkInTime: new Date('3/22/2023'),
      checkOutTime: new Date('4/22/2023')
    }
      ,
    {
      roomNumber: 2,
      roomType: 'apertment',
      amenities: 'Air conditioner, free wifi, TV',
      price: 1000,
      photos: 'http://github.com/154749494/treasure.jpg',
      checkInTime: new Date('3/22/2023'),
      checkOutTime: new Date('4/22/2023')
    },
    {
      roomNumber: 3,
      roomType: 'private suite',
      amenities: 'Air conditioner, free wifi, TV',
      price: 15000,
      photos: 'http://github.com/154749494/treasure.jpg',
      checkInTime: new Date('3/22/2023'),
      checkOutTime: new Date('4/22/2023')
    }]
    
  }

  selectRoom(room: IRoomList) {
    this.selectedRoom = room;
  }

  addRoom() {
    const room: IRoomList = {
      roomNumber: 4,
      roomType: 'single',
      amenities: 'Air conditioner, free wifi, TV',
      price: 800,
      photos: 'http://github.com/154749494/treasure.jpg',
      checkInTime: new Date('3/22/2023'),
      checkOutTime: new Date('4/22/2023')
    }

    this.roomList.push(room);
  }

}
