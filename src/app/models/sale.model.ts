import { Item } from "./item.model";

export interface Sale {
    id: string;

    startDate: string;

    endDate: string;

    salePercentage: number;

    items: Item[];
}