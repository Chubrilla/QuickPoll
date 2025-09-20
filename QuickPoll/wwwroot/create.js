const API_URL = 'http://localhost:5000/api/polls';


const showMessage = (text, isError = false) => {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = isError ? 'error' : 'success';
    messageEl.style.display = 'block';
    setTimeout(() => messageEl.style.display = 'none', 3000);
};


document.getElementById('addOption').addEventListener('click', () => {
    const optionsContainer = document.getElementById('optionsContainer');
    const count = optionsContainer.children.length + 1;
    const optionEl = document.createElement('div');
    optionEl.className = 'option';
    optionEl.innerHTML = `
                    <input type="text" placeholder="Вариант ${count}" required>
                    <button type="button" class="remove">×</button>
                `;
    optionsContainer.appendChild(optionEl);
    optionEl.querySelector('.remove').addEventListener('click', () => {
        if (optionsContainer.children.length > 2) {
            optionEl.remove();
        } else {
            showMessage('Должно быть минимум 2 варианта', true);
        }
    });
});


document.querySelectorAll('#optionsContainer .remove').forEach(button => {
    button.addEventListener('click', () => {
        const optionsContainer = document.getElementById('optionsContainer');
        if (optionsContainer.children.length > 2) {
            button.closest('.option').remove();
        } else {
            showMessage('Должно быть минимум 2 варианта', true);
        }
    });
});


document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = document.getElementById('question').value.trim();
    const options = Array.from(document.querySelectorAll('#optionsContainer input'))
        .map(input => input.value.trim())
        .filter(opt => opt);

    if (!question) {
        showMessage('Введите вопрос', true);
        return;
    }
    if (options.length < 2) {
        showMessage('Добавьте минимум 2 варианта', true);
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Question: question, Options: options })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка сервера');
        }

        const { id } = await response.json();
        window.location.href = `poll.html?id=${id}`;
    } catch (error) {
        showMessage(error.message, true);
        console.error('Ошибка создания опроса:', error);
    }
});