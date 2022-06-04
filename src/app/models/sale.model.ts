import { Item } from "./item.model";

export interface Sale {
    id: string;

    startDate: Date | string;

    endDate: Date | string;

    salePercentage: number;

    items: Item[];
}