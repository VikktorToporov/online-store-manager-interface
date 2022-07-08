import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { CartService } from 'src/app/services/cart.service';
import { ClientsService } from 'src/app/services/clients.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartIds: string[];
  items: Item[];
  itemQuantities: {id: string, quantity: number}[] = [];
  totalPrice = 0;
  userId: string;

  constructor(protected itemService: ItemService, protected clientsService: ClientsService, private _cartService: CartService) { }

  ngOnInit(): void {
    this.cartIds = JSON.parse(localStorage.getItem('cart'));
    this.userId = localStorage.getItem('userId');

    this.getCartInfo(this.cartIds);
  }

  private getCartInfo(cartIds: string[]) {
   if (cartIds && cartIds.length > 0) {
    this.itemService.getItemsByIds(cartIds)
      .subscribe((result: Item[]) => {
        if (result) {
          this.items = result;

          this.itemQuantities = this.getInitialItemQuanities(this.items, this.cartIds);

          this.totalPrice = this.calculateTotalPrice(this.items, this.itemQuantities);
        }
      });
   }
  }

  calculateTotalPrice(items: Item[], itemQuantities: { id: string; quantity: number; }[]): number {
    let result = 0;

   if (items && items.length > 0 && itemQuantities && itemQuantities.length > 0) {
    items.forEach(item => {
      const match = itemQuantities.find(iq => iq?.id === item?.id);

      if (match) {
        result += item.price * match.quantity;
      }
    });
   }
   
   return result;
  }

  private getInitialItemQuanities(items: Item[], cartIds: string[]): { id: string; quantity: number; }[] {
    const result = [];

   if (items && items.length > 0 && cartIds && cartIds.length > 0) {
    items.forEach(item => {
      const quantity = cartIds.filter(cartId => cartId === item?.id)?.length;
      const toPush = {
        id: item?.id,
        quantity: quantity
      };

      result.push(toPush);
    });
   }

   return result;
  }

  removeItem(id: string) {
    if (id) {
      const selected = this.itemQuantities.find(item => item.id === id);

      if (selected) {
        if (selected?.quantity > 1) {
          selected.quantity = selected.quantity - 1;
        } else {
          const index = this.itemQuantities.indexOf(selected);
  
          this.itemQuantities.splice(index, 1);
          this.items.splice(index, 1);
        }
  
        const indexCartIds = this.cartIds.indexOf(id);
        this.cartIds.splice(indexCartIds, 1);
  
        localStorage.setItem('cart', JSON.stringify(this.cartIds));
  
        this._cartService.emitChange();
        this.totalPrice = this.calculateTotalPrice(this.items, this.itemQuantities);

        if (this.userId) {
          this.saveItemInDBCart(id, this.userId, false);
        }
      }
    }
  }

  addItem(id: string) {
     if (id) {
      const selected = this.itemQuantities.find(item => item.id === id);

      if (selected) {
        selected.quantity = selected.quantity + 1;
        this.cartIds.push(id);
        
        localStorage.setItem('cart', JSON.stringify(this.cartIds));
        
        if (this.userId) {
          this.saveItemInDBCart(id, this.userId, true);
        }

        this._cartService.emitChange();
        this.totalPrice = this.calculateTotalPrice(this.items, this.itemQuantities);
      }
    }
  }

  private saveItemInDBCart(id: string, userId: string, insert: boolean) {
    if (id && userId) {
      this.clientsService.addRemoveFromCart(userId, id, insert)
        .subscribe((result) => {});
    }
  }
}
