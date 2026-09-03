/* NAVIGATION BUTTONS */
document.querySelector('.nav-back').onclick = () => {
    window.location.href = 'previous-lesson.html';
};

document.querySelector('.nav-home').onclick = () => {
    window.location.href = '../index.html';
};

document.querySelector('.nav-continue').onclick = () => {
    window.location.href = 'next-lesson.html';
};

/* AUDIO PLAYBACK */
document.querySelectorAll('.listen-button').forEach(button => {
    button.addEventListener('click', () => {
        const audioSrc = button.dataset.audio;
        const audio = new Audio(audioSrc);
        audio.play();
    });
});

/* SPEECH RECOGNITION */
document.querySelectorAll('.speak-button').forEach(button => {
    button.addEventListener('click', () => {
        const targetWord = button.dataset.target;
        const heardBox = button.closest('.speaking-component').querySelector('.heard-text');
        const resultBox = button.closest('.speaking-component').querySelector('.result-text');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ru-RU';
        recognition.interimResults = false;

        recognition.start();

        recognition.onresult = event => {
            const transcript = event.results[0][0].transcript;
            heardBox.textContent = `I heard: ${transcript}`;

            if (transcript.toLowerCase().includes(targetWord)) {
                resultBox.textContent = "You said it correctly";
                resultBox.style.color = "green";
            } else {
                resultBox.textContent = "Almost! Try again";
                resultBox.style.color = "red";
            }
        };
    });
});

/* MARK COMPLETE */
document.querySelectorAll('.mark-complete').forEach(button => {
    button.addEventListener('click', () => {
        button.textContent = "✓ Completed";
        button.style.backgroundColor = "green";
    });
});
