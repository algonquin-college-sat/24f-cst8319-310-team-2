export default class QuizScene extends Phaser.Scene {
    constructor() {
      super({ key: 'QuizScene' });
    }
  
    preload() {
      this.load.image('quiz-bg', 'images/background.jpg');
      this.load.image('leaf', 'images/leaf.png');
      this.load.on('filecomplete-image-quiz-bg', () => console.log('Quiz background loaded successfully.'));
      this.load.on('loaderror', (file) => console.error('Failed to load:', file.key));
    }
  
    create() {
      this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'quiz-bg')
        .setDisplaySize(window.innerWidth, window.innerHeight);
  
      this.add.text(window.innerWidth / 2, 50, 'Environmental Quiz', {
        fontSize: '32px',
        fill: '#000',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.particles(0, 0, 'leaf', {
        x: { min: 0, max: window.innerWidth },
        y: -50,
        lifespan: 4000,
        speedY: { min: 100, max: 200 },
        speedX: { min: -100, max: 100 },
        angle: { min: 0, max: 360 },
        rotate: { min: 0, max: 360 },
        scale: { start: 0.4, end: 0.2 },
        quantity: 2,
        frequency: 200,
        alpha: { start: 1, end: 0.5 }
    });
  
      this.questions = [
        {
          question: 'Why is it important to control pollution caused by factories?',
          options: [
            'Factories can produce smog and health problems through toxic emissions',
            'Factory pollution increases agricultural productivity',
            'Factories provide renewable energy sources'
          ],
          correct: 0
        },
        {
          question: 'What is the benefit of planting trees in the environment?',
          options: [
            'They increase soil salinity',
            'Trees help clean the air and make it fresh to breathe',
            'Trees emit nitrogen oxides that aid in plant growth'
          ],
          correct: 1
        },
        {
          question: 'What is a sustainable way to reduce transportation pollution?',
          options: [
            'Encourage more private vehicle usage',
            'Switch to electric cars or use public transport',
            'Build more highways for smoother traffic flow'
          ],
          correct: 1
        },
        {
          question: 'What should be done to mitigate the harmful effects of construction dust?',
          options: [
            'Encourage more open burning near construction sites',
            'Cover construction materials and clean regularly',
            'Relocate construction projects to rural areas'
          ],
          correct: 1
        },
        {
          question: 'What is a key environmental benefit of using solar panels and windmills?',
          options: [
            'They produce energy without any harmful smoke or emissions',
            'They accelerate the natural cycle of greenhouse gases',
            'They create high levels of particulate matter to counteract pollution'
          ],
          correct: 0
        }
      ];
  
      this.currentQuestionIndex = 0;
      this.userAnswers = new Array(this.questions.length).fill(null);
      this.score = 0;
      this.showQuestion(this.currentQuestionIndex);
    }
  
    showQuestion(index) {
        const questionBox = this.add.graphics();
        questionBox.fillStyle(0xffffff, 1);
        questionBox.fillRoundedRect(window.innerWidth / 2 - 300, window.innerHeight / 2 - 200, 600, 400, 20);
      
        const currentQuestion = this.questions[index];
        const optionsWithIndices = currentQuestion.options.map((option, index) => ({
          text: option,
          originalIndex: index
        }));
      
        for (let i = optionsWithIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
        }
      
        this.questionText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 150,
          `Question ${index + 1} of ${this.questions.length}`, {
            fontSize: '20px',
            fill: '#000',
            fontStyle: 'bold'
          }).setOrigin(0.5);
      
        this.questionContent = this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 100,
          currentQuestion.question, {
            fontSize: '24px',
            fill: '#000',
            fontStyle: 'bold',
            wordWrap: { width: 550 }
          }).setOrigin(0.5);
      
        this.optionTexts = [];
        optionsWithIndices.forEach((option, optIndex) => {
          let optionText = this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 2 - 20 + 60 * optIndex,
            option.text,
            {
              fontSize: '20px',
              fill: '#000',
              backgroundColor: '#ddd',
              padding: { left: 20, right: 20, top: 10, bottom: 10 },
              wordWrap: { width: 500 },
              align: 'center'
            }
          ).setInteractive().setOrigin(0.5);
      
          optionText.on('pointerover', () => this.hoverOption(optionText, true));
          optionText.on('pointerout', () => this.hoverOption(optionText, false));
          optionText.on('pointerdown', () => this.selectOption(index, option.originalIndex));
          this.optionTexts.push(optionText);
        });
      }
      
      hoverOption(optionBackground, isHovering) {
        optionBackground.fillStyle(isHovering ? 0xbbbbbb : 0xdddddd, 1);
        optionBackground.fillRoundedRect(
          optionBackground.x,
          optionBackground.y,
          optionBackground.width,
          optionBackground.height,
          10
        );
      }
  
    hoverOption(optionText, isHovering) {
      optionText.setStyle({ backgroundColor: isHovering ? '#bbb' : '#ddd' });
    }
  
    selectOption(questionIndex, selectedOptionIndex) {
      this.userAnswers[questionIndex] = selectedOptionIndex;
      this.questionText.setVisible(false);
      this.questionContent.setVisible(false);
      this.optionTexts.forEach(optionText => optionText.setVisible(false));
      this.reviewAnswer(questionIndex);
    }
  
    reviewAnswer(index) {
      const question = this.questions[index];
      const isCorrect = this.userAnswers[index] === question.correct;
      if (isCorrect) {
        this.score++;
      }
  
      const containerBox = this.add.graphics();
      containerBox.fillStyle(0xffffff, 1);
      containerBox.fillRoundedRect(window.innerWidth / 2 - 300, window.innerHeight / 2 - 150, 600, 300, 20);
  
      this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 100,
        isCorrect ? 'Correct!' : 'Incorrect', {
          fontSize: '28px',
          fill: isCorrect ? '#4CAF50' : '#F44336',
          fontStyle: 'bold'
        }).setOrigin(0.5);
  
      this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 60,
        `Score: ${this.score}/${this.questions.length}`, {
          fontSize: '20px',
          fill: '#000',
          fontStyle: 'bold'
        }).setOrigin(0.5);
  
      this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 20, 'Explanation:', {
        fontSize: '20px',
        fill: '#000',
        fontStyle: 'bold'
      }).setOrigin(0.5);
  
      const explanations = [
        "Factory pollution can lead to serious health issues and environmental degradation, making control measures essential.",
        "Trees act as natural air purifiers, absorbing pollutants and releasing clean oxygen, improving overall air quality.",
        "Electric cars and public transport significantly reduce emissions compared to traditional vehicles, helping combat air pollution.",
        "Proper dust management in construction sites reduces air pollution and protects workers' and nearby residents' health.",
        "Solar panels and windmills generate clean energy without producing harmful emissions, reducing reliance on fossil fuels."
      ];
  
      this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 20, explanations[index], {
        fontSize: '18px',
        fill: '#333',
        wordWrap: { width: 500 },
        align: 'center'
      }).setOrigin(0.5);
  
      const isLastQuestion = index === this.questions.length - 1;
      const buttonText = isLastQuestion ? 'Finish Quiz' : 'Next Question';
      this.continueButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 100, buttonText, {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#4CAF50',
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
      }).setInteractive().setOrigin(0.5);
  
      this.continueButton.on('pointerover', () => this.hoverOption(this.continueButton, true));
      this.continueButton.on('pointerout', () => this.hoverOption(this.continueButton, false));
      this.continueButton.on('pointerdown', () => {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
          this.showQuestion(this.currentQuestionIndex);
        } else {
          this.showFinalResult();
        }
      });
    }
  
    showFeedback(message, color) {
      const feedbackBox = this.add.graphics();
      feedbackBox.fillStyle(0xffffff, 1);
      feedbackBox.fillRoundedRect(window.innerWidth / 2 - 300, window.innerHeight / 2 - 100, 600, 100, 20);
      this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 50, message, {
        fontSize: '28px',
        fill: color,
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }
  
    showFinalResult() {
      const percentage = (this.score / this.questions.length) * 100;
      const resultColor = percentage >= 70 ? '#4CAF50' : (percentage >= 40 ? '#FFC107' : '#F44336');
      const resultBox = this.add.graphics();
      resultBox.fillStyle(0xffffff, 1);
      resultBox.fillRoundedRect(window.innerWidth / 2 - 300, window.innerHeight / 2 - 200, 600, 400, 20);
  
      this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 100, 'Quiz Completed!', {
        fontSize: '36px',
        fill: '#000',
        fontStyle: 'bold'
      }).setOrigin(0.5);
  
      this.add.text(window.innerWidth / 2, window.innerHeight / 2, `Your Score: ${this.score}/${this.questions.length} (${percentage.toFixed(1)}%)`, {
        fontSize: '28px',
        fill: resultColor,
        fontStyle: 'bold'
      }).setOrigin(0.5);
  
      const restartButton = this.add.text(window.innerWidth / 2 - 100, window.innerHeight / 2 + 100, 'Retake Quiz', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#4CAF50',
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
      }).setInteractive().setOrigin(0.5);
  
      restartButton.on('pointerover', () => this.hoverOption(restartButton, true));
      restartButton.on('pointerout', () => this.hoverOption(restartButton, false));
      restartButton.on('pointerdown', () => this.scene.restart());
  
      const mainMenuButton = this.add.text(window.innerWidth / 2 + 100, window.innerHeight / 2 + 100, 'Main Menu', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#2196F3',
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
      }).setInteractive().setOrigin(0.5);
  
      mainMenuButton.on('pointerover', () => this.hoverOption(mainMenuButton, true));
      mainMenuButton.on('pointerout', () => this.hoverOption(mainMenuButton, false));
      mainMenuButton.on('pointerdown', () => {
        this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
          if (progress === 1) {
            this.scene.start('TransitionScene', { nextScene: 'MainMenu' });
          }
        });
      });
    }
  
    clearContent() {
      this.children.list.forEach(child => child.destroy());
    }
  }
