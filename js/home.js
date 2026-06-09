const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar", "Chandigarh", "Dadra and Nagar Haveli", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];

document.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('state');
    states.forEach(state => {
        let opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
    });

    const examSelect = document.getElementById('exam');
    const startBtn = document.getElementById('start-btn');
    const jeeWarning = document.getElementById('jee-warning');

    examSelect.addEventListener('change', (e) => {
        if(e.target.value === 'JEE') {
            startBtn.disabled = true;
            jeeWarning.style.display = 'block';
        } else {
            startBtn.disabled = false;
            jeeWarning.style.display = 'none';
        }
    });

    document.getElementById('setup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            exam: document.getElementById('exam').value,
            state: document.getElementById('state').value,
            subject: document.getElementById('subject').value,
            qCount: parseInt(document.getElementById('q-count').value),
            timer: parseInt(document.getElementById('timer').value)
        };
        localStorage.setItem('adyaanant_config', JSON.stringify(config));
        window.location.href = 'exam.html';
    });
});