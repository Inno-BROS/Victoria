let questions = [];
let results = [];
let currentQuestionIndex = 0;
var score = 0;
let currentLanguage = 'ru'; 

let translations = {};
let UIlocalization = {};

function startQuiz() {
    loadTranslations().then(() => loadQuestions(currentLanguage));
}


function updateContent() {
    loadTranslations().then(() => {
        document.querySelectorAll("[data-i18n]").forEach(element => {
            let key = element.getAttribute("data-i18n");
            if (UIlocalization[currentLanguage] && UIlocalization[currentLanguage][key]) {
                element.textContent = UIlocalization[currentLanguage][key];
            }
        });
    });
}

function loadTranslations() {
    return fetch("localization.json")
        .then(response => response.json())
        .then(data => {
            UIlocalization = data.language;
        })
        .catch(error => console.error("Error loading translations:", error));
}

function loadQuestions(language) {
    fetch(`quizes/${language}q&a.json`) 
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            results = data.results;
            showQuestion();
        })
        .catch(error => console.error("Error loading questions:", error));
}

function changeLanguage(language) {
    currentLanguage = language; 
    currentQuestionIndex = 0;   
    score = 0;                  
    document.getElementById("result").style.display = "none";
    document.getElementById("answers").style.display = "block";
    document.getElementById("question-text").style.display = "block";
    loadQuestions(language);    
    updateContent();
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
}

function selectAnswer(points) {
    if (isNaN(points)) {
        console.error("Invalid points value.");
        return;
    }

    score += points;
    currentQuestionIndex++;
}

function nextQuestion() {
    showQuestion();
}

function showResult() {
    if (!UIlocalization[currentLanguage]) {
        console.error("Localization data not loaded for", currentLanguage);
        return;
    }

    let venomIndex = Math.floor(score / 25);
    let resultText = results[venomIndex] ? results[venomIndex].text : UIlocalization[currentLanguage]["lost-result"];
    let message = UIlocalization[currentLanguage]["ur-result"];

    document.getElementById("result-text").textContent = message + score + " (" + resultText + ")";
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