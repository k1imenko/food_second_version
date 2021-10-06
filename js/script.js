window.addEventListener('DOMContentLoaded', () => {

    //Табы

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() { //скрываем неактивные табы
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active'); //удаляем класс активности у не активных табов
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Таймер

    const deadline = '2021-09-01';

    function getTimeRemaining(endtime) {
        const tech = Date.parse(endtime) - Date.parse(new Date()), //при запуске функции мы получим разницу в миллисекундах между датами
            days = Math.floor(tech / (1000 * 60 * 60 * 24)), //получаем количество дней до окончания акции(в скобках получили количетво миллисекунд в одних сутках)(1000 миллисекунд умножаем на 60 секунд, после умножаем на 60 минут и умножаем на 24 часа в сутках)
            hours = Math.floor((tech / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((tech / 1000 / 60) % 60),
            seconds = Math.floor((tech / 1000) % 60);

        return {
            'total': tech,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) { //подставляем ноль в таймер если число в счетчике состоит из одного символа
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { //устанавливаем таймер на странице
        const timer = document.querySelector(selector), //создаем переменные, в которые помещаются элементы со страницы
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000); //через каждую секунду будем запускать функцию updateClock

        updateClock(); //убираем показ даты таймера из верстки, чтобы сразу показывалось текущее вермя до окончания акции

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //Модальные окна

    const modalTrigger = document.querySelectorAll('[data-modal]'), //обращаемся по назначенному в верстке аттрибуту
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId); //отключаем показ модального окна если оно уже было открыто пользователем ранее
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() { // 
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => { //закрываем модальное окно по клику в пустую область
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => { //закрываем модальное окно клавишей Esc
        if (e.code === 'Escape' && modal.classList.contains('show')) { //клавиша Esc сработает только в случае если модальное окно открыто
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000); //вызываем модальное окно через определенное время

    function showModalByScroll() { //при пролистывании страницы до конца будет показываться модальное окно
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //когда модальное окно показалось пользователь один раз, больше оно показываться при скролле сайта не будет 
        }
    }

    window.addEventListener('scroll', showModalByScroll);

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

    const getResource = async(url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => { //сокращенное написание нижеслед кода
            data.forEach(({ img, altimg, title, descr, price }) => {
                new Card(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // new Card(
    //     "img/tabs/vegy.jpg",
    //     "vegy",
    //     'Меню "Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     9,
    //     '.menu .container', //сюда будут пушиться динамически созданные элементы верстки 
    // ).render();
    // new Card(
    //     "img/tabs/elite.jpg",
    //     "elite",
    //     'Меню "“Премиум”"',
    //     'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    //     14,
    //     '.menu .container' //сюда будут пушиться динамически созданные элементы верстки
    // ).render();
    // new Card(
    //     "img/tabs/post.jpg",
    //     "post",
    //     'Меню "Постное"',
    //     'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    //     21,
    //     '.menu .container' //сюда будут пушиться динамически созданные элементы верстки
    // ).render();

    //Создание формы

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => { //подвязываем на каждую form функцию postDatа, которая будет обработчиком события при отправке 
        bindPostData(item);
    });

    const postData = async(url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) { //функция отправки 
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `; //выводим пользователю сообщение   
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // const request = new XMLHttpRequest(); //отправляем данные без перезагрузки страницы с помощью XMLHttpRequest 
            // request.open('POST', 'server.php'); //исп метод POST и ссылаемся на файл server.php

            const obj = {}; //создаем пустой обьект
            formData.forEach(function(value, key) { //необходимо превратить FormData в формат JSON, с помощью forEach переберем formData и все данные поместим в obj
                obj[key] = value;
            });

            // const json = JSON.stringify(obj); //превращаем обычный обьект в JSON при помощи stringify()

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data); //в консоль данные которые вернул сервер
                    showThanksModal(message.success);
                    statusMessage.remove(); //удаляем со страницы блок с сообщением об отправке 
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset(); //очищаем инпуты модального окна после отправки данных
                });
        });
    }

    function showThanksModal(message) { //создаем окно с благодарность после отправки формы
        const previousModalDialog = document.querySelector('.modal__dialog');

        previousModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
    `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            previousModalDialog.classList.add('show');
            previousModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));


    //---Слайдер----------------------------

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'), //создаем для второго варианта слайдера
        slidesField = document.querySelector('.offer__slider-inner'), //создаем для второго варианта слайдера
        width = window.getComputedStyle(slidesWrapper).width; //создаем для второго варианта слайдера

    let slideIndex = 1; // индекс, кот определяет текущее положение в слайдере
    let offset = 0;

    if (slides.length < 10) { //меняем индексы при перелистывании изображений(prev)
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    //!---первый вариант  ----------
    // showSlides(slideIndex);

    // if (slides.length < 10) { //меняем индексы при перелистывании изображений(prev)
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach(item => item.style.display = 'none'); //показ первого слайда на странице и скрытие остальных 

    //     slides[slideIndex - 1].style.display = 'block'; //отображаем пользователю правильный по порядку слайд 

    //     if (slides.length < 10) { //меняем индексы при перелистывании изображений(next)
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }


    // function plusSlides(n) { //при перелистывании слайдера увеличиваем счетчик на один индекс
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // });
    //!---------------------------


    //!---второй вариант слайдера----------

    slidesField.style.width = 100 * slides.length + '%'; //устанавливаем ширину блока с изображениями
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden'; //скрываем все элементы которые не попадают в область видимости(создают полосу прокрутки)


    slides.forEach(slide => {
        slide.style.width = width;
    }); //фиксируем ширину для каждого изображения


    //----создаем точки навигации под слайдом(слайдер-карусель)-----------------------

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = []; //создаем массив для того чтобы динамически изменялся слайдер на странице

    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) { //добавляем стили активному в текущий момент слайду 
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot); //добавляем стиль чтобы динамически изменялся слайдер на странице
    }

    //---------------------------

    function zeroAdd() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function slideChange() {
        dots.forEach(dot => dot.style.opacity = '.5'); //динамически меняем слайдер на странице
        dots[slideIndex - 1].style.opacity = 1;
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    next.addEventListener('click', () => {
        if (offset == deleteNotDigits(width) * (slides.length - 1)) { //устанавливаем ширину строки с изобр и переводим в числовой тип данных
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        zeroAdd();
        slideChange();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) { //устанавливаем ширину строки с изобр и переводим в числовой тип данных
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        zeroAdd();
        slideChange();
    });

    dots.forEach(dot => { //изменяем активный индикатор при клике мышкой на него
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px`;

            zeroAdd();
            slideChange();
        });
    });

    //-----------Калькуялтор--------------

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        let sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        let ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active')

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio); //формулу берем из интернета
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio')); //запоминаем введенные ранне пользователем данные 
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', +e.target.getAttribute('id')); //запоминаем введенные ранне пользователем данные 
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) { //при вводе не числа в инпут появляется красная обводка
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});