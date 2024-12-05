class Planet4Level3 extends Phaser.Scene {

    
    constructor() {
        super({ key: 'Planet4Level3' });
        this.polluterInfo = [];
        this.isExplaining = false;
        this.pollutersFound = 0;
        this.isIntroComplete = false;
        this.canCheckPolluters = false;
    }

    preload() {
        this.load.image('lvlbg', 'assets/planet4/Level3.jpg');
        this.load.audio('click', 'assets/planet4/music/click.wav');
        this.load.image('player', 'assets/planet4/player.webp');
        this.load.image('public', 'assets/planet4/level3/public.jpg');
        this.load.image('car2', 'assets/planet4/level3/car.jpg');
        this.load.image('smoke', 'assets/planet4/smoke.jpg');
        this.load.image('smoking', 'assets/planet4/level3/smoking.jpg')
        this.load.image('pedal', 'assets/planet4/level3/solar.jpg')
        this.load.image('plant', 'assets/planet4/level3/plant.webp')

        this.load.audio('pedalExplanation', 'assets/planet4/music/level3/pedal.mp3');
        this.load.audio('car2Explanation', 'assets/planet4/music/level3/car.mp3');
        this.load.audio('publicExplanation', 'assets/planet4/music/level3/public.mp3');
        this.load.audio('strt1', 'assets/planet4/music/level3/intro.mp3');
        this.load.audio('smokingExplanation', 'assets/planet4/music/level3/smoke.mp3');
        this.load.audio('plantExplanation', 'assets/planet4/music/level3/tree.mp3');
        this.load.audio('fnsh1', 'assets/planet4/music/level3/congrats.mp3');
        this.load.audio('rst', 'assets/planet4/music/level3/restart.mp3');

        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.key);
        });
    }

    create() {
        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'lvlbg')
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
        const trackerLabel = this.add.text(0, -25, 'Clue finder', {
            fontSize: '18px',
            fill: '#ffffff',
            padding: { x: 10, y: 5 }
        });
        
        this.trackerContainer.add([trackerBg, this.trackerFill, trackerLabel]);

        this.time.addEvent({
          delay: 100, // Check periodically
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
    
        const title = this.add.text(window.innerWidth / 2, 40, 'Level 3: Stop pollution spreading', {
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
              type: 'plant',
              dialogues: [
                  "Planting trees is like giving the planet more superpowers!",
                  "Trees clean the air and make it fresh for us to breathe.",
                  "Be a hero – plant a tree and make the air pollution flee!"
              ]
          },
          {
              type: 'car2',
              dialogues: [
                  "Hey friends! Did you know driving electric cars is like giving the Earth a big, clean hug?",
                  "No smoke, no pollution – just zooming with clean energy!",
                  "Zap! Charge up and save the day, one drive at a time!"
              ]
          },
          {
              type: 'public',
              dialogues: [
                  "Why ride alone when we can ride together? ",
                  "Buses, trains, and bikes make our skies clear and blue! ",
                  "Public transport saves energy and keeps the air clean!"
              ]
          },
          {
              type: 'smoking',
              dialogues: [
                  "Smoking hurts our lungs AND the air!",
                  "Let's say NO to smoking and YES to fresh, healthy skies!",
                  "Keep the air clean – it’s the hero thing to do!"
              ]
          },
          {
              type: 'pedal',
              dialogues: [
                  "Look! The sun and wind are our friends too.",
                  "Solar panels and windmills make energy without any smoke!",
                  "Pedal power is fun power! Let's ride for a cleaner planet!"
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
        const bubbleHeight = 200;
        
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
        "Welcome, Air Hero! Your mission in this level is to recover 5 pollution-busting clues hidden around you.",
        "To help you, I’ve equipped you with the Clue Finder – watch it fill up as you get closer to a clue!",
        "But be careful! The timer is ticking. If it goes off, the pollution in the area will take over, and you’ll have to try again.",
        "Your task is simple: find all 5 clues before the time goes off. Each clue brings us one step closer to a cleaner environment.",
        "Stay sharp, Air Hero! Follow the Clue Finder, act fast, and show the world you’ve got what it takes to save the day! Let’s go!"
    ].join('\n\n');
  
    this.dialogueBubble1 = this.createintroGuideBubble(this.guide.x + 100, this.guide.y - 600, dialogue);
  
    this.tweens.add({
      targets: this.dialogueBubble1,
      alpha: 1,
      duration: 500
    });
  
    this.strt1 = this.sound.add('strt1');
    this.strt1.play();
  
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
      if (this.strt1) this.strt1.stop();
    
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
      const finishSound = this.sound.add('fnsh1');
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
                  "We did it, team! You’re all officially Air Heroes!", 
                  "By planting trees, riding bikes, using clean energy, and making smart choices, we’re keeping our world fresh and pollution-free!", 
                  "Now it’s time to test your super smarts!", 
                  "Get ready for the Air Pollution Quiz in the next level – let’s see how much of an Air Hero you really are!", 
                  "Gear up for the quiz, and don’t forget: every right answer takes us closer to a cleaner, greener world!"
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
                      this.scene.start('TransitionScene', { nextScene: 'QuizScene' });
                  });
              };
              
              // Allow click to skip or wait 10 seconds
              this.input.once('pointerdown', transitionHandler);
              this.time.delayedCall(30000, transitionHandler);
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
      const restartSound = this.sound.add('rst');
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
                  "Oh no! The time is up, and the air quality has worsened.", 
                  "But don’t worry, Air Hero, every great hero gets another chance!", 
                  "Take a deep breath, reset your focus, and let’s try again.", 
                  "Remember, the Clue Finder will guide you – stay close to it and act quickly.", 
                  "Together, we can still recover all 5 pollution-busting clues and save the environment!", 
                  "Are you ready to restart the mission? Let’s clear the air and make it right this time! Zap!"
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
                          this.scene.start('TransitionScene', { nextScene: 'Planet4Level4' });
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