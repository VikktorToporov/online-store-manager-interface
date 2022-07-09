import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserRole } from 'src/app/enums/user.enum';
import { DeliveryCompany } from 'src/app/models/delivery-company.model';
import { Sale } from 'src/app/models/sale.model';
import { Store } from 'src/app/models/store.model';
import { User } from 'src/app/models/user.model';
import { ClientsService } from 'src/app/services/clients.service';
import { DeliveryCompaniesService } from 'src/app/services/delivery-companies.service';
import { SaleService } from 'src/app/services/sale.service';
import { StoresService } from 'src/app/services/stores.service';
import { UsersService } from 'src/app/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from 'src/app/models/order.model';
import { OrderStatus } from 'src/app/enums/order.enum';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/item.model';
import { ItemCategory, ItemCategory_Display } from 'src/app/enums/item.enum';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  userId: string;
  userType: UserRole;
  user: User;

  categories: { text: string, value: any, items?: Item[] }[] = [];
  sales: any[];
  stores: any[];

  storeForm: FormGroup;
  itemForm: FormGroup;
  companyForm: FormGroup;
  saleForm: FormGroup;

  initialValueStore = {
    name: '',
    address: '',
  };
  initialValueItem = {
    title: '',
    description: '',
    price: null,
    saleId: null,
    storeId: null,
    category: null,
    image: null,
  };
  initialValueCompany = {
    name: '',
    deliveryFee: null,
  };
  initialValueSale = {
    startDate: '',
    endDate: '',
    salePercentage: null,
  };

  navSelected;
  enumUserRole = UserRole;

  constructor(
      private fb: FormBuilder, protected usersService: UsersService, protected clientsService: ClientsService, private _snackBar: MatSnackBar,
      protected storesService: StoresService, protected deliveryCompaniesService: DeliveryCompaniesService, protected salesService: SaleService,
      protected ordersService: OrdersService, protected itemsService: ItemService
  ) {
    this.userId = localStorage.getItem('userId');

    if (this.userId) {
      const type = localStorage.getItem('userType');

      if (type != null && type != undefined) {
        if (+type == UserRole.ADMINISTRATOR) {
          this.userType = UserRole.ADMINISTRATOR;
        } else if (+type == UserRole.MODERATOR) {
          this.userType = UserRole.MODERATOR;
        }
      }

      this.changeNav(0);

      this.initForms();

      this.categories = this.generateCategories();
      this.getSales();
      this.getStores();
    } else {
      // redirect
    }
  }

  initForms() {
     this.storeForm = this.fb.group(this.initialValueStore);
     this.itemForm = this.fb.group(this.initialValueItem);
     this.companyForm = this.fb.group(this.initialValueCompany);
     this.saleForm = this.fb.group(this.initialValueSale);
     this.saleForm = this.fb.group(this.initialValueSale);
  }

  addStore() {
    const payload = {
      userId: this.userId,
      name: this.storeForm?.value?.name,
      address: this.storeForm?.value?.address,
    };

    this.storesService?.addStore(payload)
    .subscribe((result: any) => {
      if (result) {
        this.storeForm.patchValue(this.initialValueStore);

        this._snackBar.open('Store added!', 'Close', {duration: 2 * 1000});
      }
    });
  }

  addItem() {
    const payload = {
      title: this.itemForm?.value?.title,
      description: this.itemForm?.value?.description,
      price: this.itemForm?.value?.price,
      saleId: this.itemForm?.value?.saleId,
      storeId: this.itemForm?.value?.storeId,
      category: this.itemForm?.value?.category,
      imageUrls: [this.itemForm?.value?.image],
    };

    this.itemsService?.addItem(payload)
    .subscribe((result: any) => {
      if (result) {
        this.itemForm.patchValue(this.initialValueItem);

        this._snackBar.open('Item added!', 'Close', {duration: 2 * 1000});
      }
    });
  }


  changeNav(item: number) {
    this.navSelected = item;
  }

  addCompany() {
    const payload = {
      userId: this.userId,
      name: this.companyForm?.value?.name,
      deliveryFee: this.companyForm?.value?.deliveryFee,
    };

    this.deliveryCompaniesService?.addDeliveryCompanies(payload)
    .subscribe((result: any) => {
      if (result) {
        this.companyForm.patchValue(this.initialValueCompany);

        this._snackBar.open('Courier added!', 'Close', {duration: 2 * 1000});
      }
    });
  }

  addSale() {
    const payload = {
      userId: this.userId,
      startDate: this.saleForm?.value?.startDate,
      endDate: this.saleForm?.value?.endDate,
      salePercentage: this.saleForm?.value?.salePercentage,
    };

    this.salesService?.addSale(payload)
    .subscribe((result: any) => {
      if (result) {
        this.saleForm.patchValue(this.initialValueSale);

        this._snackBar.open('Sale added!', 'Close', {duration: 2 * 1000});
      }
    });
  }

  private generateCategories(): { text: string, value: any, items?: Item[] }[] {
    const result: { text: string, value: any, items?: Item[] }[] = [{ text: 'All', value: '' }];

    const keys = Object.keys(ItemCategory);

    if (keys && keys.length > 0) {
      keys.forEach(key => {
        const value = ItemCategory_Display[key];

        if (value && value.length > 0) {
          const entry = { text: value, value: key };

          result.push(entry);
        }
      });
    }

    return result;
  }
  
  private getSales() {
    this.salesService.getAll()
        .subscribe((result: Sale[]) => {
          if (result) {
            this.sales = result;
          }
        })
  }

  private getStores() {
    this.storesService.getAll()
        .subscribe((result: any[]) => {
          if (result) {
            this.stores = result;
          }
        })
  }

  ngOnInit(): void {
  }

}
