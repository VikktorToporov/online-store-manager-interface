import { ItemCategory } from "../enums/item.enum";
import { Sale } from "./sale.model";
import { Store } from "./store.model";

export interface Item {
    id: string;

    title: string;

    description: string;

    category: ItemCategory;

    price: number;

    createDate: Date | string;

    changeDate: Date | string;

    sale: Sale;

    store: Store;

    images: any;
}