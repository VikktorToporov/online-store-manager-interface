import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemCategory, ItemCategory_Display } from 'src/app/enums/item.enum';
import { SortOrder, SortColumn } from 'src/app/enums/sort.enum';
import { Item } from 'src/app/models/item.model';
import { Store } from 'src/app/models/store.model';
import { ItemService } from 'src/app/services/item.service';
import { SearchService } from 'src/app/services/search.service';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  items: Item[];
  categories: { text: string, value: any}[] = [];

  skip: number = 0;
  top: number = 12;
  pageSize: number = 12;
  totalItems: number = 0;

  searchKeyword: string = null;
  priceFrom: number = null;
  priceTo: number = null;
  category: ItemCategory = null;
  sortOrder: string = SortOrder[SortOrder.ASC];
  sortColumn: string = SortColumn[SortColumn.CREATEDATE];
  storeId: string = null;
  
  filtersForm: FormGroup;

  priceFromMin = 0;
  priceFromMax = 10000;
  priceToMin = 0;
  priceToMax = 10000;

  initialValue = {
    category: '',
    priceFrom: '',
    priceTo: this.priceToMax,
    sortOrder: SortOrder[SortOrder.ASC],
    sortColumn: SortColumn[SortColumn.CREATEDATE],
    storeId: '',
  }

  stores: Store[];
  storeName: string;

  enumSortOrder = SortOrder;
  enumSortColumn = SortColumn;
  
  constructor(protected storesService: StoresService, private fb: FormBuilder, protected itemService: ItemService, _searchService: SearchService, private router: Router, private route: ActivatedRoute) {
    this.categories = this.generateCategories();

    if (this.categories?.length > 0 && this.initialValue) {
      this.initialValue.category = this.categories[0]?.value;

      this.filtersForm = this.fb.group(this.initialValue);
    }
  }

  ngOnInit(): void {
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParams
      .subscribe(params => {
        let load = false;
        const formValues = {...this.filtersForm.value};

        if (params.category) {
          this.category = params.category;
          formValues.category = this.category;
          load = true;
        }
    
        if (params.priceFrom) {
          this.priceFrom = params.priceFrom;
          formValues.priceFrom = this.priceFrom;
          load = true;
        }
    
        if (params.priceTo) {
          this.priceTo = params.priceTo;
          formValues.priceTo = this.priceTo;
          load = true;
        }
    
        if (params.sortColumn) {
          this.sortColumn = params.sortColumn;
          formValues.sortColumn = this.sortColumn;
          load = true;
        }
    
        if (params.sortOrder) {
          this.sortOrder = params.sortOrder;
          formValues.sortOrder = this.sortOrder;
          load = true;
        }

        if (params.storeId) {
          this.storeId = params.storeId;
          formValues.storeId = this.storeId;
          load = true;
        }
    
        if (params.searchKeyword) {
          this.searchKeyword = params.searchKeyword;
          load = true;
        } else {
          if (this.searchKeyword) {
            load = true;
          }

          this.searchKeyword = null;
        }

        if (load) {
          this.filtersForm.patchValue(formValues);
          this.getData();
        } else {
          const keys = Object.keys(params);

          if (keys?.length === 0 || !keys || !params) {
            this.getData();
          }
        }
      }
    );
  }

  updateFilters(filter: string, value: any) {
    if (filter && value != null && value != undefined) {
      switch (filter) {
        case 'category':
          this.category = value?.value;
          break;

        case 'priceFrom':
          this.priceFrom = value?.value;
          break;

        case 'priceTo':
          this.priceTo = value?.value === 10000 ? null : value?.value;
          break;

        case 'sortColumn':
          this.sortColumn = value?.value;
          break;

        case 'sortOrder':
          this.sortOrder = value?.value;
          break;
      }
    }
  }

  getData() {
    this.updateQueryParams();

    const params = {
      skip: this.skip,
      top: this.top,
      searchKeyword: this.searchKeyword,
      priceFrom: this.priceFrom,
      priceTo: this.priceTo,
      category: this.category,
      sortOrder: this.sortOrder,
      sortColumn: this.sortColumn,
    };

    if (this.storeId) {
      params['storeId'] = this.storeId;
      this.getStores();
    }

    this.itemService.getAll(params)
      .subscribe((result: { results: Item[], count: number }) => {
        if (result) {
          this.totalItems = result.count;
          this.items = result.results;
        }
      })
  }

  private generateCategories(): { text: string, value: any}[] {
    const result: { text: string, value: any}[] = [{ text: 'All', value: '' }];

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

  formatLabel(value: number) {
    return '$' + value;
  }

  pageChange(pageEvent: any) {
    if (pageEvent) {
      this.pageSize = pageEvent.pageSize;
      this.top = pageEvent.pageSize * (pageEvent.pageIndex + 1);

      if (pageEvent.pageIndex !== pageEvent.previousPageIndex) {
        this.skip = this.pageSize * (pageEvent.pageIndex + 1);
      }

      this.getData();
    }
  }

  updateQueryParams() {
    const queryParams = {};

    if (this.category) {
      queryParams['category'] = this.category;
    }

    if (this.priceFrom) {
      queryParams['priceFrom'] = this.priceFrom;
    }

    if (this.priceTo) {
      queryParams['priceTo'] = this.priceTo;
    }

    if (this.sortColumn) {
      queryParams['sortColumn'] = this.sortColumn;
    }

    if (this.sortOrder) {
      queryParams['sortOrder'] = this.sortOrder;
    }

    if (this.searchKeyword) {
      queryParams['searchKeyword'] = this.searchKeyword;
    }

    if (this.storeId) {
      queryParams['storeId'] = this.storeId;
    }

    this.router.navigate(['/List'], {queryParams: queryParams});
  }

  private getStores() {
    this.storesService.getAll()
        .subscribe((result: any[]) => {
          if (result) {
            this.stores = result;
            const match = this.stores?.find(store => store.id === this.storeId);

            if (match) {
              this.storeName = match.name;
            }
          }
        })
  }
}
