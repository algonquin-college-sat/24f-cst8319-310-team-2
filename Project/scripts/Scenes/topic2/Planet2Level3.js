class Planet2Level3 extends Phaser.Scene {
    constructor() {
        super("Planet2Level3");
    }

    preload() {
        // Load assets
        this.load.image("background", "assets/topic2/level2/lvl2background.png");
        this.load.video("weDidIt", "assets/topic2/level2/WE DID IT!.mp4");
        this.load.image("fueltank", "assets/topic2/level2/fueltank.png");
        this.load.audio('winSound', 'assets/topic2/music/win.mp3');  // Incorrect bin placement
        this.load.audio('gameOverSound', 'assets/topic2/music/GameOver.mp3'); // Game over sound
        this.load.audio('correctSound', 'assets/topic2/music/correctAnswer.mp3'); // Correct bin placement
        this.load.audio('wrongSound', 'assets/topic2/music/wrongAnswer.mp3');
        this.load.audio('kidsclapping', 'assets/topic2/music/kidsclapping.mp3');
    }

    create() {
        // Background
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, "background").setDisplaySize(window.innerWidth, window.innerHeight).setAlpha(0.5);
        this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 0.5 });
        this.backgroundMusic.play();
        // Score display
        this.score = 0;
        this.add.graphics()
            .fillStyle(0xFFA500, 1)
            .fillRoundedRect(20, 20, 120, 50, 10);
        this.scoreText = this.add.text(30, 30, `Score: ${this.score}`, {
            fontSize: "20px",
            fontWeight: "bold",
            color: "#000",
        });

        // Help box
        const helpBox = this.add.graphics()
            .fillStyle(0xFF0000, 1)
            .fillRoundedRect(window.innerWidth - 150, 20, 120, 50, 10);
        this.add.text(window.innerWidth - 140, 30, "HELP", {
            fontSize: "20px",
            fontWeight: "bold",
            color: "#FFF",
        }).setInteractive().on("pointerdown", () => this.displayHint());

        // Pink box for quiz
        // Pink box for quiz
