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

// данные заказа для отправки на бэкенд
export interface IOrder extends IOrderForm,  IContactForm {
    total: number; 
    items: Uuid[]; 
} 

// модель состояния приложения
export interface IAppState {
    catalog: IItem[];
    basket: IItem[];
    order: IOrder | null;
    orderformErrors: OrderFormErrors;
    contactformErrors: ContactFormErrors;
}

type PaymentType = 'online' | 'ondelivery';

export type Uuid = string;

// данные для отображения товара в корзине
export type IBasketItem = Pick<IItem, 'title' | 'price'>

// главная страница
export interface IMainPage {
    cartCounter: number;
    catalog: HTMLElement[];
}

// для отображения корзины
interface IBasket {
    items: HTMLElement[];
    total: number;
}

// для формы заказа
interface IOrderForm {
    address: string;
    payment: PaymentType;
}

// для формы контактов
interface IContactForm {
    email: string;
    phone: string;
}

// состояние формы
interface IFormState {
    valid: boolean | null;
    errors: string[];
}

export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>

export type ContactFormErrors = Partial<Record<keyof IContactForm, string>>

// ответ сервера в случае удачного оформления заказа
interface IOrderResult {
    id: Uuid;
    total: number;
}

// ответ сервера для списка объектов
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
}