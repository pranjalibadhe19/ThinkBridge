import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
  items = [];
  isEdit = false;
  itemId;
  page = 1;
  pageSize = 4;
  searchItem = '';
  imageSrc;
  isThumbnailView = false;
  viewItem;
  constructor(
    private inventoryService: InventoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getItems();
  }

  inventoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    file: new FormControl(''),
    fileSource: new FormControl('')
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
    this.resetValue();
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

  editItem(item, content) {
    this.isEdit = true;
    this.itemId = item.id;
    this.inventoryForm.controls.name.setValue(item.name);
    this.inventoryForm.controls.price.setValue(item.price);
    this.inventoryForm.controls.description.setValue(item.description);
    this.imageSrc = item.fileSource;
    this.modalService.open(content, { size: 'md' });
  }

  resetValue() {
    this.isEdit = false;
    this.imageSrc = '';
    this.inventoryForm.reset();
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.inventoryForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }

  openModal(size, content, item?) {
    this.viewItem = item;
    this.resetValue();
    this.modalService.open(content, { size: size });
  }

  thumbnailView() {
    this.isThumbnailView = !this.isThumbnailView;
  }
}
