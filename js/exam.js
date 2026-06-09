let config = JSON.parse(localStorage.getItem('adyaanant_config'));
if(!config) window.location.href = 'index.html';

let questions = [];
let currentQIndex = 0;
let userAnswers = {};
let timeLeft = config.timer * 60;
let timerInterval;
let violations = 0;

async function loadQuestions() {
    let subjectsToLoad = config.subject === 'All' ? ['biology', 'physics', 'chemistry'] : [config.subject.toLowerCase()];
    let allQs = [];
    
    for (let sub of subjectsToLoad) {
        const res = await fetch(`data/${sub}.json`);
        const data = await res.json();
        allQs = allQs.concat(data);
    }
    
    // Shuffle and slice
    allQs = allQs.sort(() => 0.5 - Math.random()).slice(0, config.qCount);
    
    // Shuffle options
    questions = allQs.map(q => ({
        ...q,
        options: q.options.sort(() => 0.5 - Math.random())
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
    
    const optsDiv = document.getElementById('options');
    optsDiv.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
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

document.getElementById('prev-btn').onclick = () => { if(currentQIndex > 0) { currentQIndex--; renderQuestion(); } };
document.getElementById('next-btn').onclick = () => { if(currentQIndex < questions.length - 1) { currentQIndex++; renderQuestion(); } };
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
    document.addEventListener('visibilitychange', () => { if(document.hidden) triggerViolation("Tab changed!"); });
    window.addEventListener('blur', () => triggerViolation("Window unfocused!"));
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => { e.preventDefault(); triggerViolation("Copying is disabled."); });
}

function triggerViolation(msg) {
    violations++;
    alert(`WARNING: ${msg} Violation ${violations}/3.`);
    if(violations >= 3) submitExam();
}

function submitExam() {
    clearInterval(timerInterval);
    localStorage.setItem('adyaanant_answers', JSON.stringify(userAnswers));
    localStorage.setItem('adyaanant_questions', JSON.stringify(questions));
    window.location.href = 'result.html';
}

window.onload = loadQuestions;