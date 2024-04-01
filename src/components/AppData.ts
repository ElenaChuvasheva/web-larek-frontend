import { ContactFormErrors, IAppState, IItem, IOrder, OrderFormErrors, Uuid } from "../types";
import { Model } from "./base/Model";

export class Item extends Model<IItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export class AppState extends Model<IAppState> {
    catalog: Item[] = [];
    basket: Uuid[] = [];
    order: IOrder | null = null;
    orderformErrors: OrderFormErrors = {};
    contactformErrors: ContactFormErrors = {};

    setCatalog(items: IItem[]) {                
        this.catalog = items.map(item => new Item(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });        
    }

    addBasket(item: IItem) {
        this.basket.push(item.id);
        console.log(this.basket);
    }

    getNumberBasket(): number {
        return this.basket.length;
    }
}

export type CatalogChangeEvent = {
    catalog: Item[];
};
