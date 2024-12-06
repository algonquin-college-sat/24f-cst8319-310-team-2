class Scene1 extends Phaser.Scene {
    constructor() {
      super("Scene1");
    }
  
    preload() {
      // Load assets
      this.load.image("planet2lvl1background", "assets/topic2/level1/lvl1background.png");
      this.load.image("astronaut", "assets/topic2/level1/astronaut.png");
      this.load.image("apple", "assets/topic2/level1/apple.png");
      this.load.image("batteries", "assets/topic2/level1/batteries.png");
      this.load.image("bigbattery", "assets/topic2/level1/bigbattery.png");
      this.load.image("can", "assets/topic2/level1/can.png");
      this.load.image("chicken", "assets/topic2/level1/chicken.png");
      this.load.image("egg", "assets/topic2/level1/egg.png");
      this.load.image("foodwaste", "assets/topic2/level1/foodwaste.png");
      this.load.image("trashpiles", "assets/topic2/level1/trashpiles.png");
      this.load.image("glowingspot","assets/topic2/level1/glowingspot.png");
      this.load.image("rustedBarrel", "assets/topic2/level1/rustedbarrel.png");
      this.load.image("rustedmachinery", "assets/topic2/level1/rustedmachinery.png");
      this.load.image("plasticbottle", "assets/topic2/level1/plasticbottle.png");
      this.load.image("rocks", "assets/topic2/level1/rocks.png");
      this.load.image("abandonedJunk", "assets/topic2/level1/abandonedjunk1.png");
      this.load.audio("backgroundMusic", "assets/topic2/music/backgroundMusic.mp3");
      this.load.audio("Dialogue1", "assets/topic2/music/Welcome to Ecophera .mp3");
      this.load.audio("Dialogue2", "assets/topic2/music/Your mission is to b.mp3");
      this.load.audio("Dialogue3", "assets/topic2/music/Collect eco friendly.mp3");
      this.load.audio("Dialogue4", "assets/topic2/music/Each step you take h.mp3");
      this.load.audio("letsGoSound", "assets/topic2/music/Letsgo.mp3"); 
      this.load.audio("Dialogue5", "assets/topic2/music/Help the astronaut r(1).mp3");
    }
  
    create() {
            // Background
            this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "planet2lvl1background").setDisplaySize(window.innerWidth, window.innerHeight);
            this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 0.5 });
            this.backgroundMusic.play();
        // Add environmental objects
        this.add.image(900, 350, "astronaut").setScale(2.5);
        this.add.image(1480, 350, "rustedBarrel").setScale(0.9); // Barrel
        this.add.image(600, 600, "rocks").setScale(0.8); // Rocks
        this.add.image(2000, 500, "abandonedJunk").setScale(0.4); // Junk
        this.add.image(1200, 550, "trashpiles").setScale(1.5); // Trash piles
        this.add.image(400, 500, "plasticbottle").setScale(0.7); // Plastic bottle
        this.add.image(800, 600, "foodwaste").setScale(0.6); // Food waste
        this.add.image(600, 450, "chicken").setScale(0.5); // Chicken bone
        this.add.image(2000, 1000, "egg").setScale(0.5); // Eggshell
        this.add.image(600, 450, "chicken").setScale(0.5);
        // Add dialogue box
        this.dialogueBox = this.add.graphics();
        this.dialogueBox.fillStyle(0x000000, 0.7); // Black background with transparency
        this.dialogueBox.fillRoundedRect(400, 280, 880, 100, 10); // Rounded rectangle
        this.dialogueText = this.add.text(450, 300, "", {
          fontSize: "20px",
          fontStyle: "bold",
          color: "#FFFFFF",
          wordWrap: { width: 850 },
          align: "center",
        });
    
        // Dialogue data
        this.dialogues = [
          "Welcome to Ecophera, a planet once full of life but now in ruins.",
          "Your mission is to bring it back to life by cleaning, building, and restoring.",
          "Collect eco-friendly materials, sort trash, and build shelters for animals.",
          "Each step you take heals the planet and helps you restore the spaceship.",
        ];
        this.dialogueAudios = [
          this.sound.add("Dialogue1"),
          this.sound.add("Dialogue2"),
          this.sound.add("Dialogue3"),
          this.sound.add("Dialogue4"),
          this.sound.add("Dialogue5"),
        ];
        this.currentDialogueIndex = 0;
    
        // Add dialogue box
        this.dialogueBox = this.add.graphics();
        this.dialogueBox.fillStyle(0x000000, 0.7); // Black background with transparency
        this.dialogueBox.fillRoundedRect(400, 280, 880, 100, 10); // Rounded rectangle
        this.dialogueText = this.add.text(450, 300, "", {
          fontSize: "20px",
          fontStyle: "bold",
          color: "#FFFFFF",
          wordWrap: { width: 850 },
          align: "center",
        });
        this.updateDialogue();
    
        // Create 'Next' button dynamically
        this.nextButton = this.add.text(1050, 620, "Next", {
          fontSize: "24px",
          fontStyle: "bold",
          backgroundColor: "#008000", // Green button color
          color: "#FFFFFF",
          padding: { x: 24, y: 15 },
          align: "center",
        })
          .setInteractive()
          .setOrigin(0.5);
    
        // Click event for the 'Next' button
        this.nextButton.on("pointerdown", () => {
          this.currentDialogueIndex++;
          if (this.currentDialogueIndex < this.dialogues.length) {
            this.updateDialogue();
          } else {
            // Show 'Start Game' button after dialogues are complete
            this.nextButton.setVisible(false); // Hide 'Next' button
            this.showStartGameButton();
          }
        });
      }
    
      updateDialogue() {
        // Stop previous dialogue audio
        if (this.currentDialogueIndex > 0) {
          this.dialogueAudios[this.currentDialogueIndex - 1].stop();
        }
      
        // Update dialogue text
        this.dialogueText.setText(this.dialogues[this.currentDialogueIndex]);
      
        // Play corresponding audio
        console.log(`Playing Dialogue ${this.currentDialogueIndex + 1}`);
        this.backgroundMusic.setVolume(0.2); // Lower background music
        this.dialogueAudios[this.currentDialogueIndex].play();
        this.dialogueAudios[this.currentDialogueIndex].once('complete', () => {
          this.backgroundMusic.setVolume(0.5); // Restore background music volume
          console.log(`Dialogue ${this.currentDialogueIndex + 1} completed`);
        });
      }
      
      showStartGameButton() {
        // Create 'Start Game' button dynamically
        this.startGameButton = this.add.text(640, 200, "Start Game", {
          fontSize: "48px",
          fontStyle: "bold",
          backgroundColor: "#FF0000", // Red button color
          color: "#FFFFFF",
          padding: { x: 50, y: 30 },
          align: "center",
        })
          .setInteractive()
          .setOrigin(0.5);
      
        // Click event for the 'Start Game' button
        this.startGameButton.on("pointerdown", () => {
          this.startGameButton.setVisible(false); // Hide 'Start Game' button
          this.showLevel1Text(); // Show "Level 1" text
        });
      }
      
      showLevel1Text() {
        const level1Text = this.add.text(window.innerWidth / 2, window.innerHeight / 2, "Level 1", {
          fontSize: "120px",
          fontStyle: "bold",
          color: "#ff0000",
          fontFamily: "Arial",
        }).setOrigin(0.5);
      
        // Add fade-out effect for "Level 1" text
        this.tweens.add({
          targets: level1Text,
          alpha: 0,
          duration: 3000,
          onComplete: () => {
            level1Text.destroy(); 
            // Add dimming effect to the background
            if (!this.background) {
              this.background = this.add.graphics();
              this.background.fillStyle(0x000000, 0.5); // Black overlay with 50% opacity
              this.background.fillRect(0, 0, window.innerWidth, window.innerHeight);
            } else {
              this.background.setAlpha(0.5); // Adjust alpha if overlay already exists
            }
      
            // Transition to the next scene
            this.backgroundMusic.stop();
            this.scene.start("Planet2Level1");
          },
        });
      }
    }      