let questions = [];
let results = [];
let currentQuestionIndex = 0;
var score = 0;

function startQuiz() {
    fetch("q&a.json")
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            results = data.results;
            showQuestion();
        })
        .catch(error => console.error("Error loading questions:", error));
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    let question = questions[currentQuestionIndex];
    document.getElementById("question-text").textContent = question.text;

    let answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    question.answers.forEach(answer => {
        let button = document.createElement("button");
        button.textContent = answer.text;
        button.onclick = function () {
            selectAnswer(answer.points);
            nextQuestion();
        };
        answersDiv.appendChild(button);
    });

    // document.getElementById("next-btn").style.display = "none";
}

function selectAnswer(points) {

    if (isNaN(points)) {
        console.error("Invalid points value.");
        return; // Do not update score if points are not valid
    }

    score = score + points;
    currentQuestionIndex++;
    // document.getElementById("next-btn").style.display = "block"; // Show next button
}

function nextQuestion() {
    showQuestion();
}

function showResult() {

    if (isNaN(score)) {
        console.error("Invalid score value.");
    } else {
        console.log("Score: " + score);
    }

    let venomIndex = Math.floor(score / 25);
    let resultText = results[venomIndex] ? results[venomIndex].text : "Результат не найден.";

    document.getElementById("result-text").textContent = "Ваш результат: " + score + " (" + resultText + ")";
    document.getElementById("answers").style.display = "none";
    document.getElementById("question-text").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("result").style.display = "block";
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("result").style.display = "none";
    document.getElementById("answers").style.display = "block";
    document.getElementById("question-text").style.display = "block";
    showQuestion();
}