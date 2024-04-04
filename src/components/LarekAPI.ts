import { ApiListResponse, IItem, IOrder, IOrderResult } from '../types';
import { Api } from './base/api';

export interface ILarekAPI {
	getItemList: () => Promise<IItem[]>;
}

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItemList(): Promise<IItem[]> {
		return this.get('/product').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	postOrder(orderData: IOrder): Promise<IOrderResult> {
		return this.post('/order', orderData).then((data: IOrderResult) => data);
	}
}
