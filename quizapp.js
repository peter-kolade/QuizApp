
const quizContainer = document.getElementById('quiz');
const nextBtn = document.getElementById('nextBtn');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(error => {
    quizContainer.innerHTML = `<p class="text-red-500">Sorry, we couldn't load the quiz.</p>`;
    nextBtn.classList.add('hidden');
  });

function showQuestion() {
  const current = questions[currentQuestionIndex];
  quizContainer.innerHTML = `
    <h2 class="text-2xl font-bold text-blue-700 mb-4">Question ${currentQuestionIndex + 1} of ${questions.length}</h2>
    <p class="text-lg text-gray-800 mb-6">${current.question}</p>
    <div class="flex flex-col gap-4">
      ${current.options.map((option, index) => `
        <button
          class="option border px-6 py-3 rounded-xl font-medium text-gray-700 bg-white hover:bg-blue-200 transition duration-200 ease-in-out shadow-sm"
          data-value="${option}">
          ${String.fromCharCode(65 + index)}. ${option}
        </button>
      `).join('')}
    </div>
  `;

  selectedOption = null;
  nextBtn.classList.add('hidden');

  document.querySelectorAll('.option').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.option').forEach(btn => btn.classList.remove('bg-blue-200', 'ring-2', 'ring-blue-400'));
      button.classList.add('bg-blue-200', 'ring-2', 'ring-blue-400');
      selectedOption = button.getAttribute('data-value');
      nextBtn.classList.remove('hidden');
    });
  });
}

nextBtn.addEventListener('click', () => {
  if (selectedOption === questions[currentQuestionIndex].answer) {
    score++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  let message = '';
  if (score === questions.length) {
    message = 'Excellent';
  } else if (score > questions.length / 2) {
    message = 'Great job';
  } else {
    message = 'Keep practicing';
  }
  quizContainer.innerHTML = `
    <h2 class="text-3xl font-bold text-green-600 mb-4">Quiz Completed</h2>
    <p class="text-xl mb-2">Your score: <span class="font-bold">${score} / ${questions.length}</span></p>
    <p class="text-lg">${message}</p>
    <button id="restartBtn" class="mt-6 px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition">Restart Quiz</button>
  `;
  nextBtn.classList.add('hidden');
  document.getElementById('restartBtn').onclick = () => {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
  };
}

