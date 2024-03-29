// модель товара
interface IItemModel {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

// данные заказа для отправки на бэкенд
type IOrder = {
    payment: PaymentType;
    email: string;
    phone: string;
    address: string,
    total: number;
    items: Uuid[];
}

// модель состояния приложения
interface IAppStateModel {
    catalog: IItemModel[];
    shoppingCart: Uuid[];
    order: IOrder | null;
}

type PaymentType = 'online' | 'ondelivery';

type Uuid = string;

// данные для отображения товара в корзине
type IShoppingCartItem = Pick<IItemModel, 'title' | 'price'>

// главная страница
interface IMainPage {
    cartCounter: number;
    catalog: HTMLElement[];    
}

// для отображения корзины
interface IShoppingCart {
    items: HTMLElement[];
    total: number;
}

// для формы заказа
interface IOrderForm {
    address: string;
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