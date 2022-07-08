import { Component } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/services/cart.service';
import { ClientsService } from 'src/app/services/clients.service';
import { UserRole } from 'src/app/enums/user.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sale } from 'src/app/models/sale.model';
import { SaleService } from 'src/app/services/sale.service';
import { Store } from 'src/app/models/store.model';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent {
  itemId: string;
  item: any;
  userId: string;
  userType: UserRole;
  editItem = false;

  editForm: FormGroup;
  initialValue = {
    title: '',
    description: '',
    price: null,
    saleId: null,
    storeId: null,
  };

  sales: Sale[];
  stores: any[];

  constructor(private router: Router, protected storesService: StoresService, protected salesService: SaleService, private fb: FormBuilder, protected itemService: ItemService, protected clientsService: ClientsService, protected route: ActivatedRoute, private _snackBar: MatSnackBar, private _cartService: CartService) {
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

      this.editForm = this.fb.group(this.initialValue);
    }

    this.getItemId();
  }

  private getItemId() {
    this.route.params
      .subscribe(result => {
        this.itemId = result.id;

        if (this.itemId) {
          this.getItemInfo(this.itemId);
        }
      })
  }

  private getItemInfo(itemId: string) {
    if (itemId) {
      this.itemService.getItem(itemId)
        .subscribe((result: Item) => {
          if (result) {
            this.item = result;
          }
        })
    }
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

  addToCart(id: string) {
    if (id) {
      let cart: string[] = JSON.parse(localStorage.getItem('cart'));

      if (!cart) {
        cart = [];
      }

      cart.push(id);

      localStorage.setItem('cart', JSON.stringify(cart));

      if (this.userId) {
        this.saveItemInDBCart(id, this.userId);
      }
      
      this._snackBar.open('Item added to cart!', 'Close', {duration: 2 * 1000});
      this._cartService.emitChange();
    }
  }

  private saveItemInDBCart(id: string, userId: string) {
    if (id && userId) {
      this.clientsService.addRemoveFromCart(userId, id, true)
        .subscribe((result) => {});
    }
  }

  closeDark() {
    this.editItem = false;
  }

  updateItem() {
    const payload = {
      ...this.item,
      title: this.editForm?.value?.title,
      description: this.editForm?.value?.description,
      price: this.editForm?.value?.price,
      saleId: this.editForm?.value?.saleId,
      storeId: this.editForm?.value?.storeId,
    };

    this.itemService.updateItem(payload)
    .subscribe((result) => {
      if (result) {
        this._snackBar.open('Item updated!', 'Close', {duration: 2 * 1000});
        this.editItem = false;
        this.getItemId();
      }
    });
  }

  openEditItem() {
    this.getSales();
    this.getStores();

    this.editItem = true;

    const initialValue = {...this.initialValue};
    initialValue.title = this.item.title;
    initialValue.description = this.item.description;
    initialValue.price = this.item.price;
    initialValue.saleId = this.item.sale?.id;
    initialValue.storeId = this.item.store?.id;

    this.editForm = this.fb.group(initialValue);
  }

  deleteItem() {
    this.itemService.deleteItem(this.itemId)
    .subscribe((result) => {
      if (result) {
        this.router.navigate(['/']);
      }
    });
  }
}
