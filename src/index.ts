import './scss/styles.scss';

import { AppState, CatalogChangeEvent } from "./components/AppData";
import { Card } from './components/Card';
import { LarekAPI } from './components/LarekAPI';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from './utils/utils';
import { IItem } from './types';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const appData = new AppState({}, events);
const page = new Page(document.body, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

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
    console.log('hello from card:select', item);
});
