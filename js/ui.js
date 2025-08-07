function UI() {
    this.profileBox = document.querySelector("#profile-box");
    this.quizBox = document.querySelector("#quiz-box");
    this.buttonBox = document.querySelector("#button-box");
    this.categoryBox = document.querySelector("#category-box");
    this.difficultyBox = document.querySelector("#difficulty-box");
    this.scoreBox = document.querySelector("#score-box");
    this.body = document.querySelector("#quiz-box #body");
    this.correctIcon = '<i class="bi bi-check-circle"></i>';
    this.inCorrectIcon = '<i class="bi bi-x-circle"></i>';
    this.btnStart = document.querySelector(".btn-start");
    this.btnNext = document.querySelector(".btn-next");
    this.btnReplay = document.querySelector(".btn-replay");
    this.btnQuit = document.querySelector(".btn-quit");
    this.btnBack = document.querySelector(".btn-back");
    this.btnBackToCategory = document.querySelector(".btn-back-to-category");
    this.btnStartQuiz = document.querySelector(".btn-start-quiz");
    this.btnContinue = document.querySelector(".btn-continue");
    this.btnChangeUser = document.querySelector(".btn-change-user");
    this.usernameInput = document.querySelector("#username");
    this.timeText = document.querySelector(".time-text");
    this.timeSecond = document.querySelector(".time-second");
    this.timeLine = document.querySelector(".time-line");
    this.selectedCategoryDisplay = document.querySelector(".selected-category");
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

UI.prototype.showScreen = function(screenName) {
    // Hide all screens
    this.buttonBox.classList.remove("active");
    this.categoryBox.classList.remove("active");
    this.difficultyBox.classList.remove("active");
    this.quizBox.classList.remove("active");
    this.scoreBox.classList.remove("active");
    this.profileBox.classList.remove("active");
    
    // Show the requested screen
    switch(screenName) {
        case "start":
            this.buttonBox.classList.add("active");
            break;
        case "category":
            this.categoryBox.classList.add("active");
            break;
        case "difficulty":
            this.difficultyBox.classList.add("active");
            break;
        case "quiz":
            this.quizBox.classList.add("active");
            break;
        case "score":
            this.scoreBox.classList.add("active");
            break;
        case "profile":
            this.profileBox.classList.add("active");
            break;
    }
}

UI.prototype.updateSelectedCategory = function(category, icon) {
    const iconElement = this.selectedCategoryDisplay.querySelector('i');
    const textElement = this.selectedCategoryDisplay.querySelector('span');
    
    iconElement.className = `bi ${icon}`;
    textElement.textContent = category;
}

UI.prototype.updateDifficultyQuestionCounts = function(category) {
    const difficultyCards = document.querySelectorAll('.difficulty-card');
    
    difficultyCards.forEach(card => {
        const difficulty = card.dataset.difficulty;
        const questionCountElement = card.querySelector('.question-count');
        
        if (questionBank[category] && questionBank[category][difficulty]) {
            const count = questionBank[category][difficulty].length;
            questionCountElement.textContent = `${count} questions`;
        }
    });
}