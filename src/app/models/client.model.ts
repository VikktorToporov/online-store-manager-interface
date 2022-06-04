import { BankAccount } from "./bank-account.model";
import { BaseUser } from "./base-user.model";
import { Order } from "./order.model";

export interface Client extends BaseUser {
    bankAccounts: BankAccount[];

    cart: any[];

    orders: Order[];

    password: string;
    
    active: boolean;

    dtype: string;
}