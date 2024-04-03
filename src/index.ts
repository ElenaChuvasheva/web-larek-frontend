import './scss/styles.scss';

import { AppState, CatalogChangeEvent } from "./components/AppData";
import { Card } from './components/Card';
import { LarekAPI } from './components/LarekAPI';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { IItem } from './types';
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement, priceString } from './utils/utils';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const appData = new AppState({}, events);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {        
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category
        });
    });
});

events.on('card:select', (item: IItem) => {
    const card: Card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (!appData.isInBasket(item)) {
                appData.addBasket(item);                
            }
            else {
                appData.removeBasket(item);                
            }
            card.inBasket = appData.isInBasket(item);
        }
    });
    card.inBasket = appData.isInBasket(item);
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
        })
    });
});

events.on('basket:changed', () => {
    page.counter = appData.getNumberBasket();
    basket.items = appData.basket.map((item, index) => {        
        const card: Card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeBasket(item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    const totalNumber = appData.getTotalBasket();
    basket.total = priceString(totalNumber);
    basket.disableButton(!Boolean(totalNumber));
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('basket:open', () => {
    modal.render({content: basket.render()});
});

api.getItemList()
    .then((result) => {appData.setCatalog(result);})
    .catch(err => {
        console.error(err);
    });
