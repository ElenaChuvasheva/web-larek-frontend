export interface IItem {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

type PaymentType = 'online' | 'ondelivery';

type Uuid = string;

export interface IOrder {
    payment: PaymentType;
    email: string;
    phone: string;
    address: string,
    total: number;
    items: Uuid[];
}

export interface IAppState {
    catalog: IItem[];
    shoppingCart: Uuid[];
    order: IOrder | null;
}

export type IBasketItem = Pick<IItem, 'title' | 'price'> & { isInShoppingCart: boolean; }