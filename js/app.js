const soruListesi = [
    new Soru("Which of the following is a JavaScript package management application?", { a: "Node.js", b: "TypeScript", c: "NuGet", d: "npm"}, "d"),
    new Soru("Which of the following is NOT considered part of frontend development?", { a: "CSS", b: "HTML", c: "JavaScript", d: "SQL" }, "d"),
    new Soru("Which of the following is considered part of backend development?", { a: "Node.js", b: "TypeScript", c: "Angular", d: "React" }, "a"),
    new Soru("Which of the following does NOT use the JavaScript programming language?", { a: "React", b: "Angular", c: "Vue.js", d: "ASP.NET" }, "d")
];

const quiz = new Quiz(soruListesi);
const ui = new UI();

ui.btnStart.addEventListener("click", function(){
    startTimer(10);
    startTimerLine();
    ui.quizBox.classList.add("active");
    ui.buttonBox.classList.remove("active");
    ui.soruGoster(quiz.soruGetir());
    ui.soruSayisiniGoster(quiz.soruIndex + 1, quiz.sorular.length);
    ui.btnNext.classList.remove("show");
});

ui.btnNext.addEventListener("click", function() {
    if(quiz.sorular.length != quiz.soruIndex) {
        startTimer(10);
        startTimerLine();
        ui.soruGoster(quiz.soruGetir());
        ui.soruSayisiniGoster(quiz.soruIndex + 1, quiz.sorular.length);
        ui.btnNext.classList.remove("show");
        ui.timeText.textContent = "Time Left";
    } else {
        ui.scoreBox.classList.add("active");
        ui.quizBox.classList.remove("active");
        ui.skoruGoster(quiz.dogruCevapSayisi, quiz.sorular.length);
    }
});

function optionSelected(e) {
    clearInterval(counter);
    clearInterval(counterLine);

    let selectedElement = e.target;

    if(selectedElement.nodeName == "SPAN") {
        selectedElement = selectedElement.parentElement;
    }

    const cevap = e.target.textContent[0].toLowerCase();
    const soru = quiz.soruGetir();

    if(soru.cevabiKontrolEt(cevap)) {
        quiz.dogruCevapSayisi += 1;
        selectedElement.classList.add("correct");
        selectedElement.insertAdjacentHTML("beforeend", ui.correctIcon);
    } else {
        selectedElement.classList.add("incorrect");
        selectedElement.insertAdjacentHTML("beforeend", ui.inCorrectIcon);
        
        // Show correct answer
        const options = document.querySelectorAll(".option");
        options.forEach(option => {
            const optionText = option.textContent[0].toLowerCase();
            if(optionText === soru.dogruCevap) {
                option.classList.add("correct");
                option.insertAdjacentHTML("beforeend", '<i class="bi bi-check-circle" style="opacity: 0.7;"></i>');
            }
        });
    }

    quiz.soruIndex += 1;
    ui.disableAllOption();
    ui.btnNext.classList.add("show");
}

ui.btnQuit.addEventListener("click", function(){
    window.location.reload();
});

ui.btnReplay.addEventListener("click", function(){
    quiz.soruIndex = 0;
    quiz.dogruCevapSayisi = 0;
    ui.btnStart.click();
    ui.scoreBox.classList.remove("active");
});

let counter;

function startTimer(time){
    counter = setInterval(timer, 1000);

    function timer(){
        ui.timeSecond.textContent = time;
        time--;

        if(time < 0){
            clearInterval(counter);
            ui.timeText.textContent = "Time's Up!";

            // Show correct answer when time runs out
            const soru = quiz.soruGetir();
            const options = document.querySelectorAll(".option");
            options.forEach(option => {
                const optionText = option.textContent[0].toLowerCase();
                if(optionText === soru.dogruCevap) {
                    option.classList.add("correct");
                    option.insertAdjacentHTML("beforeend", ui.correctIcon);
                }
            });

            ui.disableAllOption();
            quiz.soruIndex += 1;
            ui.btnNext.classList.add("show");
        }
    }
}

let counterLine;

function startTimerLine(){
    let line_width = 0;
    const maxWidth = document.querySelector('.progress-container').offsetWidth;
    const increment = maxWidth / 500; // 10 seconds * 50 intervals per second
    
    counterLine = setInterval(timer, 20);

    function timer(){
        line_width += increment;
        ui.timeLine.style.width = line_width + "px";
        
        if(line_width >= maxWidth){
            clearInterval(counterLine);
        }
    }
}