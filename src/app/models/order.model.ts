import { OrderStatus } from "../enums/order.enum";
import { Client } from "./client.model";
import { DeliveryCompany } from "./delivery-company.model";
import { Item } from "./item.model";

export interface Order {
    id: string;

    totalPrice: number;

    status: OrderStatus;

    createDate: Date | string;

    changeDate: Date | string;

    deliveryCompany: DeliveryCompany;

    client: Client;

    items: Item[];
}