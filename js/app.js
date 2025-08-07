// User Management and Local Storage System
class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.initializeUserInterface();
    }

    loadUsers() {
        const users = localStorage.getItem('quizmaster_users');
        return users ? JSON.parse(users) : {};
    }

    saveUsers() {
        localStorage.setItem('quizmaster_users', JSON.stringify(this.users));
    }

    createUser(username) {
        const userId = Date.now().toString();
        this.users[userId] = {
            id: userId,
            name: username,
            gamesPlayed: 0,
            highScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            categoryStats: {},
            achievements: [],
            createdAt: new Date().toISOString(),
            lastPlayed: null
        };
        this.saveUsers();
        return userId;
    }

    setCurrentUser(userId) {
        this.currentUser = userId;
        localStorage.setItem('quizmaster_current_user', userId);
        this.updateUserInterface();
    }

    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = localStorage.getItem('quizmaster_current_user');
        }
        return this.currentUser ? this.users[this.currentUser] : null;
    }

    updateUserStats(correctAnswers, totalQuestions, category, difficulty) {
        const user = this.getCurrentUser();
        if (!user) return;

        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        user.gamesPlayed++;
        user.totalCorrect += correctAnswers;
        user.totalQuestions += totalQuestions;
        user.lastPlayed = new Date().toISOString();
        
        if (percentage > user.highScore) {
            user.highScore = percentage;
        }

        // Category-specific stats
        if (!user.categoryStats[category]) {
            user.categoryStats[category] = {
                gamesPlayed: 0,
                bestScore: 0,
                totalCorrect: 0,
                totalQuestions: 0
            };
        }
        
        const categoryStats = user.categoryStats[category];
        categoryStats.gamesPlayed++;
        categoryStats.totalCorrect += correctAnswers;
        categoryStats.totalQuestions += totalQuestions;
        if (percentage > categoryStats.bestScore) {
            categoryStats.bestScore = percentage;
        }

        this.checkAchievements(user, percentage, category);
        this.saveUsers();
        this.updateUserInterface();
    }

    checkAchievements(user, percentage, category) {
        const achievements = [
            { id: 'first_game', name: 'First Steps', description: 'Play your first quiz', condition: () => user.gamesPlayed === 1 },
            { id: 'perfect_score', name: 'Perfect!', description: 'Get 100% on any quiz', condition: () => percentage === 100 },
            { id: 'dedicated', name: 'Dedicated Player', description: 'Play 10 quizzes', condition: () => user.gamesPlayed === 10 },
            { id: 'scholar', name: 'Scholar', description: 'Achieve 90%+ average across all categories', condition: () => this.getOverallAverage(user) >= 90 },
        ];

        achievements.forEach(achievement => {
            if (!user.achievements.includes(achievement.id) && achievement.condition()) {
                user.achievements.push(achievement.id);
                this.showAchievementNotification(achievement);
            }
        });
    }

    getOverallAverage(user) {
        return user.totalQuestions > 0 ? Math.round((user.totalCorrect / user.totalQuestions) * 100) : 0;
    }

    showAchievementNotification(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">
                    <i class="bi bi-trophy-fill"></i>
                </div>
                <div class="achievement-info">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 5000);
        
        // Play achievement sound (if implemented)
        this.playAchievementSound();
    }

    playAchievementSound() {
        // Simple achievement sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C note
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E note
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G note
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Achievement sound not available');
        }
    }

    updateUserInterface() {
        const user = this.getCurrentUser();
        if (user) {
            document.querySelector('.current-username').textContent = user.name;
            document.querySelector('.high-score').textContent = user.highScore + '%';
            document.querySelector('.games-played').textContent = user.gamesPlayed;
        }
    }

    initializeUserInterface() {
        const lastUserId = localStorage.getItem('quizmaster_current_user');
        if (lastUserId && this.users[lastUserId]) {
            // Returning user
            const user = this.users[lastUserId];
            this.currentUser = lastUserId;
            
            document.querySelector('.returning-username').textContent = user.name;
            document.querySelector('.returning-user').style.display = 'block';
            document.querySelector('.profile-form .input-group').style.display = 'none';
            document.querySelector('.btn-continue').style.display = 'none';
            
            // Auto-continue after 2 seconds or when clicked
            setTimeout(() => {
                if (document.querySelector('#profile-box').classList.contains('active')) {
                    this.proceedToStart();
                }
            }, 2000);
        }
    }

    proceedToStart() {
        ui.showScreen("start");
        this.updateUserInterface();
    }
}

// Initialize user manager
const userManager = new UserManager();

