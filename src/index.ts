import './scss/styles.scss';

import { AppState } from './components/AppData';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { Contacts } from './components/Contacts';
import { LarekAPI } from './components/LarekAPI';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';
import { EventEmitter } from './components/base/events';
import { Form } from './components/common/Form';
import { Modal } from './components/common/Modal';
import { FormName, IAnyForm, IContactsForm, IItem, IOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const appData = new AppState({}, events);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

const onFormErrorsChange = (input: {
	errors: Partial<IAnyForm>;
	form: Form<IAnyForm>;
}) => {
	input.form.valid = Object.values(input.errors).every((text) => {
		return !text;
	});
	input.form.errors = Object.values(input.errors)
		.filter((i) => !!i)
		.join('; ');
};

const renderForm = (formName: FormName) => {
	const formFields = appData.getFormFields(formName);
	const form = formName === 'order' ? order : contacts;
	modal.render({
		content: form.render({
			valid: false,
			errors: [],
			...formFields,
		}),
	});
	if (
		Object.values(formFields).some((data) => {
			return data;
		})
	) {
		appData.validate(formName);
	}
};

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
});

events.on('card:select', (item: IItem) => {
	const card: Card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.isInBasket(item)) {
				appData.addBasket(item);
			} else {
				appData.removeBasket(item);
			}
			card.inBasket = appData.isInBasket(item);
		},
	});
	card.inBasket = appData.isInBasket(item);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

events.on('basket:changed', () => {
	page.counter = appData.getNumberBasket();
	basket.items = appData.basket.map((item, index) => {
		const card: Card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeBasket(item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	const totalNumber = appData.getTotalBasket();
	basket.total = totalNumber;
	basket.disableButton(!totalNumber);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	modal.render({ content: basket.render() });
});

events.on('order:open', () => {
	appData.cleanOrderItems();
	renderForm('order');
});

events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IAnyForm; value: string }) => {
		appData.setField(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	onFormErrorsChange({ errors, form: order });
});

events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	onFormErrorsChange({ errors, form: contacts });
});

events.on('order:submit', () => {
	renderForm('contacts');
});

events.on('contacts:submit', () => {
	appData.prepareOrder();
	api
		.postOrder(appData.getOrderData())
		.then(() => {
			modal.render({
				content: success.render({
					total: appData.getTotalBasket(),
				}),
			});
			appData.cleanBasketState();
		})
		.catch((err) => {
			console.error(err);
			console.log(appData.getOrderData());
		})
		.finally(() => {
			appData.cleanOrderItems();
		});
});

events.on('success:submit', () => modal.close());

api
	.getItemList()
	.then((result) => {
		appData.setCatalog(result);
	})
	.catch((err) => {
		console.error(err);
	});
