import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
  items = [];
  isEdit = false;
  itemId;
  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.getItems();
  }

  inventoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required)
  });

  saveItem() {
    if (this.isEdit) {
      console.log(this.inventoryForm);
      this.inventoryService
        .updateItem(this.itemId, this.inventoryForm.value)
        .subscribe(resp => {
          this.inventoryService.success('Item updated successfully.');
          this.getItems();
          console.log(resp);
        });
    } else {
      console.log(this.inventoryForm);
      this.inventoryService.saveItem(this.inventoryForm.value).subscribe(
        resp => {
          this.inventoryService.success('Item saved successfully.');
          this.getItems();
          console.log(resp);
        },
        err => {
          this.inventoryService.error(err);
        }
      );
    }
  }

  getItems() {
    this.inventoryService.getItemList().subscribe(
      (resp: any) => {
        this.items = [];
        for (let key in resp) {
          resp[key]['id'] = key;
          this.items.push(resp[key]);
        }
        console.log(this.items);
      },
      err => {
        this.inventoryService.error(err);
      }
    );
  }

  deleteItem(itemId) {
    this.inventoryService.deleteItem(itemId).subscribe(
      (resp: any) => {
        this.inventoryService.success('Item deleted successfully.');
        this.getItems();
      },
      err => {
        this.inventoryService.error(err);
      }
    );
  }

  editItem(item) {
    this.isEdit = true;
    this.itemId = item.id;
    this.inventoryForm.controls.name.setValue(item.name);
    this.inventoryForm.controls.price.setValue(item.price);
    this.inventoryForm.controls.description.setValue(item.description);
  }

  resetValue() {
    this.isEdit = false;
    this.inventoryForm.reset();
  }
}
