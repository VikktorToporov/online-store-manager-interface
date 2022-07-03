import { Component } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent {
  itemId: string;
  item: Item;
  isItemInCart = false;

  constructor(protected itemService: ItemService, protected route: ActivatedRoute) {
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

            this.isItemInCart = this.checkIsItemInCart(this.item?.id);
          }
        })
    }
  }

  private checkIsItemInCart(id: string): boolean {
   if (id) {
    const cart: string[] = JSON.parse(localStorage.getItem('cart'));

    if (cart && cart.length > 0) {
      return cart.includes(id);
    }
   }

   return false;
  }

  addToCart(id: string) {
    if (id) {
      let cart: string[] = JSON.parse(localStorage.getItem('cart'));
      if (!cart) {
        cart = [];
      }

      if (this.isItemInCart) {
        const index = cart.indexOf(id);

        cart.splice(index);
      } else {
        cart.push(id);
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      this.isItemInCart = this.checkIsItemInCart(this.item?.id);
    }
  }
}
