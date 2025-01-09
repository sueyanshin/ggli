const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const submitButton = document.getElementById("submit");

let currentQuestion = 0;
let score = 0;
let timer;
let isQuizStarted = false;

const correctSound = new Audio("assets/sounds/correct.mp3");
const wrongSound = new Audio("assets/sounds/wrong.mp3");
const completedSound = new Audio("assets/sounds/completed.mp3");

function startTimer() {
  const progressBar = document.querySelector(".progress");
  progressBar.style.width = "100%"; // Start at 100%

  // Clear any existing timer
  if (timer) clearTimeout(timer);

  // Reset and animate to 0%
  setTimeout(() => {
    progressBar.style.width = "0%";
  }, 50);

  // Auto-submit after 10 seconds (changed from 5000 to 10000)
  timer = setTimeout(() => {
    const options = document.querySelectorAll(".options li");
    if (!options[0].classList.contains("disabled")) {
      checkAnswer("timeout");
    }
  }, 10000);
}

function loadQuiz() {
  if (!isQuizStarted) return;

  const currentQuizData = quizData[currentQuestion];
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = `
    <div class="question-number">မေးခွန်း ${currentQuestion + 1}/${
    quizData.length
  }</div>
    <div class="question">${currentQuizData.question}</div>
    <ul class="options">
      ${currentQuizData.options.map((option) => `<li>${option}</li>`).join("")}
    </ul>
  `;
}

function checkAnswer(selectedAnswer) {
  // Clear the timer when answer is selected
  if (timer) clearTimeout(timer);

  const currentQuizData = quizData[currentQuestion];
  const options = document.querySelectorAll(".options li");
  const correctAnswer = currentQuizData.answer;

  options.forEach((option) => {
    option.classList.add("disabled");
    if (option.textContent === correctAnswer) {
      option.classList.add("correct");
    }
    if (
      option.textContent === selectedAnswer &&
      selectedAnswer !== correctAnswer
    ) {
      option.classList.add("incorrect");
    }
  });

  // Play sound based on answer
  if (selectedAnswer === correctAnswer) {
    correctSound.play();
    score++;
  } else {
    wrongSound.play();
  }

  if (currentQuestion === quizData.length - 1) {
    setTimeout(() => {
      showResults();
    }, 1000);
  } else {
    currentQuestion++;
    setTimeout(() => {
      loadQuiz();
      // Force progress bar reset
      const progressBar = document.querySelector(".progress");
      progressBar.style.transition = "none";
      progressBar.style.width = "100%";

      // Re-enable transition and start timer
      setTimeout(() => {
        progressBar.style.transition = "width 10s linear";
        startTimer();
      }, 50);
    }, 1000);
  }
}

// Add start button handler
document.getElementById("start-btn").addEventListener("click", startQuiz);

function startQuiz() {
  isQuizStarted = true;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  loadQuiz();
  startTimer();
}

quizContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    checkAnswer(e.target.textContent);
  }
});

submitButton.addEventListener("click", () => {
  showResults();
});

function showResults() {
  completedSound.play();
  document.getElementById("quiz-screen").innerHTML = `
    <div class="question">Quiz Completed!</div>
    <div id="result">သင်သည် မေးခွန်း${quizData.length} ခုတွင် ${score} မှတ် ရရှိပါသည်။</div>
    <button onclick="resetQuiz()" class="btn btn-primary mt-3 mx-auto">ပြန်လည်စတင်မည်</button>
  `;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  isQuizStarted = false;

  // Reset the entire quiz container to its original state
  document.getElementById("quiz-container").innerHTML = `
    <h1 class="my-4 text-center">💡ဉာဏ်စမ်းဂိမ်း💡</h1>
    <div id="start-screen" class="text-center">
      <button id="start-btn" class="btn btn-primary btn-lg mx-auto">စတင်မည်</button>
    </div>
    <div id="quiz-screen" style="display: none;">
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <div id="quiz"></div>
      <div id="result"></div>
    </div>
  `;

  // Re-attach event listener to the new start button
  document.getElementById("start-btn").addEventListener("click", startQuiz);

  // Re-attach click event for options
  document.getElementById("quiz").addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      checkAnswer(e.target.textContent);
    }
  });
}
