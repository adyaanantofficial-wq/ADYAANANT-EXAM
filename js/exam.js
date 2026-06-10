let config = JSON.parse(localStorage.getItem('adyaanant_config'));
if(!config) window.location.href = 'index.html';

let questions = [];
let currentQIndex = 0;
let userAnswers = {};
let timeLeft = config.timer * 60;
let timerInterval;
let violations = 0;

const subjectLoadMap = {
    NEET: {
        Biology: [{ file: 'biology' }],
        'Physical Chemistry': [{ file: 'chemistry', filter: q => q.subject?.toLowerCase() === 'physical chemistry' }],
        'Inorganic Chemistry': [{ file: 'chemistry', filter: q => q.subject?.toLowerCase() === 'inorganic chemistry' }],
        'Organic Chemistry': [{ file: 'chemistry', filter: q => q.subject?.toLowerCase() === 'organic chemistry' }],
        Physics: [{ file: 'physics' }],
        'Chemistry Mix': [{ file: 'chemistry' }],
        All: [{ file: 'biology' }, { file: 'physics' }, { file: 'chemistry' }]
    },
    JEE: {
        Math: [{ file: 'math' }],
        'Physical Chemistry': [{ file: 'chemistry', filter: q => q.subject?.toLowerCase() === 'physical chemistry' }],
        'Inorganic Chemistry': [{ file: 'chemistry', filter: q => q.subject?.toLowerCase() === 'inorganic chemistry' }],
        'Organic Chemistry': [{ file: 'chemistry', filter: q => q.subject?.toLowerCase() === 'organic chemistry' }],
        Physics: [{ file: 'physics' }],
        'Chemistry Mix': [{ file: 'chemistry' }],
        All: [{ file: 'math' }, { file: 'physics' }, { file: 'chemistry' }]
    }
};

function normalizeQuestionId(q) {
    if (q.id) return q.id;
    return `${(q.question || '').slice(0, 120)}|${(q.answer || '').slice(0, 60)}`;
}

function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

async function loadQuestions() {
    const plan = subjectLoadMap[config.exam]?.[config.subject] || [];
    let allQs = [];
    const fileCache = {};

    for (const entry of plan) {
        if (!fileCache[entry.file]) {
            try {
                const res = await fetch(`data/${entry.file}.json`);
                if (!res.ok) throw new Error(`Missing ${entry.file}.json`);
                const data = await res.json();
                fileCache[entry.file] = Array.isArray(data) ? data : [];
            } catch (error) {
                fileCache[entry.file] = [];
            }
        }
    }

    for (const entry of plan) {
        const data = fileCache[entry.file] || [];
        const items = entry.filter ? data.filter(entry.filter) : data;
        allQs = allQs.concat(items);
    }

    // Filter by exam type (NEET or JEE)
    allQs = allQs.filter(q => {
        const qType = (q.type || '').toUpperCase();
        return qType.includes(config.exam.toUpperCase());
    });

    if (config.difficulty && config.difficulty !== 'All') {
        allQs = allQs.filter(q => (q.difficulty || '').toLowerCase() === config.difficulty.toLowerCase());
    }

    const uniqueMap = new Map();
    allQs.forEach(q => {
        const id = normalizeQuestionId(q);
        uniqueMap.set(id, { ...q, id });
    });
    allQs = Array.from(uniqueMap.values());

    if (!allQs.length) {
        alert('No questions found for the selected exam, subject, and difficulty. Please update your choices.');
        window.location.href = 'index.html';
        return;
    }

    allQs = shuffleArray(allQs);
    questions = allQs.slice(0, Math.min(config.qCount, allQs.length)).map(q => ({
        ...q,
        options: shuffleArray(Array.isArray(q.options) ? q.options : [])
    }));

    initExam();
}

function initExam() {
    renderPalette();
    renderQuestion();
    startTimer();
    setupAntiCheat();
}

function renderQuestion() {
    const q = questions[currentQIndex];
    document.getElementById('q-num').textContent = `Question ${currentQIndex + 1} of ${questions.length}`;
    document.getElementById('q-text').textContent = q.question;
    document.getElementById('q-type').textContent = q.type ? `Type: ${q.type}` : '';

    const optsDiv = document.getElementById('options');
    optsDiv.innerHTML = '';

    q.options.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'option' + (userAnswers[q.id] === opt ? ' selected' : '');
        div.textContent = opt;
        div.onclick = () => selectOption(q.id, opt);
        optsDiv.appendChild(div);
    });

    document.getElementById('prev-btn').disabled = currentQIndex === 0;
    document.getElementById('next-btn').style.display = currentQIndex === questions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submit-btn').style.display = currentQIndex === questions.length - 1 ? 'inline-block' : 'none';

    updatePalette();
}

function selectOption(qId, opt) {
    userAnswers[qId] = opt;
    renderQuestion();
}

function renderPalette() {
    const pal = document.getElementById('palette');
    pal.innerHTML = '';
    questions.forEach((q, i) => {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.id = 'pal-' + i;
        btn.onclick = () => { currentQIndex = i; renderQuestion(); };
        pal.appendChild(btn);
    });
}

function updatePalette() {
    questions.forEach((q, i) => {
        const btn = document.getElementById('pal-' + i);
        btn.className = '';
        if (i === currentQIndex) btn.classList.add('current');
        else if (userAnswers[q.id]) btn.classList.add('answered');
        else btn.classList.add('unanswered');
    });
}

document.getElementById('prev-btn').onclick = () => { if (currentQIndex > 0) { currentQIndex--; renderQuestion(); } };
document.getElementById('next-btn').onclick = () => { if (currentQIndex < questions.length - 1) { currentQIndex++; renderQuestion(); } };
document.getElementById('submit-btn').onclick = submitExam;

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').textContent = `${m}:${s}`;
        if (timeLeft <= 0) submitExam();
    }, 1000);
}

function setupAntiCheat() {
    document.addEventListener('visibilitychange', () => { if (document.hidden) triggerViolation('Tab changed!'); });
    window.addEventListener('blur', () => triggerViolation('Window unfocused!'));
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => { e.preventDefault(); triggerViolation('Copying is disabled.'); });
}

function triggerViolation(msg) {
    violations++;
    alert(`WARNING: ${msg} Violation ${violations}/3.`);
    if (violations >= 3) submitExam();
}

function submitExam() {
    clearInterval(timerInterval);
    localStorage.setItem('adyaanant_answers', JSON.stringify(userAnswers));
    localStorage.setItem('adyaanant_questions', JSON.stringify(questions));
    window.location.href = 'result.html';
}

window.onload = loadQuestions;