import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IRoomList } from '../rooms';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})export class RoomsListComponent implements OnInit, OnChanges {
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Method not implemented.');
  }

  @Input()rooms: IRoomList[] = [];
  @Output()roomSelected = new EventEmitter<IRoomList>();

  ngOnInit(): void {
    
  }

  selectRoom(room: IRoomList) {
    this.roomSelected.emit(room);
  }
}

