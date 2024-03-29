# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

### Интерфейсы

```
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
    basket: Uuid[];
    order: IOrder | null;
    orderformErrors: OrderFormErrors;
    contactformErrors: ContactFormErrors;
}

type PaymentType = 'online' | 'ondelivery';

type Uuid = string;

// данные для отображения товара в корзине
type IBasketItem = Pick<IItemModel, 'title' | 'price'>

// главная страница
interface IMainPage {
    cartCounter: number;
    catalog: HTMLElement[];
}

// для отображения корзины
interface IBasket {
    items: HTMLElement[];
    total: number;
}

// для формы заказа
interface IOrderForm {
    address: string;
    payment: PaymentType;
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

// ошибки формы заказа
type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>

// ошибки формы контактов
type ContactFormErrors = Partial<Record<keyof IContactForm, string>>
```

### Классы

#### Модели данных

##### Класс Model (родительский)

Базовый для остальных моделей. Реализует паттерн Event Emitter. Имеет метод emitChanges, позволяющий оповестить об изменениях в модели.

##### Класс Item

Содержит данные карточки товара

##### Класс AppState

Описывает состояние приложения. Хранит данные карточек товара, выводимых на главной странице, состояние заказа, корзины. Содержит методы добавления товара в корзину (addToBasket) и удаления (deleteFromBasket), обновления каталога (setCatalog), получения количества (getNumberBasket) и стоимости товаров (getTotalBasket) в корзине, получения данных выбранного товара по id (getItemById), определения наличия товара в корзине (isInBasket), валидации форм (validateOrderForm, validateContactForm), очистки корзины (clearBasket) и заказа (clearOrder).

#### Компоненты представления

##### Класс Component (родительский)
Содержит элемент контейнера и методы управления - переключение класса (toggleClass), установка текстового содержимого (setText), смена статуса блокировки (setDisabled), установка изображения (setImage), получение обработанного элемента-контейнера (render).

##### Класс Page
Описывает главную страницу. Содежит методы задания значения счётчика корзины (counter) и карточек (catalog).

##### Класс Card
Карточка товара. Содержит сеттеры и геттеры полей карточки: id, title, image, category, price, description.

##### Класс Basket
Корзина. Содержит сеттеры и геттеры для общей стоимости (total) и списка товаров (items).

##### Класс Form (родительский для всех форм)
Содержит метод valid, блокирующий или разблокирующий кнопку отправки в зависимости от переданного значения, метод errors - задание текста ошибок формы.

##### Класс OrderForm
Определяет форму заказа. Содержит поле address.

##### Класс ContactForm
Определяет форму контактов. Содержит поля email и phone.

##### Класс Modal
Определяет модальное окно. Содержит методы открытия (open) и закрытия (close), сеттер для содержания окна.

#### Взаимодействие с сервером
##### Класс Api
Реализует обмен данными с сервером с помощью методов get и post.

### События

- items:changed - при обновлении списка товаров в данных, вызывает перерисовку списка товаров
- basket:changed - вызывает перерисовку количества товаров в корзине на главной
- item:click - открывает модальное окно с подробной карточкой товара
- item:toBasket - при нажатии кнопки добавления в корзину. записывает товар в корзину модели данных
- item:fromBasket - при нажатии кнопки удаления из корзины. удаляет товар из корзины модели данных
- basket:click - открывает модальное окно с корзиной при клике на неё
- modal:close - вызывает закрытие модального окна, очищает его данные
- basket:submit - при нажатии "Оформить" в корзине. открывает модальное окно с оформлением заказа и закрывает корзину
- order:submit - при нажатии "Далее" в окне заказа. записывает адрес, открывает модальное окно контактов и закрывает предыдущее окно
- contacts:submit - при нажатии "Оформить" в окне контактов. записывает контакты, отправляет заказ на сервер
- order:success - при получении ответа 20x от сервера. открывает окно "Заказ успешно оформлен", очищает данные корзины и заказа
- orderFormErrors:change - при начале ввода адреса, валидирует форму заказа
- contactFormError:change - при начале ввода адреса, валидирует форму контактов
