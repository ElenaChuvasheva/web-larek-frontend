import { IItem } from "../types";
import { settings } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardForList extends Component<IItem> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
    }

    private getCategoryClass(value: string) {
        const categorySetting = settings[value] || 'unknown';
        return 'card__category_' + categorySetting;
    }


    set title(value: string) {
        this._title.textContent = value;
    }
    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: string) {
        this._price.textContent = value ? value + ' синапсов' : 'Бесценно';
    }
    get price(): string {
        return this._price.textContent;
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this._category.textContent = value;
        const backgroundColorClass = this.getCategoryClass(value);
        this._category.classList.add(backgroundColorClass);
    }
}
