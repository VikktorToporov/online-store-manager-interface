import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { SearchService } from 'src/app/services/search.service';
import { take } from 'rxjs/operators';
import { UserRole } from 'src/app/enums/user.enum';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  @Input('user-id') userId: string;
  userType: UserRole;
  
  cartNumber: number = null;
  searchKeyword = null;
  currentUrl: string;
  queryParams: any = {};

  enumUserRole = UserRole;

  constructor(_cartService: CartService, protected _searchService: SearchService, private route: ActivatedRoute, private router: Router) {
    _cartService.changeEmitted$.subscribe(i => {
      this.updateCartNumber();
    });

    if (localStorage.getItem('userType') != null && localStorage.getItem('userType') != undefined) {
      this.userType = +localStorage.getItem('userType');
    }
    
}

  ngOnChanges(changes: SimpleChanges): void {
   if (changes) {
    this.updateCartNumber();
   }
  }

  search() {
    this.route.queryParams
      .pipe(take(1))
      .subscribe(params => {
       this.queryParams = { ...params};
      });

    this.queryParams['searchKeyword'] = this.searchKeyword;

    this.router.navigate(['/List'], { queryParams: this.queryParams });

    this.searchKeyword = null;
  }

  private updateCartNumber() {
    const cartString = localStorage.getItem('cart');

    if (cartString) {
      let cart: string[] = JSON.parse(cartString);
    
      this.cartNumber = cart?.length || null;
    } else {
      this.cartNumber = null;
    }
  }

  logout() {
    localStorage.removeItem('cart');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    this.router.navigate(['/']);
    this.userId = null;
    this.userType = null;
  }
}
