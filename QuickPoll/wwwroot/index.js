const API_URL = 'http://localhost:5000/api/polls';


const showMessage = (text, isError = false) => {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = isError ? 'error' : 'success';
    messageEl.style.display = 'block';
    setTimeout(() => messageEl.style.display = 'none', 3000);
};


document.getElementById('find').addEventListener('submit', (e) => {
    e.preventDefault();
    const pollId = document.getElementById('pollId').value.trim();
    if (!pollId) {
        showMessage('Введите ID опроса', true);
        return;
    }
    window.location.href = `poll.html?id=${pollId}`;
});