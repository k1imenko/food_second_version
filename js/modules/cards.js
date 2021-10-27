import { getResource } from '../services/services';

function cards() {
    //Используем классы для карточек

    class Card {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) { //задаем в качестве аргументов. то из чего состоит карточка
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27; //обменный курс для метода changetToUAH()
            this.changetToUAH();
        }

        changetToUAH() { //метод конвертации валюты
            this.price = this.price * this.transfer;
        }

        render() { //задаем верстку
            const element = document.createElement('div'); //оборачиваем всю структуру карточки в один div
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class=${this.title}>Меню “Премиум”</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        `;
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new Card(img, altimg, title, descr, price, ".menu .container").render();
            });
        });
}

export default cards;