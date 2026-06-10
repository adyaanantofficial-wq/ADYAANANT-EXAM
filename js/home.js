const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar", "Chandigarh", "Dadra and Nagar Haveli", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];

const examSubjects = {
    NEET: [
        { value: 'Biology', label: 'Biology' },
        { value: 'Physical Chemistry', label: 'Physical Chemistry' },
        { value: 'Inorganic Chemistry', label: 'Inorganic Chemistry' },
        { value: 'Organic Chemistry', label: 'Organic Chemistry' },
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry Mix', label: 'Chemistry Mix' },
        { value: 'All', label: 'All Subjects' }
    ],
    JEE: [
        { value: 'Math', label: 'Math' },
        { value: 'Physical Chemistry', label: 'Physical Chemistry' },
        { value: 'Inorganic Chemistry', label: 'Inorganic Chemistry' },
        { value: 'Organic Chemistry', label: 'Organic Chemistry' },
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry Mix', label: 'Chemistry Mix' },
        { value: 'All', label: 'All Subjects' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('state');
    const subjectSelect = document.getElementById('subject');
    const examSelect = document.getElementById('exam');
    const difficultySelect = document.getElementById('difficulty');

    states.forEach(state => {
        let opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
    });

    function updateSubjectOptions(examType) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        (examSubjects[examType] || []).forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.label;
            subjectSelect.appendChild(option);
        });
    }

    updateSubjectOptions('NEET');
    updateSubjectOptions(examSelect.value);

    examSelect.addEventListener('change', (e) => {
        updateSubjectOptions(e.target.value);
    });

    document.getElementById('setup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const config = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            exam: document.getElementById('exam').value,
            state: document.getElementById('state').value,
            subject: document.getElementById('subject').value,
            difficulty: difficultySelect.value,
            qCount: parseInt(document.getElementById('q-count').value),
            timer: parseInt(document.getElementById('timer').value)
        };
        localStorage.setItem('adyaanant_config', JSON.stringify(config));
        window.location.href = 'exam.html';
    });
});