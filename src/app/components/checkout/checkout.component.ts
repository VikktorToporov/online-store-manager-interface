import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Item } from 'src/app/models/item.model';
import { BankAccountsService } from 'src/app/services/bank-accounts.service';
import { DeliveryCompaniesService } from 'src/app/services/delivery-companies.service';
import { ItemService } from 'src/app/services/item.service';
import { OrdersService } from 'src/app/services/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  deliveryCompanyForm: FormGroup;
  bankAccountForm: FormGroup;
  userId: string;
  existingBankAccount: any;
  deliveryCompanies: any[];
  cartIds: string[];
  deliveryFee: number;
  totalPrice: number;

  constructor(
      private fb: FormBuilder, protected bankAccountsService: BankAccountsService, protected deliveryCompaniesService: DeliveryCompaniesService,
      protected ordersService: OrdersService, protected itemService: ItemService, private _snackBar: MatSnackBar, private router: Router
  ) {
    this.userId = localStorage.getItem('userId');
    this.cartIds = JSON.parse(localStorage.getItem('cart'));
    
    this.deliveryCompanyForm = this.fb.group({
      deliveryCompany: [''],
    });

    this.bankAccountForm = this.fb.group({
      bankName: [''],
      number: [''],
    });

    this.checkForBankAccount();
    this.getDeliveryCompanies();
    this.getCartInfo(this.cartIds);
  }
  private getDeliveryCompanies() {
    this.deliveryCompaniesService.getDeliveryCompanies()
      .subscribe((result: any[]) => {
        if (result) {
          this.deliveryCompanies = result;
        }
      });
  }

  private checkForBankAccount() {
   this.bankAccountsService.getBankAccount(this.userId)
    .subscribe((result: any[]) => {
      if (result && result.length > 0) {
        this.bankAccountForm.patchValue({
          bankName: result[0].bankName,
          number: result[0].number,
        });

        this.existingBankAccount = result[0];
      }
    });
  }

  order() {
    if (this.deliveryCompanyForm?.valid && this.bankAccountForm?.valid) {
      const deliveryCompany = this.deliveryCompanyForm.value?.deliveryCompany;
      const bankName = this.bankAccountForm.value?.bankName;
      const bankNumber = this.bankAccountForm.value?.number;

      if (bankName && bankNumber && deliveryCompany && this.cartIds?.length > 0 && this.userId) {
        const payload = {
          userId: this.userId,
          deliveryCompanyId: deliveryCompany,
          itemIds: this.cartIds
        };

        this.ordersService.insertOrder(payload)
          .subscribe((result: any) => {
            if (result) {
              if (this.existingBankAccount) {
                if (this.existingBankAccount.bankName !== bankName || this.existingBankAccount.number !== bankNumber) {
                  this.updateBankAccount(this.existingBankAccount.id, bankName, bankNumber);
                } else {
                  this.success();
                }
              } else {
                this.insertBankAccount(this.userId, bankName, bankNumber);
              }
            }
          })
      }
    }
  }

  success() {
    this._snackBar.open('Order Created!', 'Close', {duration: 2 * 1000});
    this.router.navigate(['/']);
  }

  private insertBankAccount(userId: string, bankName: any, bankNumber: any) {
    if (userId && bankName && bankNumber) {
      const params = {
        clientId: userId,
        bankName: bankName,
        number: bankNumber
      };

      this.bankAccountsService.insertBankAccount(params)
      .subscribe((result: any) => {
        this.success();
      });
    }
  }

  private updateBankAccount(id: string, bankName: string, bankNumber: string) {
    if (id && bankName && bankNumber) {
      const params = {
        id: id,
        bankName: bankName,
        number: bankNumber
      };

      this.bankAccountsService.updateBankAccount(params)
      .subscribe((result: any) => {
        this.success();
      });
    }
  }

  deliveryCompanySelected(item: any) {
    if (this.deliveryCompanies?.length > 0) {
      const match = this.deliveryCompanies.find(company => company.id === item.value);

      if (match) {
        this.deliveryFee = match.deliveryFee;
      }
    }
  }

  private getCartInfo(cartIds: string[]) {
    if (cartIds && cartIds.length > 0) {
     this.itemService.getItemsByIds(cartIds)
       .subscribe((result: Item[]) => {
         if (result) {
 
           const quantities: { id: string; quantity: number; }[] = this.getQuanities(result, this.cartIds);
 
           this.totalPrice = this.calculateTotalPrice(result, quantities);
         }
       });
    }
   }

  calculateTotalPrice(items: Item[], itemQuantities: { id: string; quantity: number; }[]): any {
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

  getQuanities(items: Item[], cartIds: string[]): { id: string; quantity: number; }[] {
    const result: { id: string; quantity: number; }[] = [];

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
}
