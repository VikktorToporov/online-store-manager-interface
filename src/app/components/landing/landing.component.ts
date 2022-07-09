import { Component } from '@angular/core';
import { ItemCategory, ItemCategory_Display } from 'src/app/enums/item.enum';
import { FrontPageFeed, Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  categories: { text: string, value: any, items?: Item[] }[] = [];
  userId: string;

  constructor(protected itemService: ItemService) {
    this.categories = this.generateCategories();
    this.getData();
  }

 private getData() {
  this.userId = localStorage.getItem('userId');

    this.itemService.getLandingItems(this.userId)
      .subscribe((result: FrontPageFeed) => {
        if (result) {
          this.mapResultsToCategories(result);
        }
      })
  }

  private mapResultsToCategories(result: FrontPageFeed) {
    if (this.categories && this.categories.length > 0 && result) {
     let allItems: Item[] = [];
     const keys = Object.keys(result);

     if (keys && keys.length > 0) {
      keys.forEach(key => {
        allItems = allItems.concat(result[key]);
       });
  
       if (allItems && allItems.length > 0) {
        this.categories.forEach(category => {
          category.items = allItems.filter(item => item.category === category.value)
         });
       }
     }
    }
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
}
