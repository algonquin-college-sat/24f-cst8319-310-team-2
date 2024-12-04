class Planet3Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Planet3Level3' });
        this.questions = [];
    }

    preload() {
        this.load.image('quiz-background', 'assets/bg.jpg');
        this.load.image('button', 'assets/button.png');
    }

    create() {
        // Initialize values using the registry
        this.registry.set('score', 0);
        this.registry.set('wrongAnswers', 0);
        this.registry.set('currentQuestionIndex', 0);

        // Background
        let bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'quiz-background');
        bg.setScale(this.scale.width / bg.width);

        // Title
        this.add.text(this.scale.width / 2, 50, 'Quiz Show!', {
            fontSize: '36px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instruction
        this.add.text(this.scale.width / 2, 100, 'Answer questions about renewable energy to win!', {
            fontSize: '24px',
            fill: '#ffff00'
        }).setOrigin(0.5);

        // Initialize questions
        this.questions = this.generateQuestions();
        this.shuffleArray(this.questions); // Shuffle the questions
        this.displayQuestion();

        // Score Text
        this.scoreText = this.add.text(20, 20, `Score: ${this.registry.get('score')}`, {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Wrong Answer Counter
        this.wrongText = this.add.text(this.scale.width - 200, 20, `Mistakes: ${this.registry.get('wrongAnswers')}/3`, {
            fontSize: '24px',
            fill: '#ff0000'
        });

        // Event listener for next question
        this.input.on('gameobjectdown', (pointer, button) => {
            if (button.correct) {
                let score = this.registry.get('score');
                this.registry.set('score', score + 10);
                this.scoreText.setText(`Score: ${this.registry.get('score')}`);
            } else {
                let wrongAnswers = this.registry.get('wrongAnswers');
                this.registry.set('wrongAnswers', wrongAnswers + 1);
                this.wrongText.setText(`Mistakes: ${this.registry.get('wrongAnswers')}/3`);
            }

            // Check if player has reached 3 mistakes
            if (this.registry.get('wrongAnswers') >= 3) {
                this.showFailure();
            } else {
                let currentQuestionIndex = this.registry.get('currentQuestionIndex');
                this.registry.set('currentQuestionIndex', currentQuestionIndex + 1);
                this.displayQuestion();
            }
        });
    }

    displayQuestion() {
        // Clear existing question and answers
        if (this.questionText) this.questionText.destroy();
        if (this.answerButtons) {
            this.answerButtons.forEach(button => button.destroy());
        }
    
        // Check if there are no more questions
        if (this.registry.get('currentQuestionIndex') >= this.questions.length) {
            this.showCompletion();
            return;
        }
    
        // Display the next question
        let question = this.questions[this.registry.get('currentQuestionIndex')];
        this.questionText = this.add.text(
            this.scale.width / 2,
            200,
            question.question,
            {
                fontSize: '28px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: this.scale.width - 100 }
            }
        ).setOrigin(0.5);
    
        // Randomize the order of the answers
        this.shuffleArray(question.answers);
    
        // Display answer options
        this.answerButtons = [];
        question.answers.forEach((answer, index) => {
            let button = this.add.sprite(
                this.scale.width / 2,
                300 + index * 80,
                'button'
            ).setInteractive();
            button.setScale(1, 0.6);
    
            let buttonText = this.add.text(button.x, button.y, answer.text, {
                fontSize: '20px',
                fill: '#000'
            }).setOrigin(0.5);
    
            button.correct = answer.correct;
    
            // Add hover effects for style and font size
            button.on('pointerover', () => {
                buttonText.setStyle({ fontStyle: 'bold', fill: '#C6981F', fontSize: '24px' });
                button.setScale(1.2, 0.8);
            });
    
            button.on('pointerout', () => {
                buttonText.setStyle({ fontStyle: 'normal', fill: '#000', fontSize: '20px' });
                button.setScale(1, 0.6);
            });
    
            // Add button and text to the answerButtons array for cleanup later
            this.answerButtons.push(button, buttonText);
        });
    }
    
    showCompletion() {
        // Hide question and answers before showing completion screen
        if (this.questionText) this.questionText.destroy();
        if (this.answerButtons) {
            this.answerButtons.forEach(button => button.destroy());
        }

        // Display completion message
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 100,
            'Quiz Complete!',
            {
                fontSize: '48px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 20,
            'Reward: "Thruster System" – unlocks travel to the next planet.',
            {
                fontSize: '24px',
                fill: '#ffff00'
            }
        ).setOrigin(0.5);

        let menuButton = this.add.text(this.scale.width / 3, this.scale.height / 2 + 50, 'Menu', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        let replayButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Replay', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#555'
        }).setOrigin(0.5).setInteractive();
        replayButton.on('pointerdown', () => {
            this.restartScene(); // Use the restartScene function
        });

        let nextLevelButton = this.add.text((this.scale.width / 3) * 2, this.scale.height / 2 + 50, 'Next Level', {
            fontSize: '24px',
            fill: '#000000',
            backgroundColor: '#ffff00'
        }).setOrigin(0.5).setInteractive();
        nextLevelButton.on('pointerdown', () => {
            this.scene.start('Planet4Level1');
        });
    }

    showFailure() {
        // Hide question and answers before showing failure screen
        if (this.questionText) this.questionText.destroy();
        if (this.answerButtons) {
            this.answerButtons.forEach(button => button.destroy());
        }

        // Display failure message
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 100,
            'Quiz Failed!',
            {
                fontSize: '48px',
                fill: '#ff0000'
            }
        ).setOrigin(0.5);

        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 20,
            'You made too many mistakes. Try again!',
            {
                fontSize: '24px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        let retryButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Retry', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5).setInteractive();
        retryButton.on('pointerdown', () => {
            this.restartScene(); // Use the restartScene function
        });
    }

    restartScene() {
        // Reset variables using the registry
        this.registry.set('currentQuestionIndex', 0);
        this.registry.set('score', 0);
        this.registry.set('wrongAnswers', 0);

        // Restart the scene
        this.scene.restart();
    }

    generateQuestions() {
        return [
            {
                question: 'What does solar power use to create energy?',
                answers: [
                    { text: 'The Sun', correct: true },
                    { text: 'The Wind', correct: false },
                    { text: 'The Water', correct: false }
                ]
            },
            {
                question: 'What is wind energy made from?',
                answers: [
                    { text: 'Spinning turbines', correct: true },
                    { text: 'Burning wood', correct: false },
                    { text: 'Using magnets', correct: false }
                ]
            },
            {
                question: 'What does a hydropower plant use?',
                answers: [
                    { text: 'Flowing water', correct: true },
                    { text: 'A big engine', correct: false },
                    { text: 'The Sun', correct: false }
                ]
            },
            {
                question: 'What renewable energy comes from the Earth\'s heat?',
                answers: [
                    { text: 'Geothermal energy', correct: true },
                    { text: 'Wind energy', correct: false },
                    { text: 'Solar energy', correct: false }
                ]
            },
            {
                question: 'What type of energy uses plant materials like wood and crops?',
                answers: [
                    { text: 'Biomass energy', correct: true },
                    { text: 'Fossil fuels', correct: false },
                    { text: 'Nuclear energy', correct: false }
                ]
            }
        ];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }
}
