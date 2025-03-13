let questions = [];
let results = [];
let currentQuestionIndex = 0;
var score = 0;
let scores = {"I": 0, "E": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0};
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
            console.log(answer.points);
            selectAnswer(answer.points);
            nextQuestion();
        };
        answersDiv.appendChild(button);
    });
}
// for score that counts as single number
// function selectAnswer(points) {
//     if (isNaN(points)) {
//         console.error("Invalid points value.");
//         return;
//     }

//     score += points;
//     currentQuestionIndex++;
// }

// for score that counts like set of differrent values
function selectAnswer(points) {
    if (!(points in scores)) {
        console.error("Invalid points value.");
        return;
    }

    scores[points] += 1;

    currentQuestionIndex++;
}

function nextQuestion() {
    showQuestion();
}

function getMBTIResult(scores) {
    let result = "";
    let pairs = [["I", "E"], ["S", "N"], ["T", "F"], ["J", "P"]];

    for (let i = 0; i < pairs.length; i++) {
        let [first, second] = pairs[i];
        result += scores[first] >= scores[second] ? first : second;
    }

    return result;
}


function showResult() {
    if (!UIlocalization[currentLanguage]) {
        console.error("Localization data not loaded for", currentLanguage);
        return;
    }

    // let venomIndex = Math.floor(score / 25);
    let usersType = getMBTIResult(scores);

    let resultObject = results.find(r => r.type === usersType);

    let description = resultObject ? resultObject.text : UIlocalization[currentLanguage]["lost-result"];
    // let resultText = results[venomIndex] ? results[venomIndex].text : UIlocalization[currentLanguage]["lost-result"];
    let message = UIlocalization[currentLanguage]["ur-result"];

    document.getElementById("result-text").textContent = message + " (" + usersType + ")" + "\n" + description;
    document.getElementById("answers").style.display = "none";
    document.getElementById("question-text").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("result").style.display = "block";
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scores = {"I": 0, "E": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0};
    document.getElementById("result").style.display = "none";
    document.getElementById("answers").style.display = "block";
    document.getElementById("question-text").style.display = "block";
    showQuestion();
}