// Question Bank with Categories and Difficulties
const questionBank = {
    "Programming": {
        "Kolay": [
            new Soru("HTML'de bir paragraf oluşturmak için hangi etiket kullanılır?", 
                { a: "<div>", b: "<p>", c: "<span>", d: "<text>" }, "b", "Programming", "Kolay"),
            new Soru("CSS'de bir elementin rengini değiştirmek için hangi özellik kullanılır?", 
                { a: "background", b: "font-size", c: "color", d: "margin" }, "c", "Programming", "Kolay"),
            new Soru("JavaScript'te bir değişken tanımlamak için hangi anahtar kelime kullanılır?", 
                { a: "variable", b: "var", c: "define", d: "create" }, "b", "Programming", "Kolay"),
            new Soru("Hangi dosya uzantısı JavaScript dosyaları için kullanılır?", 
                { a: ".js", b: ".java", c: ".jsx", d: ".script" }, "a", "Programming", "Kolay"),
            new Soru("CSS'de 'class' seçicisi nasıl tanımlanır?", 
                { a: "#class", b: ".class", c: "@class", d: "class" }, "b", "Programming", "Kolay")
        ],
        "Orta": [
            new Soru("Which of the following is a JavaScript package management application?", 
                { a: "Node.js", b: "TypeScript", c: "NuGet", d: "npm"}, "d", "Programming", "Orta", "Think about what manages packages in Node.js projects"),
            new Soru("Which of the following is NOT considered part of frontend development?", 
                { a: "CSS", b: "HTML", c: "JavaScript", d: "SQL" }, "d", "Programming", "Orta", "Consider what runs in the browser vs. on the server"),
            new Soru("Which of the following is considered part of backend development?", 
                { a: "Node.js", b: "TypeScript", c: "Angular", d: "React" }, "a", "Programming", "Orta", "Think about server-side JavaScript runtime"),
            new Soru("Which of the following does NOT use the JavaScript programming language?", 
                { a: "React", b: "Angular", c: "Vue.js", d: "ASP.NET" }, "d", "Programming", "Orta", "Consider which technology is from Microsoft"),
            new Soru("React'te state yönetimi için hangi hook kullanılır?", 
                { a: "useEffect", b: "useState", c: "useContext", d: "useCallback" }, "b", "Programming", "Orta", "Think about the hook that manages component state")
        ],
        "Zor": [
            new Soru("JavaScript'te closure nedir?", 
                { a: "Bir döngü türü", b: "Bir veri tipi", c: "Bir fonksiyonun dış kapsamdaki değişkenlere erişebilmesi", d: "Bir hata türü" }, "c", "Programming", "Zor"),
            new Soru("Big O notasyonunda O(log n) karmaşıklığı neyi ifade eder?", 
                { a: "Sabit zaman", b: "Logaritmik zaman", c: "Doğrusal zaman", d: "Üssel zaman" }, "b", "Programming", "Zor"),
            new Soru("Database normalizasyonunda 3NF (Third Normal Form) ne anlama gelir?", 
                { a: "Üçüncü normal format", b: "Üç nitelikli format", c: "Geçişli bağımlılıkların kaldırılması", d: "Üç tablolu format" }, "c", "Programming", "Zor")
        ]
    },
    "Science": {
        "Kolay": [
            new Soru("Güneş sisteminde kaç gezegen vardır?", 
                { a: "7", b: "8", c: "9", d: "10" }, "b", "Science", "Kolay"),
            new Soru("Suyun kimyasal formülü nedir?", 
                { a: "H2O", b: "CO2", c: "O2", d: "H2SO4" }, "a", "Science", "Kolay"),
            new Soru("En büyük gezegen hangisidir?", 
                { a: "Satürn", b: "Jüpiter", c: "Neptün", d: "Dünya" }, "b", "Science", "Kolay"),
            new Soru("Işık hızı saniyede yaklaşık kaç kilometre?", 
                { a: "300.000 km", b: "150.000 km", c: "450.000 km", d: "600.000 km" }, "a", "Science", "Kolay")
        ],
        "Orta": [
            new Soru("DNA'nın açılımı nedir?", 
                { a: "Deoksiribosenükleikasit", b: "Diribosenükleikasit", c: "Deoksiribonükleikasit", d: "Dioksiribonükleikasit" }, "c", "Science", "Orta"),
            new Soru("Periyodik tabloda altının sembolü nedir?", 
                { a: "Al", b: "Au", c: "Ag", d: "At" }, "b", "Science", "Orta"),
            new Soru("Karbondioksitin molekül ağırlığı yaklaşık kaçtır?", 
                { a: "28", b: "32", c: "44", d: "16" }, "c", "Science", "Orta")
        ],
        "Zor": [
            new Soru("Schrödinger denkleminin temel prensibi nedir?", 
                { a: "Klasik mekanik", b: "Kuantum mekaniği", c: "Termodinamik", d: "Elektromagnetizma" }, "b", "Science", "Zor"),
            new Soru("Hawking radyasyonu neyle ilgilidir?", 
                { a: "Yıldızlar", b: "Kara delikler", c: "Gezegenler", d: "Galaksiler" }, "b", "Science", "Zor")
        ]
    },
    "History": {
        "Kolay": [
            new Soru("Türkiye Cumhuriyeti hangi yıl kurulmuştur?", 
                { a: "1920", b: "1921", c: "1922", d: "1923" }, "d", "History", "Kolay"),
            new Soru("İstanbul'un fethi hangi yıl gerçekleşmiştir?", 
                { a: "1453", b: "1454", c: "1452", d: "1455" }, "a", "History", "Kolay"),
            new Soru("I. Dünya Savaşı hangi yıllarda yaşanmıştır?", 
                { a: "1912-1916", b: "1914-1918", c: "1913-1917", d: "1915-1919" }, "b", "History", "Kolay")
        ],
        "Orta": [
            new Soru("Osmanlı İmparatorluğu'nun en uzun süre hüküm süren padişahı kimdir?", 
                { a: "Kanuni Sultan Süleyman", b: "II. Abdülhamid", c: "I. Murad", d: "IV. Murad" }, "a", "History", "Orta"),
            new Soru("Fransız Devrimi hangi yıl başlamıştır?", 
                { a: "1788", b: "1789", c: "1790", d: "1791" }, "b", "History", "Orta")
        ],
        "Zor": [
            new Soru("Bizans İmparatorluğu'nun son imparatoru kimdir?", 
                { a: "IX. Konstantin", b: "XI. Konstantin", c: "VIII. İoannes", d: "VII. İoannes" }, "b", "History", "Zor")
        ]
    },
    "Sports": {
        "Kolay": [
            new Soru("Futbolda bir takımda kaç oyuncu bulunur?", 
                { a: "10", b: "11", c: "12", d: "9" }, "b", "Sports", "Kolay"),
            new Soru("Basketbolda basket yüksekliği kaç metredir?", 
                { a: "3.05m", b: "3.00m", c: "3.10m", d: "2.95m" }, "a", "Sports", "Kolay"),
            new Soru("Olimpiyat oyunları kaç yılda bir düzenlenir?", 
                { a: "3", b: "4", c: "5", d: "6" }, "b", "Sports", "Kolay")
        ],
        "Orta": [
            new Soru("2018 FIFA Dünya Kupası'nı hangi ülke kazanmıştır?", 
                { a: "Brezilya", b: "Almanya", c: "Fransa", d: "Arjantin" }, "c", "Sports", "Orta"),
            new Soru("Teniste Grand Slam turnuvaları kaç tanedir?", 
                { a: "3", b: "4", c: "5", d: "6" }, "b", "Sports", "Orta")
        ],
        "Zor": [
            new Soru("Formula 1'de en çok şampiyonluk kazanan pilot kimdir?", 
                { a: "Ayrton Senna", b: "Michael Schumacher", c: "Lewis Hamilton", d: "Sebastian Vettel" }, "c", "Sports", "Zor")
        ]
    }
};

