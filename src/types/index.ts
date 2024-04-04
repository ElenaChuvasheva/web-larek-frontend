// модель товара
export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICard extends IItem {
    index?: number;
}

export interface IAnyForm extends IOrderForm,  IContactsForm {};

// данные заказа для отправки на бэкенд
export interface IOrder extends IAnyForm {
    total: number;
    items: Uuid[]; 
} 

// модель состояния приложения
export interface IAppState {
    catalog: IItem[];
    basket: IItem[];
    order: IOrder;
    orderFormErrors: OrderFormErrors;
    contactsFormErrors: ContactsFormErrors;
}

export type PaymentType = string;

export type Uuid = string;

// данные для отображения товара в корзине
export type IBasketItem = Pick<IItem, 'title' | 'price'>

// главная страница
export interface IMainPage {
    cartCounter: number;
    catalog: HTMLElement[];
}

// для формы заказа
export interface IOrderForm {
    address: string;
    payment: PaymentType;
}

// для формы контактов
export interface IContactsForm {
    email: string;
    phone: string;
}

export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>

export type ContactsFormErrors = Partial<Record<keyof IContactsForm, string>>

// ответ сервера в случае удачного оформления заказа
export interface IOrderResult {
    id: Uuid;
    total: number;
}

// ответ сервера для списка объектов
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
}

export type FormName = 'order' | 'contacts';