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
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

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

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => { //закрываем модальное окно по клику в пустую область
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => { //закрываем модальное окно клавишей Esc
        if (e.code === 'Escape' && modal.classList.contains('show')) { //клавиша Esc сработает только в случае если модальное окно открыто
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 5000); //вызываем модальное окно через определенное время

    function showModalByScroll() { //при пролистывании страницы до конца будет показываться модальное окно
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //когда модальное окно показалось пользователь один раз, больше оно показываться при скролле сайта не будет 
        }
    }

    window.addEventListener('scroll', showModalByScroll);
});