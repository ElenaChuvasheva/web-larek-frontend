// модель товара
export interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// карточка товара
export interface ICard extends IItem {
	index?: number;
}

// для всех видов форм в проекте
export interface IAnyForm extends IOrderForm, IContactsForm {}

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

// для id
export type Uuid = string;

// главная страница
export interface IMainPage {
	cartCounter: number;
	catalog: HTMLElement[];
}

// для формы заказа
export interface IOrderForm {
	address: string;
	payment: string;
}

// для формы контактов
export interface IContactsForm {
	email: string;
	phone: string;
}

// ошибки формы заказа и контактов
export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>;
export type ContactsFormErrors = Partial<Record<keyof IContactsForm, string>>;

// ответ сервера в случае удачного оформления заказа
export interface IOrderResult {
	id: Uuid;
	total: number;
}

// ответ сервера для списка объектов
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

// имена форм
export type FormName = 'order' | 'contacts';
