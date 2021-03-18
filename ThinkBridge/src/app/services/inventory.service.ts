import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  firebaseUrl =
    'https://my-http-project-7dce1-default-rtdb.firebaseio.com/posts';
  constructor(private http: HttpClient) {}

  getItemList() {
    return this.http.get(this.firebaseUrl+'.json');
  }

  saveItem(itemData) {
    return this.http.post(this.firebaseUrl+'.json', itemData);
  }

  deleteItem(itemId) {
    return this.http.delete(this.firebaseUrl+'/'+itemId+'.json');
  }

  updateItem(itemId, itemData) {
    return this.http.patch(this.firebaseUrl+'/'+itemId+'.json', itemData);
  }

  //Alerts
  success(msg) {
    this.alert('success', msg);
  }
  error(msg) {
    this.alert('error', msg);
  }

  alert(type, msg) {
    Swal.fire({
      position: 'top-end',
      icon: type,
      title: msg,
      showConfirmButton: false,
      timer: 10000,
      toast: true
    });
  }
}
