// модель товара
interface IItem {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// данные заказа для отправки на бэкенд
interface IOrder extends IOrderForm,  IContactForm {
    total: number; 
    items: Uuid[]; 
} 

// модель состояния приложения
interface IAppState {
    catalog: IItem[];
    basket: Uuid[];
    order: IOrder | null;
    orderformErrors: OrderFormErrors;
    contactformErrors: ContactFormErrors;
}

type PaymentType = 'online' | 'ondelivery';

type Uuid = string;

// данные для отображения товара в корзине
type IBasketItem = Pick<IItem, 'title' | 'price'>

// главная страница
interface IMainPage {
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

type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>

type ContactFormErrors = Partial<Record<keyof IContactForm, string>>

// ответ сервера в случае удачного оформления заказа
interface IOrderResult {
    id: Uuid;
    total: number;
}

// ответ сервера для списка объектов
type ApiListResponse<Type> = {
    total: number,
    items: Type[]
}