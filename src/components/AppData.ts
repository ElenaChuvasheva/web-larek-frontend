import { ContactsFormErrors, FormName, IAnyForm, IAppState, IItem, IOrder, OrderFormErrors } from "../types";
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
    order: IOrder = {
        address: '',
        payment: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
    orderFormErrors: OrderFormErrors = {};
    contactsFormErrors: ContactsFormErrors = {};

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

    validate(formType: FormName) {
        const errors = (formType === 'order') ? this.setOrderErrors() : this.setContactsErrors();
        this.events.emit(formType + 'FormErrors:change', errors);
        return Object.keys(errors).length === 0;
    }

    getFormFields(formType: FormName) {
        return (formType === 'order') ? {payment: this.order.payment, address: this.order.address} : {email: this.order.email, phone: this.order.phone}
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

    cleanOrderItems() {
        this.order.total = 0;
        this.order.items = [];
        this.orderFormErrors = {};
        this.contactsFormErrors = {};
    }

    cleanBasketState() {
        this.basket = [];
        this.emitChanges('basket:changed');
    }

    prepareOrder() {
        this.order.total = this.getTotalBasket();
        this.basket.forEach((item) => {
            if (item.price) {
                this.order.items.push(item.id);
            }
        });
    }

    getOrderData() {
        return structuredClone(this.order);
    }

    getAddress() {
        return this.order.address;
    }

    getPayment() {
        return this.order.payment;
    }

    getEmail() {
        return this.order.email;
    }

    getPhone() {
        return this.order.phone;
    }
}

export type CatalogChangeEvent = {
    catalog: Item[];
};
