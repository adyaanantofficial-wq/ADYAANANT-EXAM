import { supabase } from './supabase.js';

async function loadLeaderboard() {
    const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('percentage', { ascending: false })
        .order('score', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const tbody = document.getElementById('lb-body');
    tbody.innerHTML = '';

    data.forEach((row, index) => {
        let badge = '';
        if (index === 0) badge = '🥇';
        else if (index === 1) badge = '🥈';
        else if (index === 2) badge = '🥉';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1} ${badge}</td>
            <td>${row.name}</td>
            <td>${row.exam}</td>
            <td>${row.state}</td>
            <td>${row.subject}</td>
            <td>${row.percentage}%</td>
            <td>${row.score}</td>
            <td>${new Date(row.created_at).toLocaleDateString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = loadLeaderboard;