const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const timerElement = document.getElementById("timer");

const playerName =
    localStorage.getItem("username") || "Guest";

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let quizFinished = false;

/* =========================
   LOAD QUESTIONS
========================= */

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();

        startQuiz();
    } catch (error) {
        console.error(error);
        questionElement.textContent =
            "Failed to load questions.";
    }
}

/* =========================
   TIMER
========================= */

function startTimer() {
    clearInterval(timer);

    timeLeft = 30;
    timerElement.textContent =
        `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;

        timerElement.textContent =
            `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleNextButton();
        }
    }, 1000);
}

/* =========================
   QUIZ
========================= */

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizFinished = false;

    nextButton.textContent = "Next";

    showQuestion();
}

function showQuestion() {
    resetState();

    startTimer();

    const currentQuestion =
        questions[currentQuestionIndex];

    questionElement.textContent =
        `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach(answer => {
        const button =
            document.createElement("button");

        button.textContent = answer.text;
        button.classList.add("btn");

        if (answer.correct) {
            button.dataset.correct = "true";
        }

        button.addEventListener(
            "click",
            selectAnswer
        );

        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";

    while (answerButtons.firstChild) {
        answerButtons.removeChild(
            answerButtons.firstChild
        );
    }
}

function selectAnswer(event) {
    clearInterval(timer);

    const selectedBtn = event.target;

    const isCorrect =
        selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        score++;
        selectedBtn.classList.add("correct");
    } else {
        selectedBtn.classList.add("wrong");
    }

    Array.from(answerButtons.children).forEach(
        button => {
            if (
                button.dataset.correct === "true"
            ) {
                button.classList.add("correct");
            }

            button.disabled = true;
        }
    );

    nextButton.style.display = "block";
}

/* =========================
   LEADERBOARD SAVE
========================= */

function saveScore() {
    let leaderboard =
        JSON.parse(
            localStorage.getItem("leaderboard")
        ) || [];

    const existingPlayer =
        leaderboard.find(
            player => player.name === playerName
        );

    if (existingPlayer) {
        if (score > existingPlayer.score) {
            existingPlayer.score = score;
        }
    } else {
        leaderboard.push({
            name: playerName,
            score: score
        });
    }

    leaderboard.sort(
        (a, b) => b.score - a.score
    );

    localStorage.setItem(
        "leaderboard",
        JSON.stringify(leaderboard)
    );
}

/* =========================
   SCORE SCREEN
========================= */

function showScore() {
    clearInterval(timer);
    resetState();

    quizFinished = true;

    saveScore();

    questionElement.innerHTML =
        `
        Quiz Completed!<br><br>
        Your Score: ${score} / ${questions.length}
    `;

    nextButton.textContent =
        "View Leaderboard";

    nextButton.style.display = "block";
}

/* =========================
   NEXT BUTTON
========================= */

function handleNextButton() {
    currentQuestionIndex++;

    if (
        currentQuestionIndex < questions.length
    ) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (quizFinished) {
        window.location.href =
            "leaderboard.html";
    } else {
        handleNextButton();
    }
});

/* =========================
   START
========================= */

loadQuestions();