this.add.graphics()
.fillStyle(0xFFC0CB, 1) // Pink color
.fillRoundedRect(100, 100, window.innerWidth - 200, window.innerHeight - 200, 10);

        // Initialize questions
        this.currentQuestionIndex = 0;

        this.questions = [
            {
                question: "What is the primary benefit of hemp plants for the ecosystem?",
                options: [
                    "They absorb more CO2 than trees.",
                    "They release harmful gases.",
                    "They reduce soil fertility.",
                    "They are not useful.",
                ],
                correct: 0,
                hint: "Hemp plants are known for their carbon absorption abilities.",
            },
            {
                question: "What can hemp fibers be recycled into?",
                options: [
                    "Plastic bottles",
                    "Paper and textiles",
                    "Metal sheets",
                    "Glass containers",
                ],
                correct: 1,
                hint: "Hemp fibers are versatile and commonly used in soft materials.",
            },
            {
                question: "Which part of the hemp plant is most useful for biofuel production?",
                options: [
                    "Seeds",
                    "Leaves",
                    "Stalks",
                    "Roots",
                ],
                correct: 2,
                hint: "Biofuel is often made from the fibrous parts of plants.",
            },
            {
                question: "How can hemp help in soil restoration?",
                options: [
                    "By reducing nitrogen in the soil",
                    "By absorbing heavy metals",
                    "By making soil infertile",
                    "By drying out the soil",
                ],
                correct: 1,
                hint: "Hemp plants are known to clean toxins from the soil.",
            },
            {
                question: "What is a key advantage of using hemp products?",
                options: [
                    "They are biodegradable.",
                    "They are expensive.",
                    "They are non-renewable.",
                    "They pollute the environment.",
                ],
                correct: 0,
                hint: "Hemp products break down naturally over time.",
            },
            {
                question: "What ecosystem service does hemp provide?",
                options: [
                    "Disrupts local flora",
                    "Supports biodiversity",
                    "Blocks sunlight for other plants",
                    "Requires no water",
                ],
                correct: 1,
                hint: "Hemp plants can coexist with various species.",
            },
        ];

        this.displayQuestion();
    }

    displayQuestion() {
        if (this.questionText) this.questionText.destroy();
        if (this.optionTexts) this.optionTexts.forEach((text) => text.destroy());
        if (this.optionDividers) this.optionDividers.forEach((line) => line.destroy());
        if (this.nextButton) this.nextButton.destroy();

        const question = this.questions[this.currentQuestionIndex];

        // Display question
        this.questionText = this.add.text(100, 150, question.question, {
            fontSize: "28px",
            fontWeight: "bold",
            color: "#000",
            wordWrap: { width: window.innerWidth - 200 },
        });

        // Display options
        this.optionTexts = [];
        this.optionDividers = [];
        question.options.forEach((option, index) => {
            const yPosition = 250 + index * 70;
            const optionText = this.add.text(120, yPosition, `${index + 1}. ${option}`, {
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
            }).setInteractive();

            // Check answer on click
            optionText.on("pointerdown", () => this.checkAnswer(index));

            this.optionTexts.push(optionText);

            // Line between options
            const line = this.add.graphics().lineStyle(2, 0xCCCCCC).moveTo(100, yPosition + 40).lineTo(window.innerWidth - 100, yPosition + 40).strokePath();
            this.optionDividers.push(line);
        });
    }

    checkAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const correct = selectedIndex === question.correct;

        // Play correct or wrong sound
        if (correct) {
            this.sound.play("correctSound");
        } else {
            this.sound.play("wrongSound");
        }

        // Update option colors
        this.optionTexts[selectedIndex].setColor(correct ? "#00FF00" : "#FF0000");
        if (!correct) this.optionTexts[question.correct].setColor("#00FF00");

        // Update score
        if (correct) this.score++;
        this.scoreText.setText(`Score: ${this.score}`);

        this.time.delayedCall(1000, () => this.moveToNextQuestion());
    }

    moveToNextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    displayHint() {
        const question = this.questions[this.currentQuestionIndex];
        const hintBox = this.add.graphics()
            .fillStyle(0xFFFFFF, 1)
            .fillRoundedRect(window.innerWidth / 2 - 150, window.innerHeight / 2 - 60, 800, 100, 10);
        const hintText = this.add.text(window.innerWidth / 2 - 140, window.innerHeight / 2 - 30, question.hint, {
            fontSize: "18px",
            fontWeight: "bold",
            color: "#000",
        });

        this.time.delayedCall(3000, () => {
            hintBox.destroy();
            hintText.destroy();
        });
    }
    endQuiz() {
        // Dim the background with a semi-transparent overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7); // Black with 70% opacity
        overlay.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
        // Stop background music
        this.backgroundMusic.stop();
    
        // Play win or game over sound
        const isWin = this.score >= 4;
        this.sound.play(isWin ? "winSound" : "gameOverSound");
    
        // Display the result message
        const message = isWin
            ? "Congratulations! You earned the Fuel Tank!"
            : "Game Over! Try again to earn enough points!";
    
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 100, message, {
            fontSize: "40px",
            fontWeight: "bold",
            color: "#FFFFFF",
            align: "center",
            wordWrap: { width: window.innerWidth - 100 },
        }).setOrigin(0.5);
    
        if (isWin) {
            // Display the fuel tank image
            const fuelTank = this.add.image(window.innerWidth / 2, window.innerHeight / 2 + 50, "fueltank")
                .setScale(0.5) // Adjust scale as needed
                .setOrigin(0.5);
    
            // Delay to display the "We Did It!" video
            this.time.delayedCall(3000, () => {
                fuelTank.destroy(); // Remove the fuel tank image
    
                // Play the "We Did It!" video
                const weDidItVideo = this.add.video(window.innerWidth / 2, window.innerHeight / 2, "weDidIt")
                .setOrigin(0.5);

                const kidsClappingSound = this.sound.add("kidsclapping", { volume: 1.0 });
                kidsClappingSound.play();

                weDidItVideo.play();
            // Apply a custom scale to decrease the video size
            const customScale = 0.80; // Adjust this value (e.g., 0.5 for half size)
            weDidItVideo.setScale(customScale);

            weDidItVideo.play();
                // Transition to the next scene after the video ends
                weDidItVideo.on("complete", () => {
                    //window.location.href = "../../savio/SoftwareProject-Savio-GB/Eco-Adv/index.html"; // Replace with the next scene's key
                    this.scene.start("Planet3Level1");
                });
    
                // Handle video playback error
                weDidItVideo.on("error", () => {
                    console.error("Video playback error");
                    //window.location.href = "../../savio/SoftwareProject-Savio-GB/Eco-Adv/index.html";
                    this.scene.start("Planet3Level1");
                });
            });
        } else {
            // Restart the quiz if the score is insufficient
            this.time.delayedCall(3000, () => {
                this.scene.restart();
            });
        }
    }
    saveProgress() {
        // Save current progress to localStorage
        localStorage.setItem(
            "playerProgress",
            JSON.stringify({
            currentScene: "Planet2Level3",
            currentDialogueIndex: this.currentDialogueIndex,
            isShaking: this.isShaking,
            })
        );
    }
}    