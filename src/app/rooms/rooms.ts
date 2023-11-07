export interface IRoom {
    totalRooms?: number;
    availableRooms?: number;
    bookedRooms?: number;
}

export interface IRoomList {
    roomNumber: number;
    roomType: string;
    amenities: string;
    price: number;
    photos: string;
    checkInTime: Date;
    checkOutTime: Date;
}