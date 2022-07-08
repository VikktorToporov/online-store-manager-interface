import { ItemCategory } from "../enums/item.enum";
import { Sale } from "./sale.model";
import { Store } from "./store.model";

export interface Item {
    id: string;

    title: string;

    description: string;

    category: ItemCategory;

    price: number;

    originalPrice: number;

    createDate: Date | string;

    changeDate: Date | string;

    sale: Sale;

    store: {text: string, value: string};

    images: any;
}

export interface FrontPageFeed {
    itemsVehicle: Item[];
    
    itemsSportHobby: Item[];
    
    itemsClothes: Item[];
    
    itemsPets: Item[];
    
    itemsElectronics: Item[];
    
    itemsGames: Item[];
    
    itemsAntiques: Item[];
    
    itemsOther: Item[];
}