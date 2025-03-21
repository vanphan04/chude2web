import { defineStore } from 'pinia';

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    rooms: [
      { id: 1, number: '101', type: 'Standard', price: 500000 },
      { id: 2, number: '102', type: 'Deluxe', price: 800000 }
    ],
    customers: [],
    reservations: []
  }),
  actions: {
    addRoom(room) {
      this.rooms.push(room);
    }
  }
});