// Current quiz state
let currentCategory = "Programming";
let currentDifficulty = "Orta";
let currentQuestionSet = [];

// Initialize with default questions for backward compatibility
const soruListesi = questionBank[currentCategory][currentDifficulty];

const quiz = new Quiz(soruListesi);
const ui = new UI();

// Category icons mapping
const categoryIcons = {
    "Programming": "bi-code-slash",
    "Science": "bi-atom", 
    "History": "bi-book",
    "Sports": "bi-trophy"
};

// Navigation event handlers
ui.btnStart.addEventListener("click", function(){
    ui.showScreen("category");
});

ui.btnBack.addEventListener("click", function(){
    ui.showScreen("start");
});

ui.btnBackToCategory.addEventListener("click", function(){
    ui.showScreen("category");
});

// Category selection
document.addEventListener("click", function(e) {
    if (e.target.closest(".category-card")) {
        const categoryCard = e.target.closest(".category-card");
        const selectedCategory = categoryCard.dataset.category;
        currentCategory = selectedCategory;
        
        // Update UI to show selected category
        ui.updateSelectedCategory(selectedCategory, categoryIcons[selectedCategory]);
        ui.updateDifficultyQuestionCounts(selectedCategory);
        
        // Show difficulty selection screen
        ui.showScreen("difficulty");
    }
});

