class Planet1Level3 extends Phaser.Scene {
    constructor() {
      super({ key: "Planet1Level3" });
      this.score = 0;
      this.questions = [
        {
          question: "Which bin is used for recycling plastic bottles?",
          options: ["Green", "Blue", "Black"],
          correctAnswer: "Blue",
          hint: "Plastic items should go into the blue bin for recycling.",
        },
        {
          question: "What type of waste does a banana peel belong to?",
          options: ["Organic", "Recyclable", "General"],
          correctAnswer: "Organic",
          hint: "This is food waste, which is organic.",
        },
        {
          question: "What bin should a pizza box go into?",
          options: ["Green", "Blue", "Black"],
          correctAnswer: "Black",
          hint: "Pizza boxes often contain grease and food residue, so they belong in the black bin.",
        },
        {
          question: "Which bin is used for recyclable metals?",
          options: ["Blue", "Green", "Black"],
          correctAnswer: "Blue",
          hint: "Metals are recyclable and should go in the blue bin.",
        },
        {
          question: "Where should you dispose of newspaper?",
          options: ["Green", "Blue", "Black"],
          correctAnswer: "Black",
          hint: "Paper items like newspapers belong in the blue bin for recycling.",
        },
      ];
      this.currentQuestionIndex = 0;
      this.isHintVisible = false;
    }
  
    preload() {
      // Load background and assets
      this.load.image("quizBackground", "assets/quizBackground.jpg");
      this.load.audio("lvl1correctSound", "assets/lvl1correctSound.mp3");
      this.load.audio("lvl1wrongSound", "assets/lvl1wrongSound.mp3");
      this.load.audio("lvl1rewardSound", "assets/lvl1rewardSound.mp3");
      this.load.audio("lvl3backgroundMusic", "assets/lvl1backgroundMusic.mp3");
    }
  
    create() {
      // Shuffle questions at the start
      this.shuffleQuestions();

      this.backgroundMusic = this.sound.add("lvl3backgroundMusic", { loop: true, volume: 0.3 });
      this.backgroundMusic.play();
  
      // Display the background
      this.add
        .image(this.scale.width / 2, this.scale.height / 2, "quizBackground")
        .setDisplaySize(this.scale.width, this.scale.height);
  
      // Display score
      this.scoreText = this.add.text(20, 20, `Score: ${this.score}/5`, {
        fontSize: "24px",
        color: "#fff",
      });
  
      // Display the current question
      this.displayQuestion();
  
      // Help Button (for hint)
      this.addHelpButton();
    }
  
    shuffleQuestions() {
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
      }
    }
  
    displayQuestion() {
      const currentQuestion = this.questions[this.currentQuestionIndex];
  
      // Clear previous question and options
      this.clearQuestion();
  
      // Display the question text
      this.questionText = this.add
        .text(this.scale.width / 2, this.scale.height / 4, currentQuestion.question, {
          fontSize: "28px",
          color: "#fff",
          align: "center",
        })
        .setOrigin(0.5);
  
      // Display the options
      currentQuestion.options.forEach((option, index) => {
        const optionButton = this.add
          .text(this.scale.width / 2, this.scale.height / 2 + index * 50, option, {
            fontSize: "24px",
            color: "#fff",
            backgroundColor: "#007BFF",
            padding: { x: 10, y: 5 },
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true }) // Make interactive and show hand cursor
          .on("pointerdown", () => this.checkAnswer(option));
  
        this.optionButtons = this.optionButtons || [];
        this.optionButtons.push(optionButton);
      });
    }
  
    checkAnswer(selectedAnswer) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
  
      // Check if the selected answer is correct
      if (selectedAnswer === currentQuestion.correctAnswer) {
        this.sound.play("lvl1correctSound");
        this.score++;
      } else {
        this.sound.play("lvl1wrongSound");
        this.restartQuiz(); // Restart the quiz if the answer is wrong
        return;
      }
  
      // Update the score display
      this.scoreText.setText(`Score: ${this.score}/5`);
  
      // Move to the next question or finish the quiz
      this.currentQuestionIndex++;
  
      if (this.currentQuestionIndex < this.questions.length) {
        this.displayQuestion();
      } else if (this.score === 5) {
        this.endLevel(); // End the level if all questions are answered correctly
      } else {
        this.restartQuiz(); // Restart the quiz if not all answers are correct
      }
    }
  
    restartQuiz() {
      // Reset the quiz state
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.scoreText.setText(`Score: ${this.score}/5`);
      this.shuffleQuestions(); // Shuffle questions again
      this.displayQuestion(); // Restart the quiz from the first question
    }
  
    clearQuestion() {
      // Clear the previous question text and option buttons
      if (this.questionText) this.questionText.destroy();
      if (this.optionButtons) {
        this.optionButtons.forEach((button) => button.destroy());
        this.optionButtons = [];
      }
    }
  
    endLevel() {
      // If the player answers all questions correctly, give a reward
      this.clearQuestion();
  
      this.add
        .text(this.scale.width / 2, this.scale.height / 2, "Level Complete!\nReward: Navigation System", {
          fontSize: "36px",
          color: "#0f0",
          align: "center",
        })
        .setOrigin(0.5);
  
      // Play the reward sound
      this.sound.play("lvl1rewardSound");
  
      // After a delay, proceed to the next level (Level 4)
      this.time.delayedCall(3000, () => {
        this.backgroundMusic.stop();
        this.scene.start("Scene1"); // Transition to the next planet
      });
    }
  
    addHelpButton() {
      const helpButton = this.add
        .text(this.scale.width / 2, this.scale.height - 100, "Get Hint", {
          fontSize: "24px",
          color: "#fff",
          backgroundColor: "#00aabb",
          padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive();
  
      helpButton.on("pointerdown", () => {
        if (!this.isHintVisible) {
          this.showHint();
        } else {
          this.hideHint();
        }
      });
    }
  
    showHint() {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      this.isHintVisible = true;
  
      if (this.hintText) {
        this.hintText.destroy();
      }
  
      this.hintText = this.add
        .text(this.scale.width / 2, this.scale.height / 3, `Hint: ${currentQuestion.hint}`, {
          fontSize: "20px",
          color: "#fff",
          align: "center",
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0.5);
  
      // Hide the hint after 5 seconds
      this.time.delayedCall(5000, () => {
        if (this.hintText) {
          this.hintText.destroy();
          this.isHintVisible = false;
        }
      });
    }
    saveProgress() {
      // Save current progress to localStorage
      localStorage.setItem(
        "playerProgress",
        JSON.stringify({
          currentScene: "Planet1Level3",
          currentDialogueIndex: this.currentDialogueIndex,
          isShaking: this.isShaking,
        })
      );
    }
  }
  