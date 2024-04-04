import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrderForm> {
	protected buttons: HTMLButtonElement[] = [];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.buttons = [
			container.elements.namedItem('card') as HTMLButtonElement,
			container.elements.namedItem('cash') as HTMLButtonElement,
		];

		this.buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.buttons.forEach((item) =>
					item.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');
				this.onInputChange('payment', button.name);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		const currentButton = this.buttons.find((button, index, array) => {
			return button.name === value;
		});
		if (currentButton) {
			currentButton.classList.add('button_alt-active');
			this.onInputChange('payment', currentButton.name);
		}
	}
}
