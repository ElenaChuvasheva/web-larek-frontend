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

...

### Классы

#### Модели данных

##### Класс Model (родительский)

Базовый для остальных моделей. Реализует паттерн Event Emitter. Имеет метод emitChanges, позволяющий оповестить об изменениях в модели.

##### Класс Item

Содержит данные карточки товара

##### Класс AppState

Описывает состояние приложения. Хранит данные карточек товара, выводимых на главной странице, состояние заказа, корзины. Содержит методы добавления товара в корзину и удаления, обновления каталога, получения количества и стоимости товаров в корзине, получения данных выбранного товара по id, определения наличия товара в корзине, валидации форм, очистки корзины и заказа.

#### Компоненты представления

##### Класс Component (родительский)

...

### События

- items:changed - при обновлении списка товаров в данных, вызывает перерисовку списка товаров
- shoppingCart:changed - вызывает перерисовку количества товаров в корзине на главной
- item:click - открывает модальное окно с подробной карточкой товара
- item:toShoppingCart - при нажатии кнопки добавления в корзину. записывает товар в корзину модели данных
- item:fromShoppingCart - при нажатии кнопки удаления из корзины. удаляет товар из корзины модели данных
- shoppingCart:click - открывает модальное окно с корзиной при клике на неё
- modal:close - вызывает закрытие модального окна, очищает его данные
- basket:submit - при нажатии "Оформить" в корзине. открывает модальное окно с оформлением заказа и закрывает корзину
- order:submit - при нажатии "Далее" в окне заказа. записывает адрес, открывает модальное окно контактов и закрывает предыдущее окно
- contacts:submit - при нажатии "Оформить" в окне контактов. записывает контакты, отправляет заказ на сервер
- order:success - при получении ответа 20x от сервера. открывает окно "Заказ успешно оформлен", очищает данные корзины и заказа
- orderFormErrors:change - при начале ввода адреса, валидирует форму заказа
- contactFormError:change - при начале ввода адреса, валидирует форму контактов
