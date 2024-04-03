import { ContactsFormErrors, IAppState, IItem, IOrder, OrderFormErrors } from "../types";
import { Model } from "./base/Model";
import { IAnyForm } from "../types";
import { IEvents } from "./base/events";

export class Item extends Model<IItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export class AppState extends Model<IAppState> {
    catalog: IItem[];
    basket: IItem[];
    order: IOrder;
    orderFormErrors: OrderFormErrors;
    contactsFormErrors: ContactsFormErrors;

    constructor(data: Partial<IAppState>, protected events: IEvents) {
        super(data, events);
        this.catalog = [];
        this.basket = [];
        this.cleanOrderState();
    }

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

    setField(field: keyof IAnyForm, value: string) {
        this.order[field] = value;

        if (this.validate('order')) {
            this.events.emit('order:ready', this.order);
        }

        if (this.validate('contacts')) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    validate(formType: 'order' | 'contacts') {
        const errors = (formType === 'order') ? this.setOrderErrors() : this.setContactsErrors();
        this.events.emit(formType + 'FormErrors:change', errors);
        return Object.keys(errors).length === 0;
    }

    setOrderErrors() {
        const errors: OrderFormErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }  
        if (!this.order.address) {
            errors.address = 'Укажите адрес';
        }
        this.orderFormErrors = errors;
        return errors;
      }

    setContactsErrors() {
        const errors: ContactsFormErrors = {};
        if (!this.order.phone) {
            errors.phone = 'Укажите телефон';
        }  
        if (!this.order.email) {
            errors.email = 'Укажите емейл';
        }
        this.contactsFormErrors = errors;
        return errors;
    }

    cleanOrderState() {
        this.order = {
            address: '',
            payment: '',
            email: '',
            phone: '',
            total: 0,
            items: []
        }
        this.orderFormErrors = {};
        this.contactsFormErrors = {};
    }
}

export type CatalogChangeEvent = {
    catalog: Item[];
};
