function selectAnswer(type, nextPage) {
    let scores = JSON.parse(localStorage.getItem("quizScores")) || { A: 0, B: 0, C: 0, D: 0 };
    scores[type]++;
    localStorage.setItem("quizScores", JSON.stringify(scores));

    // Redirect to the next question
    window.location.href = nextPage;
}

function showResult() {
    let scores = JSON.parse(localStorage.getItem("quizScores")) || { A: 0, B: 0, C: 0, D: 0 };
    let highestType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));

    let resultText = {
        A: "The Romantic - Your partner loves affection and deep emotional connections.",
        B: "The Adventurer - They thrive on excitement, challenges, and new experiences.",
        C: "The Generous - They love to spoil you with gifts and thoughtful gestures.",
        D: "The Intellectual - They value deep conversations and meaningful moments."
    };

    document.getElementById("result-text").textContent = resultText[highestType];
    localStorage.clear(); // Reset for next quiz
}