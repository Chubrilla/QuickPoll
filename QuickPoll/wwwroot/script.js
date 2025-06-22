//const API_URL = 'http://localhost:5000/api/polls';
//
//// Универсальная функция для показа сообщений
//const showMessage = (text, isError = false) => {
//    const messageEl = document.getElementById('message');
//    if (!messageEl) return;
//
//    messageEl.textContent = text;
//    messageEl.className = isError ? 'error' : 'success';
//    messageEl.style.display = 'block';
//
//    setTimeout(() => {
//        messageEl.style.display = 'none';
//    }, 3000);
//};
//
//// Функция для безопасного получения элемента
//const getElement = (id) => {
//    const element = document.getElementById(id);
//    if (!element) console.error(`Element with id '${id}' not found`);
//    return element;
//};
//
//// Обработчик главной страницы
//const initHomePage = () => {
//    const form = getElement('find');
//    if (!form) return;
//
//    form.addEventListener('submit', (e) => {
//        e.preventDefault();
//        const pollId = getElement('pollId')?.value.trim();
//        if (pollId) {
//            window.location.href = `poll.html?id=${pollId}`;
//        } else {
//            showMessage('Введите ID опроса', true);
//        }
//    });
//};
//
//// Обработчик страницы создания опроса
//const initCreatePage = () => {
//    const form = getElement('createForm');
//    if (!form) return;
//
//    const optionsContainer = getElement('optionsContainer');
//    if (!optionsContainer) {
//        console.error('Контейнер для вариантов не найден');
//        return;
//    }
//
//    // Функция для удаления варианта
//    const setupRemoveHandler = (removeButton) => {
//        removeButton.addEventListener('click', (e) => {
//            if (optionsContainer.children.length > 2) {
//                e.target.closest('.option').remove();
//            } else {
//                showMessage('Должно быть минимум 2 варианта', true);
//            }
//        });
//    };
//
//    // Назначаем обработчики для существующих кнопок удаления
//    document.querySelectorAll('#optionsContainer .remove').forEach(setupRemoveHandler);
//
//    // Добавление новых вариантов
//    getElement('addOption')?.addEventListener('click', () => {
//        const count = optionsContainer.children.length + 1;
//        const optionEl = document.createElement('div');
//        optionEl.className = 'option';
//        optionEl.innerHTML = `
//            <input type="text" placeholder="Вариант ${count}" required>
//            <button type="button" class="remove">×</button>
//        `;
//
//        optionsContainer.appendChild(optionEl);
//        setupRemoveHandler(optionEl.querySelector('.remove'));
//    });
//
//    // Отправка формы
//    form.addEventListener('submit', async (e) => {
//        e.preventDefault();
//
//        try {
//            const question = getElement('question')?.value.trim();
//            const options = Array.from(optionsContainer.querySelectorAll('input'))
//                .map(input => input.value.trim())
//                .filter(opt => opt);
//
//            if (!question) throw new Error('Введите вопрос');
//            if (options.length < 2) throw new Error('Добавьте минимум 2 варианта');
//
//            const response = await fetch(API_URL, {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({
//                    Question: question,
//                    Options: options
//                })
//            });
//
//            if (!response.ok) {
//                const error = await response.json();
//                throw new Error(error.message || 'Ошибка сервера');
//            }
//
//            const { id } = await response.json();
//            window.location.href = `poll.html?id=${id}`;
//
//        } catch (error) {
//            showMessage(error.message, true);
//            console.error('Create error:', error);
//        }
//    });
//};
//
//// Обработчик страницы опроса
//const initPollPage = async () => {
//    if (!getElement('pollQuestion')) return;
//
//    // Получаем ID опроса из URL
//    const urlParams = new URLSearchParams(window.location.search);
//    const pollId = urlParams.get('id');
//
//    if (!pollId) {
//        window.location.href = 'index.html';
//        return;
//    }
//
//    // Устанавливаем URL для копирования
//    const pollUrl = getElement('pollUrl');
//    if (pollUrl) pollUrl.value = window.location.href;
//
//    // Загрузка данных опроса
//    const loadPoll = async () => {
//        try {
//            const response = await fetch(`${API_URL}/${pollId}`);
//            if (!response.ok) {
//                if (response.status === 404) {
//                    throw new Error('Опрос не найден');
//                }
//                throw new Error(`Ошибка ${response.status}`);
//            }
//
//            const poll = await response.json();
//            return poll;
//
//        } catch (error) {
//            showMessage(error.message, true);
//            console.error('Load error:', error);
//            return null;
//        }
//    };
//
//    // Отображение результатов
//    const showResults = (poll) => {
//        const container = getElement('pollResults');
//        if (!container) return;
//
//        container.innerHTML = '<h3>Результаты:</h3>';
//
//        // Вычисляем общее количество голосов
//        const totalVotes = poll.Options.reduce((sum, opt) => sum + (opt.Votes || 0), 0);
//
//        // Создаем элементы результатов
//        poll.Options.forEach(option => {
//            const percent = totalVotes > 0
//                ? Math.round(((option.Votes || 0) / totalVotes) * 100)
//                : 0;
//
//            const item = document.createElement('div');
//            item.className = 'result-item';
//            item.innerHTML = `
//                <p>${option.Text || 'Без названия'}: ${option.Votes || 0} (${percent}%)</p>
//                <div class="result-bar" style="width: ${percent}%"></div>
//            `;
//            container.appendChild(item);
//        });
//    };
//
//    // Голосование
//    const vote = async (optionId) => {
//        try {
//            const response = await fetch(`${API_URL}/${pollId}/vote`, {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ OptionId: optionId })
//            });
//
//            if (!response.ok) {
//                const error = await response.json();
//                throw new Error(error.message || 'Ошибка голосования');
//            }
//
//            showMessage('Ваш голос учтен!');
//            const updatedPoll = await loadPoll();
//            if (updatedPoll) renderPoll(updatedPoll);
//
//        } catch (error) {
//            showMessage(error.message, true);
//            console.error('Vote error:', error);
//        }
//    };
//
//    // Рендеринг опроса
//    const renderPoll = (poll) => {
//        if (!poll) return;
//
//        // Установка вопроса
//        const questionEl = getElement('pollQuestion');
//        if (questionEl) questionEl.textContent = poll.Question || 'Без названия';
//
//        // Очистка и создание вариантов
//        const optionsContainer = getElement('pollOptions');
//        if (optionsContainer) {
//            optionsContainer.innerHTML = '';
//
//            poll.Options.forEach(option => {
//                const btn = document.createElement('button');
//                btn.className = 'option-btn';
//                btn.textContent = `${option.Text || 'Без названия'} (${option.Votes || 0})`;
//                btn.addEventListener('click', () => vote(option.Id));
//                optionsContainer.appendChild(btn);
//            });
//        }
//
//        // Показ результатов
//        showResults(poll);
//    };
//
//    // Копирование ссылки
//    getElement('copyBtn')?.addEventListener('click', () => {
//        const urlInput = getElement('pollUrl');
//        if (!urlInput) return;
//
//        urlInput.select();
//        document.execCommand('copy');
//        showMessage('Ссылка скопирована!');
//    });
//
//    // Загрузка и отображение опроса
//    const poll = await loadPoll();
//    renderPoll(poll);
//};

// Инициализация приложения после загрузки DOM
//document.addEventListener('DOMContentLoaded', () => {
//    // Определяем текущую страницу и инициализируем соответствующий обработчик
//    if (document.getElementById('find')) initHomePage();
//    if (document.getElementById('createForm')) initCreatePage();
//    if (document.getElementById('pollQuestion')) initPollPage();
//});