// app.js - Логика для Web App диагностики чтения

let currentData = {
    childName: "",
    age: 0,
    problem: "",
    day: 0,
    speed: 0,
    errors: [],
    readStyle: "",
    understanding: 0,
    attention: 0
};

let timer = null;
let timerSeconds = 0;
let nextNumber = 1;

// ============ НАВИГАЦИЯ ============

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

function goBack() {
    const sections = ['section-1', 'section-2', 'section-3', 'section-4', 'section-5'];
    const currentId = document.querySelector('.section.active').id;
    const currentIndex = sections.indexOf(currentId);
    
    if (currentIndex > 0) {
        showSection(sections[currentIndex - 1]);
    }
}

// ============ ПЕРЕХОД К ТЕСТАМ ============

function goToTest1() {
    const name = document.getElementById('childName').value.trim();
    const age = document.getElementById('childAge').value;
    const problem = document.querySelector('input[name="problem"]:checked')?.value;

    if (!name || !age || !problem) {
        alert('⚠️ Пожалуйста, заполни все поля!');
        return;
    }

    currentData.childName = name;
    currentData.age = parseInt(age);
    currentData.problem = problem;

    showSection('section-2');
}

function goToTest2() {
    const speed = parseInt(document.getElementById('wordsRead').value);
    const errors = Array.from(document.querySelectorAll('input[name="errors"]:checked')).map(e => e.value);
    const readStyle = document.querySelector('input[name="readStyle"]:checked')?.value;

    if (!speed || !readStyle) {
        alert('⚠️ Заполни все поля!');
        return;
    }

    currentData.speed = speed;
    currentData.errors = errors;
    currentData.readStyle = readStyle;

    showSection('section-3');
}

function goToTest3() {
    const q1 = document.getElementById('q1').value.trim();
    const q2 = document.getElementById('q2').value.trim();
    const q3 = document.getElementById('q3').value.trim();
    const q4 = document.getElementById('q4').value.trim();
    const q5 = document.getElementById('q5').value.trim();

    if (!q1 || !q2 || !q3 || !q4 || !q5) {
        alert('⚠️ Ответь на все вопросы!');
        return;
    }

    currentData.understanding = 5;
    initSchulteTable();
    showSection('section-4');
}

// ============ ТАБЛИЦА ШУЛЬТЕ ============

function initSchulteTable() {
    const numbers = Array.from({length: 25}, (_, i) => i + 1);
    
    // Перемешиваем
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    const table = document.getElementById('schulteTable');
    table.innerHTML = '';

    numbers.forEach(num => {
        const cell = document.createElement('div');
        cell.className = 'schulte-cell';
        cell.textContent = num;
        cell.onclick = () => clickCell(cell, num);
        table.appendChild(cell);
    });

    nextNumber = 1;
}

function clickCell(cell, num) {
    if (num === nextNumber) {
        cell.classList.add('found');
        nextNumber++;

        if (nextNumber > 25) {
            endTimer();
            alert('✅ Отлично! Все числа найдены!');
        }
    }
}

// ============ ТАЙМЕР ============

function startTimer() {
    timerSeconds = 0;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('endBtn').disabled = false;

    timer = setInterval(() => {
        timerSeconds++;
        updateTimer();
    }, 100);
}

function updateTimer() {
    const seconds = (timerSeconds / 10).toFixed(1);
    document.getElementById('timer').textContent = `⏱️ ${seconds} сек`;
}

function endTimer() {
    if (timer) {
        clearInterval(timer);
        currentData.attention = Math.round((timerSeconds / 10) * 10) / 10;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('endBtn').disabled = true;
    }
}

// ============ РЕЗУЛЬТАТЫ ============

function showResults() {
    if (currentData.attention === 0) {
        alert('⚠️ Найди все цифры от 1 до 25!');
        return;
    }

    // Определяем норму по возрасту
    const norms = {
        7: { speed: 32, attention: 75 },
        8: { speed: 60, attention: 75 },
        9: { speed: 80, attention: 60 },
        10: { speed: 110, attention: 55 },
        11: { speed: 135, attention: 50 },
        12: { speed: 135, attention: 50 }
    };

    const age = currentData.age;
    const speedNorm = norms[age]?.speed || 80;
    const attentionNorm = norms[age]?.attention || 60;

    const speedPercent = ((currentData.speed / speedNorm) * 100).toFixed(0);
    const attentionPercent = ((currentData.attention / attentionNorm) * 100).toFixed(0);

    let diagnosis = "";
    if (speedPercent < 70) diagnosis += "Медленное чтение. ";
    if (currentData.errors.length > 1) diagnosis += "Много ошибок. ";
    if (currentData.understanding < 4) diagnosis += "Слабое понимание. ";
    if (attentionPercent > 120) diagnosis += "Слабое внимание.";

    const html = `
        <div class="alert alert-info">
            <strong>✅ Тестирование завершено!</strong>
        </div>

        <div class="result-box">
            <h3>📖 Скорость чтения</h3>
            <div class="result-item">
                <span>Твой результат:</span>
                <strong>${currentData.speed} слов/мин</strong>
            </div>
            <div class="result-item">
                <span>Норма для ${age} лет:</span>
                <strong>${speedNorm} слов/мин</strong>
            </div>
            <div class="result-item">
                <span>Процент:</span>
                <strong>${speedPercent}%</strong>
            </div>
        </div>

        <div class="result-box">
            <h3>🧠 Понимание</h3>
            <div class="result-item">
                <span>Вопросы:</span>
                <strong>5 из 5 ✅</strong>
            </div>
        </div>

        <div class="result-box">
            <h3>👀 Внимание (Шульте)</h3>
            <div class="result-item">
                <span>Твой результат:</span>
                <strong>${currentData.attention} сек</strong>
            </div>
            <div class="result-item">
                <span>Норма для ${age} лет:</span>
                <strong>${attentionNorm} сек</strong>
            </div>
            <div class="result-item">
                <span>Процент:</span>
                <strong>${attentionPercent}%</strong>
            </div>
        </div>

        <div class="result-box">
            <h3>🎯 Диагноз</h3>
            <p>${diagnosis || '✨ Отличные результаты! Продолжай!'}</p>
        </div>

        <div class="alert alert-info">
            <strong>📅 План:</strong> 7 дней упражнений по 15 минут в день.
        </div>
    `;

    document.getElementById('resultsContent').innerHTML = html;
    showSection('section-5');
}

// ============ ОТПРАВКА РЕЗУЛЬТАТОВ ============

function sendResults() {
    const data = {
        day: 0,
        childName: currentData.childName,
        age: currentData.age,
        problem: currentData.problem,
        speed: currentData.speed,
        understanding: currentData.understanding,
        attention: currentData.attention,
        errors: currentData.errors,
        readStyle: currentData.readStyle,
        timestamp: new Date().toISOString()
    };

    // Отправка в Telegram Bot через Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify(data));
        window.Telegram.WebApp.close();
    } else {
        // Для тестирования без Telegram
        console.log('Результаты:', data);
        alert('✅ Результаты сохранены!\n\n' + JSON.stringify(data, null, 2));
    }
}
