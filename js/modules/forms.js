function forms() {
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
        let res = await fetch(url, {
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

            let statusMessage = document.createElement('img');
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

            // const obj = {}; //создаем пустой обьект
            // formData.forEach(function(value, key) { //необходимо превратить FormData в формат JSON, с помощью forEach переберем formData и все данные поместим в obj
            //     obj[key] = value;
            // });

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

    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));
}
module.exports = forms;