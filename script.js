let questions = [];
let results = [];
let currentQuestionIndex = 0;
let scores = { A: 0, B: 0, C: 0, D: 0 };

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
        button.onclick = function() {
            selectAnswer(answer.type);
        };
        answersDiv.appendChild(button);
    });

    document.getElementById("next-btn").style.display = "none"; // Hide next button
}

function selectAnswer(type) {
    scores[type]++;
    currentQuestionIndex++;
    document.getElementById("next-btn").style.display = "block"; // Show next button
}

function nextQuestion() {
    showQuestion();
}

function showResult() {
    let highestType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));

    let resultIndex = ["A", "B", "C", "D"].indexOf(highestType);
    let resultText = results[resultIndex] ? results[resultIndex].text : "Результат не найден.";

    document.getElementById("result-text").textContent = resultText;
    document.getElementById("answers").style.display = "none";
    document.getElementById("question-text").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("result").style.display = "block";
}

function restartQuiz() {
    currentQuestionIndex = 0;
    scores = { A: 0, B: 0, C: 0, D: 0 };
    document.getElementById("result").style.display = "none";
    document.getElementById("answers").style.display = "block";
    document.getElementById("question-text").style.display = "block";
    showQuestion();
}