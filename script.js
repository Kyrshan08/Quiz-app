const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let quizFinished = false;

/* ======================
   REGISTER
====================== */

function register(event) {
    event.preventDefault();

    const username =
        document.getElementById("regUsername").value.trim();

    const password =
        document.getElementById("regPassword").value.trim();

    if (!username || !password) {
        alert("Please fill all fields.");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Registration Successful!");
    window.location.href = "login.html";
}

/* ======================
   LOGIN
====================== */

function login(event) {
    event.preventDefault();

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    const storedUser =
        localStorage.getItem("username");

    const storedPass =
        localStorage.getItem("password");

    if (
        username === storedUser &&
        password === storedPass
    ) {
        alert("Login Successful!");
        window.location.href = "quiz.html";
    } else {
        alert("Invalid Username or Password!");
    }
}

/* ======================
   QUIZ
====================== */

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizFinished = false;

    nextButton.innerHTML = "Next";

    showQuestion();
}

function showQuestion() {
    resetState();

    const currentQuestion =
        questions[currentQuestionIndex];

    questionElement.innerHTML =
        `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach(answer => {
        const button =
            document.createElement("button");

        button.innerHTML = answer.text;
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

/* ======================
   SAVE SCORE
====================== */

function saveScore() {
    const playerName =
        localStorage.getItem("username") ||
        "Guest";

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

/* ======================
   SHOW SCORE
====================== */

function showScore() {
    resetState();

    quizFinished = true;

    saveScore();

    questionElement.innerHTML =
        `
        <h2>Quiz Complete!</h2>
        <p>Your Score: ${score} / ${questions.length}</p>
    `;

    nextButton.innerHTML =
        "View Leaderboard";

    nextButton.style.display = "block";
}

/* ======================
   BUTTON EVENTS
====================== */

if (nextButton) {
    nextButton.addEventListener(
        "click",
        () => {
            if (quizFinished) {
                window.location.href =
                    "leaderboard.html";
            } else {
                handleNextButton();
            }
        }
    );
}

/* ======================
   START QUIZ PAGE ONLY
====================== */

if (
    questionElement &&
    answerButtons &&
    nextButton
) {
    startQuiz();
}