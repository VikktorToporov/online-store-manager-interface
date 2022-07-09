import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SiteTheme, UserRole } from 'src/app/enums/user.enum';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: string;
  userType: UserRole;
  user: User;

  userForm: FormGroup;
  storeForm: FormGroup;
  clientForm: FormGroup;
  companyForm: FormGroup;
  saleForm: FormGroup;

  initialValueUser = {
    theme: '',
    password: '',
    password2: '',
  };
  initialValueStore = {
    name: '',
    address: '',
  };
  initialValueClient = {
    username: '',
    email: '',
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

  stores: Store[];
  storeToEdit: Store;
  storesColumns: string[] = ['name', 'active', 'address'];

  users: User[];
  userToEdit: User;
  usersColumns: string[] = ['username', 'email'];

  companies: DeliveryCompany[];
  companyToEdit: DeliveryCompany;
  companiesColumns: string[] = ['name', 'deliveryFee'];

  sales: Sale[];
  saleToEdit: Sale;
  salesColumns: string[] = ['startDate', 'salePercentage'];

  orders: Order[];
  ordersColumns: string[] = ['status','totalPrice','items','deliveryCompany','createDate'];
  ordersTotalPrice = 0;
  ordersTotalItems = 0;
  
  navSelected;
  enumUserRole = UserRole;
  enumOrderStatus = OrderStatus;
  enumSiteTheme = SiteTheme;

  constructor(
      private fb: FormBuilder, protected usersService: UsersService, protected clientsService: ClientsService, private _snackBar: MatSnackBar,
      protected storesService: StoresService, protected deliveryCompaniesService: DeliveryCompaniesService, protected salesService: SaleService,
      protected ordersService: OrdersService
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
    } else {
      // redirect
    }
  }

  initForms() {
     this.userForm = this.fb.group(this.initialValueUser);
     this.storeForm = this.fb.group(this.initialValueStore);
     this.clientForm = this.fb.group(this.initialValueClient);
     this.companyForm = this.fb.group(this.initialValueCompany);
     this.saleForm = this.fb.group(this.initialValueSale);
  }

  updateProfile() {
    if (this.userForm?.value?.password) {
      const payload = {
        id: this.userId,
        password: this.userForm?.value?.password
      };

      this.usersService?.updateUser(payload)
        .subscribe((result: any) => {
          if (result) {
            this._snackBar.open('Profile updated!', 'Close', {duration: 2 * 1000});
          }
        });
    }

    if (this.userForm?.value?.theme) {
      const payload = {
        userId: this.userId,
        theme: this.userForm?.value?.theme
      };

      this.usersService?.changeTheme(payload)
        .subscribe((result: any) => {
          if (result) {
            this._snackBar.open('Theme updated!', 'Close', {duration: 2 * 1000});
          }
        });
    }
  }

  updateStore() {
    const payload = {
      id: this.storeToEdit.id,
      name: this.storeForm?.value?.name,
      address: this.storeForm?.value?.address,
      userId: this.userId
    };

    this.storesService?.updateStore(payload)
    .subscribe((result: any) => {
      if (result) {
        this.storeToEdit = null;
        this.getStores();
        this._snackBar.open('Store updated!', 'Close', {duration: 2 * 1000});
      }
    });
  }


  changeNav(item: number) {
    this.navSelected = item;

    if (this.navSelected === 1) {
      this.getStores();
    }

    if (this.navSelected === 2) {
      this.getUsers();
    }

    if (this.navSelected === 3) {
      this.getCompanies();
    }

    if (this.navSelected === 4) {
      this.getSales();
    }

    if (this.navSelected === 5) {
      this.getOrders();
    }
  }

  getStores() {
    if (this.userType === UserRole.ADMINISTRATOR) {
      this.storesService?.getAll()
        .subscribe((result: Store[]) => {
          if (result) {
            this.stores = result;
          }
        });
    } else if (this.userType === UserRole.MODERATOR) {
      this.storesService?.getByUserId(this.userId)
        .subscribe((result: Store[]) => {
          if (result) {
            this.stores = result;
          }
        });
    }
  }

  editStore(id: string) {
    this.storeToEdit = this.stores.find(store => store.id === id);

    const initialValue = {...this.initialValueStore};
    initialValue.address = this.storeToEdit.address;
    initialValue.name = this.storeToEdit.name;
    
    this.storeForm = this.fb.group(initialValue);
  }

  editClient(id: string) {
    this.userToEdit = this.users.find(user => user.id === id);

    const initialValue = {...this.initialValueClient};
    initialValue.username = this.userToEdit.username;
    initialValue.email = this.userToEdit.email;
    
    this.clientForm = this.fb.group(initialValue);
  }

  editCompany(id: string) {
    this.companyToEdit = this.companies.find(company => company.id === id);

    const initialValue = {...this.initialValueCompany};
    initialValue.name = this.companyToEdit.name;
    initialValue.deliveryFee = this.companyToEdit.deliveryFee;
    
    this.companyForm = this.fb.group(initialValue);
  }

  editSale(id: string) {
    this.saleToEdit = this.sales.find(sale => sale.id === id);

    const initialValue = {...this.initialValueSale};
    initialValue.startDate = this.saleToEdit.startDate;
    initialValue.endDate = this.saleToEdit.endDate;
    initialValue.salePercentage = this.saleToEdit.salePercentage;
    
    this.saleForm = this.fb.group(initialValue);
  }

  getUsers() {
    if (this.userType === UserRole.ADMINISTRATOR) {
      this.clientsService?.getAll()
        .subscribe((result: User[]) => {
          if (result) {
            this.users = result;
          }
        });
    }
  }

  getCompanies() {
    if (this.userType === UserRole.ADMINISTRATOR) {
      this.deliveryCompaniesService?.getDeliveryCompanies()
        .subscribe((result: DeliveryCompany[]) => {
          if (result) {
            this.companies = result;
          }
        });
    }
  }

  updateClient() {
    const payload = {
      id: this.userToEdit.id,
      username: this.clientForm?.value?.username,
      email: this.clientForm?.value?.email,
    };

    this.clientsService?.updateClient(payload)
    .subscribe((result: any) => {
      if (result) {
        this._snackBar.open('Client updated!', 'Close', {duration: 2 * 1000});
        this.userToEdit = null;
        this.getUsers();
      }
    });
  }

  updateCompany() {
    const payload = {
      id: this.companyToEdit.id,
      name: this.companyForm?.value?.name,
      deliveryFee: this.companyForm?.value?.deliveryFee,
    };

    this.deliveryCompaniesService?.updateDeliveryCompanies(payload)
    .subscribe((result: any) => {
      if (result) {
        this._snackBar.open('Courier updated!', 'Close', {duration: 2 * 1000});
        this.companyToEdit = null;
        this.getCompanies();
      }
    });
  }

  getSales() {
    if (this.userType === UserRole.ADMINISTRATOR || this.userType === UserRole.MODERATOR) {
      this.salesService?.getAll()
        .subscribe((result: Sale[]) => {
          if (result) {
            this.sales = result;
          }
        });
    }
  }

  updateSale() {
    const payload = {
      id: this.saleToEdit.id,
      startDate: this.saleForm?.value?.startDate,
      endDate: this.saleForm?.value?.endDate,
      salePercentage: this.saleForm?.value?.salePercentage,
    };

    this.salesService?.updateSale(payload)
    .subscribe((result: any) => {
      if (result) {
        this._snackBar.open('Sale updated!', 'Close', {duration: 2 * 1000});
        this.saleToEdit = null;
        this.getSales();
      }
    });
  }

  closeDark() {
    this.storeToEdit = null;
    this.userToEdit = null;
    this.companyToEdit = null;
    this.saleToEdit = null;
  }

  getOrders() {
    this.ordersService?.getbyClient(this.userId)
        .subscribe((result: Order[]) => {
          if (result) {
            this.orders = result;
            this.ordersTotalPrice = 0;
            this.ordersTotalItems = 0;
            this.orders.forEach(order => {
              this.ordersTotalPrice += order?.totalPrice || 0;
              this.ordersTotalItems += order?.items?.length || 0;
            });
          }
        });
  }

  deleteStore() {
    this.storesService?.deleteStore(this.storeToEdit?.id)
      .subscribe((result: any) => {
        this._snackBar.open('Store deleted!', 'Close', {duration: 2 * 1000});
        this.closeDark();
        this.getStores();
      });
  }

  deleteClient() {
    const payload = {
      ...this.userToEdit,
      active: false
    };

    this.clientsService?.updateClient(payload)
    .subscribe((result: any) => {
      this._snackBar.open('Client deleted!', 'Close', {duration: 2 * 1000});
        this.closeDark();
        this.getUsers();
    });
  }

  deleteCompany() {
    this.deliveryCompaniesService?.deleteCompanies(this.companyToEdit?.id)
      .subscribe((result: any) => {
        this._snackBar.open('Courier deleted!', 'Close', {duration: 2 * 1000});
          this.closeDark();
          this.getCompanies();
      });
  }

  deleteSale() {
    this.salesService?.deleteSales(this.saleToEdit?.id)
      .subscribe((result: any) => {
        this._snackBar.open('Sale deleted!', 'Close', {duration: 2 * 1000});
          this.closeDark();
          this.getSales();
      });
  }


  ngOnInit(): void {
  }

}
