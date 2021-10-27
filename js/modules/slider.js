function slider({ container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field }) {
    //---Слайдер----------------------------

    let slideIndex = 1; // индекс, кот определяет текущее положение в слайдере
    let offset = 0;

    const slides = document.querySelectorAll(slide),
        slider = document.querySelector(container),
        prev = document.querySelector(prevArrow),
        next = document.querySelector(nextArrow),
        total = document.querySelector(totalCounter),
        current = document.querySelector(currentCounter),
        slidesWrapper = document.querySelector(wrapper), //создаем для второго варианта слайдера
        slidesField = document.querySelector(field), //создаем для второго варианта слайдера
        width = window.getComputedStyle(slidesWrapper).width; //создаем для второго варианта слайдера

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

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }
}
export default slider;