import { ContactFormErrors, IAppState, IItem, IOrder, OrderFormErrors } from "../types";
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
    catalog: IItem[] = [];
    basket: IItem[] = [];
    order: IOrder | null = null;
    orderformErrors: OrderFormErrors = {};
    contactformErrors: ContactFormErrors = {};

    setCatalog(items: IItem[]) {                
        this.catalog = items.map(item => new Item(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });        
    }

    addBasket(item: IItem) {
        this.basket.push(item);
        this.emitChanges('basket:changed');
    }

    removeBasket(item: IItem) {
        this.basket = this.basket.filter((basketItem) => basketItem.id !== item.id);
        this.emitChanges('basket:changed');
    }

    isInBasket(item: IItem) {
        return this.basket.some((basketItem) => {return basketItem.id === item.id;});
    }

    getNumberBasket(): number {
        return this.basket.length;
    }

    getTotalBasket(): number {
        return this.basket.reduce((a, b) => {return a + (b.price ? b.price : 0);}, 0);
    }
}

export type CatalogChangeEvent = {
    catalog: Item[];
};
