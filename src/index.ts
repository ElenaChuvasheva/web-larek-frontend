import './scss/styles.scss';

import { AppState, CatalogChangeEvent } from "./components/AppData";
import { Card } from './components/Card';
import { LarekAPI } from './components/LarekAPI';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { IItem } from './types';
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const appData = new AppState({}, events);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


api.getItemList()
    .then((result) => {appData.setCatalog(result);})
    .catch(err => {
        console.error(err);
    });

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
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (!appData.isInBasket(item)) {
                appData.addBasket(item);
                card.inBasket=true;
            }
            else {
                appData.removeBasket(item);
                card.inBasket=false;
            }            
        }
    });
    card.inBasket=appData.isInBasket(item);
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
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});