// Difficulty selection
document.addEventListener("click", function(e) {
    if (e.target.closest(".difficulty-card")) {
        const difficultyCard = e.target.closest(".difficulty-card");
        
        // Remove previous selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        difficultyCard.classList.add('selected');
        
        currentDifficulty = difficultyCard.dataset.difficulty;
        
        // Update button state
        ui.btnStartQuiz.disabled = false;
        ui.btnStartQuiz.style.opacity = '1';
    }
});

// Start quiz with selected category and difficulty
ui.btnStartQuiz.addEventListener("click", function(){
    if (!currentCategory || !currentDifficulty) return;
    
    // Initialize quiz with selected questions
    currentQuestionSet = questionBank[currentCategory][currentDifficulty];
    quiz.sorular = currentQuestionSet;
    quiz.soruIndex = 0;
    quiz.dogruCevapSayisi = 0;
    
    // Reset lifelines
    lifelinesManager.resetLifelines();
    
    // Determine timer based on difficulty
    let timerDuration = 10; // default
    if (currentDifficulty === "Kolay") timerDuration = 15;
    else if (currentDifficulty === "Zor") timerDuration = 8;
    
    startTimer(timerDuration);
    startTimerLine();
    ui.showScreen("quiz");
    ui.soruGoster(quiz.soruGetir());
    ui.soruSayisiniGoster(quiz.soruIndex + 1, quiz.sorular.length);
    ui.btnNext.classList.remove("show");
});

ui.btnNext.addEventListener("click", function() {
    if(quiz.sorular.length != quiz.soruIndex) {
        // Determine timer based on difficulty
        let timerDuration = 10; // default
        if (currentDifficulty === "Kolay") timerDuration = 15;
        else if (currentDifficulty === "Zor") timerDuration = 8;
        
        startTimer(timerDuration);
        startTimerLine();
        ui.soruGoster(quiz.soruGetir());
        ui.soruSayisiniGoster(quiz.soruIndex + 1, quiz.sorular.length);
        ui.btnNext.classList.remove("show");
        ui.timeText.textContent = "Time Left";
    } else {
        // Quiz completed - save user stats
        userManager.updateUserStats(
            quiz.dogruCevapSayisi, 
            quiz.sorular.length, 
            currentCategory, 
            currentDifficulty
        );
        
        ui.showScreen("score");
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
    // Reset quiz state
    quiz.soruIndex = 0;
    quiz.dogruCevapSayisi = 0;
    currentCategory = "Programming";
    currentDifficulty = "Orta";
    
    // Reset difficulty selection
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.classList.remove('selected');
    });
    ui.btnStartQuiz.disabled = true;
    ui.btnStartQuiz.style.opacity = '0.5';
    
    ui.showScreen("start");
});

