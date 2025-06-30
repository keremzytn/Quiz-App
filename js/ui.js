function UI() {
    this.quizBox = document.querySelector("#quiz-box");
    this.buttonBox = document.querySelector("#button-box");
    this.scoreBox = document.querySelector("#score-box");
    this.body = document.querySelector("#quiz-box #body");
    this.correctIcon = '<i class="bi bi-check-circle"></i>';
    this.inCorrectIcon = '<i class="bi bi-x-circle"></i>';
    this.btnStart = document.querySelector(".btn-start");
    this.btnNext = document.querySelector(".btn-next");
    this.btnReplay = document.querySelector(".btn-replay");
    this.btnQuit = document.querySelector(".btn-quit");
    this.timeText = document.querySelector(".time-text");
    this.timeSecond = document.querySelector(".time-second");
    this.timeLine = document.querySelector(".time-line");
}

UI.prototype.soruGoster = function(soru) {
    this.body.innerHTML = "";
    
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");

    const title = document.createElement("h2");
    title.classList.add("question-title");
    title.textContent = soru.soruMetni;

    const optionList = document.createElement("div");
    optionList.classList.add("option-list");

    for(let [key, value] of Object.entries(soru.cevapSecenekleri)) {
        const option = document.createElement("div");
        option.classList.add("option");
        option.addEventListener("click", optionSelected);

        const span = document.createElement("span");
        span.textContent = key.toUpperCase() + ") " + value;

        option.appendChild(span);
        optionList.appendChild(option);
    }

    questionContainer.appendChild(title);
    questionContainer.appendChild(optionList);
    this.body.appendChild(questionContainer);
}

UI.prototype.disableAllOption = function() {
    const options = document.querySelectorAll(".option");
    for(let option of options) {
        option.classList.add("disabled");
    }
}

UI.prototype.soruSayisiniGoster = function(soruSirasi, toplamSoru){
    const etiket = `<span class="badge">${soruSirasi} / ${toplamSoru}</span>`;
    document.querySelector(".question-index").innerHTML = etiket;
}

UI.prototype.skoruGoster = function(dogruCevap, toplamSoru){
    const percentage = Math.round((dogruCevap / toplamSoru) * 100);
    const scoreText = `You answered ${dogruCevap} out of ${toplamSoru} questions correctly.`;
    
    document.querySelector(".score-text").innerHTML = scoreText;
    document.querySelector(".score-percentage").innerHTML = percentage + "%";
    
    // Add performance message based on score
    const performanceMessage = this.getPerformanceMessage(percentage);
    const scoreContainer = document.querySelector(".score-text");
    scoreContainer.innerHTML += `<div style="margin-top: 16px; font-size: 16px; color: #667eea; font-weight: 600;">${performanceMessage}</div>`;
}

UI.prototype.getPerformanceMessage = function(percentage) {
    if (percentage >= 90) {
        return "🎉 Excellent! You're a quiz master!";
    } else if (percentage >= 70) {
        return "👏 Great job! Well done!";
    } else if (percentage >= 50) {
        return "👍 Good effort! Keep practicing!";
    } else {
        return "💪 Don't give up! Try again!";
    }
}