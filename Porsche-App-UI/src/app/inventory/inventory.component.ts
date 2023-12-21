import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  fetchInventory = () => {
    fetch('http://localhost:3001/users/all')
      .then((response) => {
        return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.log(error)
    })
  }


}
