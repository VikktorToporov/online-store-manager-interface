import { User } from "./user.model";
import { Item } from "./item.model";

export interface Store {
    id: string;

    address: string;

    active: boolean;

    user: User;
    
    items: Item[];
}