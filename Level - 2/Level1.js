export default class Level1 extends Phaser.Scene {

    
    constructor() {
        super({ key: 'Level1' });
        this.polluterInfo = [];
        this.isExplaining = false;
        this.pollutersFound = 0;
        this.isIntroComplete = false;
        this.canCheckPolluters = false;
    }

    preload() {
        this.load.image('level-bg', 'images/level1.jpg');
        this.load.audio('click', 'music/click.wav');
        this.load.image('player', 'images/player.webp');
        this.load.image('factory', 'images/factory.avif');
        this.load.image('car', 'images/car.webp');
        this.load.image('smoke', 'images/smoke.jpg');
        this.load.image('bioplant', 'images/bioplant.jpg')
        this.load.image('burn', 'images/burning.avif')
        this.load.image('construction', 'images/construction.jpg')

        this.load.audio('burnExplanation', 'music/level1/burn.mp3');
        this.load.audio('carExplanation', 'music/level1/car.mp3');
        this.load.audio('factoryExplanation', 'music/level1/factory.mp3');
        this.load.audio('start1', 'music/level1/start1.mp3');
        this.load.audio('bioplantExplanation', 'music/level1/biomass.mp3');
        this.load.audio('constructionExplanation', 'music/level1/construction.mp3');
        this.load.audio('finish', 'music/level1/level2complete.mp3');
        this.load.audio('restart', 'music/level1/level2restart.mp3');

        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.key);
        });
    }

    create() {
        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'level-bg')
            .setDisplaySize(window.innerWidth, window.innerHeight);
        this.setupPollutedAir();
        this.setupGameElements();
        this.showInitialGuide();
        this.pollutersFound = 0;
        this.input.keyboard.on('keydown-SPACE', this.dismissExplanation, this);

        this.createNavigationBar();
        this.detector = this.add.graphics();
        this.input.on('pointermove', (pointer) => {
            if (!this.isExplaining) {
                this.updateDetector(pointer.x, pointer.y);
            }
        });

        this.input.on('pointerdown', (pointer) => {
          if (!this.isExplaining && pointer.y > 80 && this.canCheckPolluters) {
            this.checkPolluters(pointer);
          }
        });
    }

    setupPollutedAir() {

        this.pollutedAir = this.add.particles(0, 0, 'smoke', {
          x: { min: 0, max: window.innerWidth },
          y: { min: 0, max: window.innerHeight },
          scale: { start: 1, end: 0 },
          alpha: { start: 0.3, end: 0 },
          tint: 0x666666,
          lifespan: 6000,
          speedY: { min: -20, max: 20 },
          speedX: { min: -20, max: 20 },
          quantity: 2,
          blendMode: 'ADD'
        });
      }

    createTracker() {
        this.trackerContainer = this.add.container(20, 20);
        const trackerBg = this.add.graphics();
        trackerBg.lineStyle(2, 0x000000);
        trackerBg.strokeRect(0, 0, 200, 30);
        trackerBg.fillStyle(0x333333, 0.8);
        trackerBg.fillRect(0, 0, 200, 30);
        
        this.trackerFill = this.add.graphics();
        const trackerLabel = this.add.text(0, -25, 'Pollution Detector', {
            fontSize: '18px',
            fill: '#ffffff',
            padding: { x: 10, y: 5 }
        });
        
        this.trackerContainer.add([trackerBg, this.trackerFill, trackerLabel]);

        this.time.addEvent({
          delay: 100, 
          loop: true,
          callback: () => {
              if (this.canCheckPolluters) {
                  this.trackerContainer.setVisible(true);
              } else {
                  this.trackerContainer.setVisible(false);
              }
          },
      });
    }

    
formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `Time: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

    createNavigationBar() {

        const navBar = this.add.graphics();
        navBar.fillStyle(0x000000, 0.8);
        navBar.fillRect(0, 0, window.innerWidth, 80);
        navBar.setScrollFactor(0);
    
        const sections = this.add.container(0, 0);
        sections.setScrollFactor(0);
    
        const title = this.add.text(window.innerWidth / 2, 40, 'Level 1: Identifying Pollution Sources', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        sections.add(title);
    
        this.createTracker();
        this.trackerContainer.setPosition(20, 25);
    
        this.scoreText = this.add.text(window.innerWidth - 400, 25, 'Progress: 0/5', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        sections.add(this.scoreText);
    
        this.timeLeft = 120;
        this.timeText = this.add.text(window.innerWidth - 200, 25, this.formatTime(this.timeLeft), {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        sections.add(this.timeText);
    
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    setupGameElements() {
        this.polluters = this.physics.add.staticGroup();
        this.polluterInfo = [
          {
              type: 'factory',
              dialogues: [
                  "Oh no! This factory is releasing toxic chemicals!",
                  "These emissions cause smog and health problems.",
                  "We need to install filters and use renewable energy!"
              ]
          },
          {
              type: 'car',
              dialogues: [
                  "This car is a major source of air pollution!",
                  "It produces CO2 and harmful nitrogen oxides.",
                  "Using public transport or electric vehicles can help!"
              ]
          },
          {
              type: 'bioplant',
              dialogues: [
                  "A biomass power plant! It's polluting the air.",
                  "Particulate matter and greenhouse gases are harmful.",
                  "Sustainable biomass and emission controls can reduce impact."
              ]
          },
          {
              type: 'burn',
              dialogues: [
                  "Open burning detected! Smoke and toxins everywhere.",
                  "This practice worsens respiratory problems.",
                  "We need to enforce bans and encourage composting."
              ]
          },
          {
              type: 'construction',
              dialogues: [
                  "Construction sites are generating too much dust!",
                  "Dust irritates the eyes and worsens asthma.",
                  "Cover materials and clean regularly to control dust."
              ]
          }
      ];
      
        Phaser.Utils.Array.Shuffle(this.polluterInfo);
      
        const minDistance = 151; // Approximately 4 cm in pixels (assuming 96 DPI)
        const spawnedPositions = [];
      
        for (let i = 0; i < 5; i++) {
          const type = this.polluterInfo[i];
          let x, y;
          let attempts = 0;
          const maxAttempts = 100;
      
          do {
            x = Phaser.Math.Between(100, window.innerWidth - 100);
            y = Phaser.Math.Between(window.innerHeight / 2, window.innerHeight - 100);
            attempts++;
      
            if (attempts > maxAttempts) {
              console.warn('Could not find a suitable position for all polluters');
              break;
            }
          } while (!this.isValidPosition(x, y, spawnedPositions, minDistance));
      
          if (attempts <= maxAttempts) {
            const polluter = this.polluters.create(x, y, type.type);
            polluter.setData('info', type);
            polluter.setAlpha(0);
            spawnedPositions.push({ x, y });
          }
        }
      }
      
      isValidPosition(x, y, spawnedPositions, minDistance) {
        for (const pos of spawnedPositions) {
          const distance = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);
          if (distance < minDistance) {
            return false;
          }
        }
        return true;
      }

      dismissExplanation() {
        if (this.currentExplanation) {
          const { guide, bubble, polluter } = this.currentExplanation;

          if (this.currentExplanationAudio) {
            this.currentExplanationAudio.stop();
            this.currentExplanationAudio.destroy();
            this.currentExplanationAudio = null;
          }
      
          this.tweens.add({
            targets: [guide, bubble, polluter, this.instructionText],
            alpha: 0,
            scale: 0.5,
            duration: 500,
            onComplete: () => {
              guide.destroy();
              bubble.destroy();
              polluter.destroy();
              this.instructionText.destroy();
              this.isExplaining = false;
              this.currentExplanation = null;
            }
          });
        }
      }

      createGuideBubble(guide, polluterInfo) {
        const padding = 10;
        const bubbleWidth = 300;
        const bubbleHeight = 150;
        
        // Create bubble container at correct position relative to guide
        const bubble = this.add.container(250, guide.y - bubbleHeight - 50);
        
        // Create background graphics
        const background = this.add.graphics();
        background.fillStyle(0xffffff, 1);
        background.lineStyle(4, 0x565656, 1);
        background.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        background.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        
        // Add text
        const text = this.add.text(padding, padding, polluterInfo.dialogues.join('\n\n'), {
            fontSize: '16px',
            fill: '#000000',
            wordWrap: { width: bubbleWidth - (padding * 2) },
            align: 'center',
            fixedWidth: bubbleWidth - (padding * 2)
        });
        text.setX((bubbleWidth - text.width) / 2);
        
        // Add elements to container
        bubble.add([background, text]);
        
        // Ensure visibility
        bubble.setDepth(1000);
        bubble.setAlpha(1);
        
        return bubble;
    }


    createintroGuideBubble(x, y, text) {
      const padding = 10;
      const bubbleWidth = 300;
      const bubbleHeight = 600;
      
      // Create container first
      const container = this.add.container(x, y);
      
      // Create bubble graphics without position offset
      const bubble = this.add.graphics();
      bubble.fillStyle(0xffffff, 1);
      bubble.lineStyle(4, 0x565656, 1);
      bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
      bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
      bubble.fillTriangle(
          bubbleWidth / 2, bubbleHeight,
          bubbleWidth / 2 - 10, bubbleHeight + 10,
          bubbleWidth / 2 + 10, bubbleHeight + 10
      );
      
      // Add text centered in bubble
      const content = this.add.text(bubbleWidth / 2, bubbleHeight / 2, text, {
          fontFamily: 'Arial',
          fontSize: 20,
          color: '#000000',
          align: 'center',
          wordWrap: { width: bubbleWidth - (padding * 2) }
      }).setOrigin(0.5);
      
      // Add elements to container
      container.add([bubble, content]);
      container.setDepth(1000);
      container.setAlpha(0);
      
      return container;
  }
  showInitialGuide() {
    this.guide = this.add.sprite(-100, window.innerHeight - 50, 'player')
      .setScale(0.5)
      .setOrigin(0.5, 1);
  
    this.tweens.add({
      targets: this.guide,
      x: 150,
      duration: 1000,
      ease: 'Back.out',
      onComplete: this.setupDialogue.bind(this)
    });
  }
  
    
  setupDialogue() {
    const dialogue = [
      "Welcome to the first step in our mission to clean the air!",
      "This area is filled with polluters like factories, cars, and burning trash.",
      "They're harming the environment and everyone who lives here.",
      "Use your pollution detector to find the sources of pollution.",
      "Click on them to learn how to fix the problem and make the air cleaner. Every action counts!",
      "Let's work together to save this area and make a difference! Ready? Let's begin the cleanup mission!"
    ].join('\n\n');
  
    this.dialogueBubble1 = this.createintroGuideBubble(this.guide.x + 100, this.guide.y - 600, dialogue);
  
    this.tweens.add({
      targets: this.dialogueBubble1,
      alpha: 1,
      duration: 500
    });
  
    this.start1 = this.sound.add('start1');
    this.start1.play();
  
    this.input.on('pointerdown', this.handleIntroClick.bind(this));
  }
    
    handleIntroClick(pointer) {
      if (!this.isIntroComplete && pointer.y > 80) {
        this.sound.play('click');
        this.completeIntro();
      }
    }
    
    completeIntro() {
      if (this.isIntroComplete) return;
      
      this.isIntroComplete = true;
      if (this.start1) this.start1.stop();
    
      this.tweens.add({
        targets: [this.dialogueBubble1, this.guide],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          if (this.dialogueBubble1) this.dialogueBubble1.destroy();
          if (this.guide) this.guide.destroy();
          this.time.delayedCall(1000, () => {
            this.canPlant = true;
          });
        }
      });
      this.canCheckPolluters = true;
    
      this.input.off('pointerdown', this.handleIntroClick);
    }

    updateDetector(x, y) {
        this.detector.clear();
        this.detector.lineStyle(2, 0xffffff);
        this.detector.strokeCircle(x, y, 30);
        this.detector.lineStyle(1, 0xffffff);
        this.detector.strokeCircle(x, y, 40);
    }

    checkPolluters(pointer) {
      if (this.isExplaining) return;
    
      let clickedPolluter = null;
      this.polluters.getChildren().forEach(polluter => {
        if (polluter.alpha === 0) {
          const distance = Phaser.Math.Distance.Between(
            pointer.x, pointer.y, polluter.x, polluter.y
          );
          if (distance < 50) {
            clickedPolluter = polluter;
          }
        }
      });
    
      if (clickedPolluter) {
        this.sound.play('click');
        
        this.updateScore();
    
        const clickEffect = this.add.circle(pointer.x, pointer.y, 10, 0xffffff, 1);
        this.tweens.add({
          targets: clickEffect,
          scale: 2,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            clickEffect.destroy();
          }
        });
    
        this.time.delayedCall(300, () => {
          this.isExplaining = true;
          this.revealPolluter(clickedPolluter);
        });
      }
    }

    revealPolluter(polluter) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const targetSize = Math.min(window.innerWidth, window.innerHeight) * 0.65;
      
        this.tweens.add({
          targets: polluter,
          x: centerX,
          y: centerY,
          alpha: 1,
          scale: targetSize / Math.max(polluter.width, polluter.height),
          duration: 1000,
          ease: 'Power2',
          onComplete: () => {
            const guide = this.add.sprite(-100, window.innerHeight - 50, 'player')
              .setScale(0.5)
              .setOrigin(0.5, 1);
      
            this.tweens.add({
              targets: guide,
              x: 150,
              duration: 1000,
              ease: 'Back.out',
              onComplete: () => {
                const bubble = this.createGuideBubble(guide, polluter.getData('info'));

                const audioKey = `${polluter.getData('info').type}Explanation`;
                this.currentExplanationAudio = this.sound.add(audioKey);
                this.currentExplanationAudio.play();
                
                this.currentExplanation = { guide, bubble, polluter };
      
                this.instructionText = this.add.text(
                  window.innerWidth / 2,
                  window.innerHeight - 50,
                  'Press SPACE to continue',
                  { fontSize: '24px', fill: '#ffffff', backgroundColor: '#000000AA', padding: { x: 10, y: 5 } }
                ).setOrigin(0.5);
              }
            });
          }
        });
      }
      

      updateScore() {
        this.pollutersFound++;
        this.scoreText.setText(`Progress: ${this.pollutersFound}/5`);
    
        if (this.pollutersFound === 5) {
            this.timer.remove();
            const handleLevelCompleteOnce = () => {
                this.handleLevelComplete();
                this.input.keyboard.off('keydown-SPACE', handleLevelCompleteOnce);
            };
            this.input.keyboard.once('keydown-SPACE', handleLevelCompleteOnce);
        }
    }

    clearPollutedAir() {
        const clearedPercentage = this.pollutersFound / 5;
        const newEmitZone = {
          source: new Phaser.Geom.Rectangle(
            0,
            window.innerHeight * clearedPercentage,
            window.innerWidth,
            window.innerHeight * (1 - clearedPercentage)
          )
        };
        this.pollutedAir.setEmitZone(newEmitZone);
    }

    handleLevelComplete() {
      this.timer.remove();
      this.pollutedAir.stop();
      
      // Play completion sound
      const finishSound = this.sound.add('finish');
      finishSound.play();
      
      // Create guide character for final message
      const guide = this.add.sprite(-100, window.innerHeight - 50, 'player')
          .setScale(0.5)
          .setOrigin(0.5, 1);
      
      // Animate guide entry
      this.tweens.add({
          targets: guide,
          x: 150,
          duration: 1000,
          ease: 'Back.out',
          onComplete: () => {
              const messages = [
                  "Great job, team! We've cleaned up this area and made a big impact on air quality!",
                  "But this was just the beginning. There's still so much more to do.",
                  "The desert is in trouble next. Pollution is choking its delicate ecosystem, and we need to act fast!",
                  "Let's restore the balance in the desert by tackling illegal dumps, toxic spills, and dust clouds from construction sites.",
                  "Ready for the challenge? Let's move to Level 2 and keep making the world a cleaner, greener place!"
              ].join('\n\n');
              
              const bubble = this.createintroGuideBubble(guide.x + 100, guide.y - 600, messages);
              
              this.tweens.add({
                  targets: bubble,
                  alpha: 1,
                  duration: 500
              });
              
              // Add click handler or timer for transition
              const transitionHandler = () => {
                  this.cleanup();
                  finishSound.stop();
                  this.cameras.main.fadeOut(500, 0, 0, 0);
                  this.time.delayedCall(500, () => {
                      this.scene.start('TransitionScene', { nextScene: 'Level2' });
                  });
              };
              
              // Allow click to skip or wait 10 seconds
              this.input.once('pointerdown', transitionHandler);
              this.time.delayedCall(10000, transitionHandler);
          }
      });
  }

    updateTimer() {
        this.timeLeft--;
        this.timeText.setText(this.formatTime(this.timeLeft));
        
        if (this.timeLeft <= 0) {
            this.timer.remove();
            this.showTimeoutMessage();
        }
    }

    showTimeoutMessage() {
      this.isExplaining = true;
      this.dismissExplanation();
      
      // Play timeout audio
      const restartSound = this.sound.add('restart');
      restartSound.play({ volume: 0.6 });
      
      const guide = this.add.sprite(-100, window.innerHeight - 50, 'player')
          .setScale(0.5)
          .setOrigin(0.5, 1);
      
      this.tweens.add({
          targets: guide,
          x: 150,
          duration: 1000,
          ease: 'Back.out',
          onComplete: () => {
              const message = [
                  "Oh no, we ran out of time! The pollution in this area is still a big problem.",
                  "But don't give up! We're so close to making a difference!",
                  "Take a deep breath, refocus, and let's try again. Together, we can clean this area and protect the air quality for everyone!",
                  "Ready to give it another shot? Let's get started!"
              ].join('\n\n');
              
              const bubble = this.createintroGuideBubble(guide.x + 100, guide.y - 600, message);
              
              this.tweens.add({
                  targets: bubble,
                  alpha: 1,
                  duration: 500
              });
              
              // Add click handler to restart
              this.input.once('pointerdown', () => {
                  restartSound.stop();
                  this.tweens.add({
                      targets: [guide, bubble],
                      alpha: 0,
                      duration: 500,
                      onComplete: () => {
                        this.sound.play('click');
                          this.cleanup();
                          this.scene.start('TransitionScene', { nextScene: 'Level1' });
                      }
                  });
              });
          }
      });
  }

    update() {
        if (this.isExplaining) return;
        
        let closestDistance = Number.MAX_VALUE;
        this.polluters.getChildren().forEach(polluter => {
            if (polluter.alpha === 0) {
                const distance = Phaser.Math.Distance.Between(
                    this.input.activePointer.x, this.input.activePointer.y,
                    polluter.x, polluter.y
                );
                closestDistance = Math.min(closestDistance, distance);
            }
        });
        
        const trackerValue = Math.max(0, Math.min(1, 1 - (closestDistance / 300)));
        this.updateTracker(trackerValue);
    }

    updateTracker(value) {
        this.trackerFill.clear();
        this.trackerFill.fillStyle(0x00ff00, 1); // Changed to solid green (0x00ff00)
        this.trackerFill.fillRect(2, 2, 196 * value, 26);
    }
    cleanup() {
        this.polluterInfo = [];
        this.isExplaining = false;
        this.pollutersFound = 0;
        this.isIntroComplete = false;
        this.canCheckPolluters = false
      
        // Remove any remaining tweens
        this.tweens.killAll();
      
        // Stop and destroy the timer
        if (this.timer) {
          this.timer.remove();
          this.timer = null;
        }
      
        // Destroy particles
        if (this.pollutedAir) {
          this.pollutedAir.destroy();
          this.pollutedAir = null;
        }
      
        // Remove any remaining keyboard listeners
        this.input.keyboard.removeAllListeners();
      
        // Clear any remaining pointerdown listeners
        this.input.off('pointerdown');
        this.input.off('pointermove');
      
        // Destroy any remaining game objects
        this.polluters.clear(true, true);
        this.trackerContainer.destroy(true);
        if (this.currentExplanation) {
          this.currentExplanation.guide.destroy();
          this.currentExplanation.bubble.destroy();
          this.currentExplanation.polluter.destroy();
          this.currentExplanation = null;
        }
      }
      shutdown() {
        this.cleanup();
        // Call the parent class's shutdown method if it exists
        if (super.shutdown) {
          super.shutdown();
        }
      }

}