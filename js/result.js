import { supabase } from './supabase.js';

const config = JSON.parse(localStorage.getItem('adyaanant_config'));
const questions = JSON.parse(localStorage.getItem('adyaanant_questions'));
const answers = JSON.parse(localStorage.getItem('adyaanant_answers'));

if(!config || !questions) window.location.href = 'index.html';

let correct = 0, incorrect = 0, skipped = 0;

const tbody = document.getElementById('review-body');

questions.forEach((q, i) => {
    const userAns = answers[q.id];
    let status = 'Skipped';
    let className = 'gray';

    if (!userAns) {
        skipped++;
    } else if (userAns === q.answer) {
        correct++;
        status = 'Correct';
        className = 'green';
    } else {
        incorrect++;
        status = 'Incorrect';
        className = 'red';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${q.question}</td>
        <td>${userAns || '-'}</td>
        <td>${q.answer}</td>
        <td class="${className}">${status}</td>
    `;
    tbody.appendChild(tr);
});

const score = (correct * 4) - (incorrect * 1);
const maxScore = questions.length * 4;
const percentage = ((score / maxScore) * 100).toFixed(2);

let rating = 'Needs Improvement';
if (percentage >= 90) rating = 'Excellent';
else if (percentage >= 75) rating = 'Good';
else if (percentage >= 50) rating = 'Average';

document.getElementById('score-summary').innerHTML = `
    <p>Correct: <span class="green">${correct}</span> (+${correct*4})</p>
    <p>Incorrect: <span class="red">${incorrect}</span> (-${incorrect*1})</p>
    <p>Skipped: <span class="gray">${skipped}</span> (0)</p>
    <h2>Total Score: ${score} / ${maxScore}</h2>
    <h3>Percentage: ${percentage}%</h3>
    <h4>Rating: ${rating}</h4>
`;

async function saveResult() {
    const { error } = await supabase.from('exam_results').insert([{
        name: config.name,
        email: config.email,
        exam: config.exam,
        state: config.state,
        subject: config.subject,
        total_questions: questions.length,
        correct, incorrect, skipped, score, percentage
    }]);
    if(error) console.error("Error saving result:", error);
}

saveResult();