ui.btnReplay.addEventListener("click", function(){
    quiz.soruIndex = 0;
    quiz.dogruCevapSayisi = 0;
    
    // Restart with same category and difficulty
    currentQuestionSet = questionBank[currentCategory][currentDifficulty];
    quiz.sorular = currentQuestionSet;
    
    // Determine timer based on difficulty
    let timerDuration = 10; // default
    if (currentDifficulty === "Kolay") timerDuration = 15;
    else if (currentDifficulty === "Zor") timerDuration = 8;
    
    startTimer(timerDuration);
    startTimerLine();
    ui.showScreen("quiz");
    ui.soruGoster(quiz.soruGetir());
    ui.soruSayisiniGoster(quiz.soruIndex + 1, quiz.sorular.length);
    ui.btnNext.classList.remove("show");
    ui.timeText.textContent = "Time Left";
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

// Lifelines Management System
class LifelinesManager {
    constructor() {
        this.lifelines = {
            'fifty-fifty': { count: 1, used: false },
            'hint': { count: 1, used: false },
            'extra-time': { count: 1, used: false }
        };
        this.initializeLifelines();
    }

    initializeLifelines() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lifeline-item')) {
                const lifelineItem = e.target.closest('.lifeline-item');
                const lifelineType = lifelineItem.dataset.lifeline;
                this.useLifeline(lifelineType);
            }
        });
    }

    useLifeline(type) {
        const lifeline = this.lifelines[type];
        
        if (lifeline.count <= 0 || lifeline.used) {
            this.showMessage("This lifeline has already been used!", "warning");
            return;
        }

        switch(type) {
            case 'fifty-fifty':
                this.useFiftyFifty();
                break;
            case 'hint':
                this.useHint();
                break;
            case 'extra-time':
                this.useExtraTime();
                break;
        }

        // Mark as used and update UI
        lifeline.count--;
        lifeline.used = true;
        this.updateLifelineUI(type);
    }

    useFiftyFifty() {
        const options = document.querySelectorAll('.option');
        const currentQuestion = quiz.soruGetir();
        const correctAnswer = currentQuestion.dogruCevap;
        
        // Get wrong answers
        const wrongAnswers = Object.keys(currentQuestion.cevapSecenekleri)
            .filter(key => key !== correctAnswer);
        
        // Randomly select 2 wrong answers to hide
        const toHide = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        options.forEach(option => {
            const optionLetter = option.textContent[0].toLowerCase();
            if (toHide.includes(optionLetter)) {
                option.style.opacity = '0.3';
                option.style.pointerEvents = 'none';
                option.style.textDecoration = 'line-through';
            }
        });

        this.showMessage("Two wrong answers have been eliminated!", "success");
    }

    useHint() {
        const currentQuestion = quiz.soruGetir();
        const hint = currentQuestion.ipucu;
        
        if (hint) {
            this.showHintModal(hint);
        } else {
            this.showMessage("No hint available for this question.", "info");
        }
    }

    useExtraTime() {
        // Add 10 seconds to current timer
        const currentTime = parseInt(ui.timeSecond.textContent);
        const newTime = currentTime + 10;
        
        // Update the timer display
        ui.timeSecond.textContent = newTime;
        
        this.showMessage("+10 seconds added!", "success");
    }

    showHintModal(hint) {
        // Create and show hint modal
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        modal.innerHTML = `
            <div class="hint-content">
                <div class="hint-header">
                    <i class="bi bi-lightbulb"></i>
                    <h3>Hint</h3>
                </div>
                <p>${hint}</p>
                <button class="btn-close-hint">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close hint modal
        modal.querySelector('.btn-close-hint').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 5000);
    }

    showMessage(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateLifelineUI(type) {
        const lifelineItem = document.querySelector(`[data-lifeline="${type}"]`);
        const countElement = lifelineItem.querySelector('.lifeline-count');
        
        lifelineItem.classList.add('used');
        countElement.textContent = '0';
        lifelineItem.style.opacity = '0.5';
        lifelineItem.style.pointerEvents = 'none';
    }

    resetLifelines() {
        // Reset lifelines for new quiz
        Object.keys(this.lifelines).forEach(key => {
            this.lifelines[key].count = 1;
            this.lifelines[key].used = false;
        });

        // Reset UI
        document.querySelectorAll('.lifeline-item').forEach(item => {
            item.classList.remove('used');
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            item.querySelector('.lifeline-count').textContent = '1';
        });
    }
}

// Initialize lifelines manager
const lifelinesManager = new LifelinesManager();

// Dark Mode System
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('quizmaster_theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.initializeTheme();
        this.bindEvents();
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateToggleIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('quizmaster_theme', this.currentTheme);
        this.updateToggleIcon();
        
        // Add transition class for smooth animation
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    updateToggleIcon() {
        const toggleButton = document.querySelector('.theme-toggle i');
        if (toggleButton) {
            toggleButton.className = this.currentTheme === 'light' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        }
    }

    bindEvents() {
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('quizmaster_theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.initializeTheme();
            }
        });

        // Theme toggle button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Profile System Event Handlers
document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.querySelector("#username");
    const btnContinue = document.querySelector(".btn-continue");
    const btnChangeUser = document.querySelector(".btn-change-user");
    const returningUser = document.querySelector(".returning-user");

    // Username input validation
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            const username = this.value.trim();
            btnContinue.disabled = username.length < 2;
            btnContinue.style.opacity = username.length >= 2 ? '1' : '0.5';
        });

        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !btnContinue.disabled) {
                btnContinue.click();
            }
        });
    }

    // Continue button
    if (btnContinue) {
        btnContinue.addEventListener('click', function() {
            const username = usernameInput.value.trim();
            if (username.length >= 2) {
                const userId = userManager.createUser(username);
                userManager.setCurrentUser(userId);
                userManager.proceedToStart();
            }
        });
    }

    // Change user button
    if (btnChangeUser) {
        btnChangeUser.addEventListener('click', function() {
            returningUser.style.display = 'none';
            document.querySelector('.profile-form .input-group').style.display = 'block';
            document.querySelector('.btn-continue').style.display = 'flex';
            usernameInput.value = '';
            usernameInput.focus();
        });
    }

    // Returning user click to continue
    if (returningUser) {
        returningUser.addEventListener('click', function() {
            userManager.proceedToStart();
        });
    }
});