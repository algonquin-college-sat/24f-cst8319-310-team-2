class IntroductionScene extends Phaser.Scene {
  constructor() {
    super({ key: "IntroductionScene" });
    this.dialogues = [
      { text: "AI: Welcome to Planet 1, Captain!", sound: "aiVoice1" },
      { text: "AI: This planet is heavily polluted. Your mission is to help clean it up.", sound: "aiVoice2" },
      { text: "AI: Properly dispose of waste into the correct bins to rebuild the spaceship.", sound: "aiVoice3" },
      { text: "AI: Each correctly sorted item gives you a spaceship part as a reward.", sound: "aiVoice4" },
      { text: "AI: Let's begin your mission. Click 'Start Game' to proceed!", sound: "aiVoice5" },
    ];
    this.currentDialogueIndex = 0;
  }

  init(data) {
    // Load saved progress if it exists
    this.progress = data.progress || { currentDialogue: 0 };
    this.currentDialogueIndex = this.progress.currentDialogue;
  }

  preload() {
    // Load assets
    this.load.image("planet1Surface", "assets/planet1Surface.png");
    this.dialogues.forEach(({ sound }) => {
      this.load.audio(sound, `assets/${sound}.mp3`);
    });
  }

  create() {
    // Add planet surface background
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "planet1Surface")
      .setDisplaySize(this.scale.width, this.scale.height);

    // Dialogue text box
    this.dialogueText = this.add
      .text(this.scale.width / 2, this.scale.height - 100, "", {
        fontSize: "20px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 10, y: 10 },
        wordWrap: { width: this.scale.width - 50 },
      })
      .setOrigin(0.5);

    // Resume dialogues
    this.showNextDialogue();
  }

  showNextDialogue() {
    if (this.currentDialogueIndex < this.dialogues.length) {
      const { text, sound } = this.dialogues[this.currentDialogueIndex];
      this.dialogueText.setText(text);

      // Play dialogue sound
      const dialogueSound = this.sound.add(sound, { volume: 1.0 });
      dialogueSound.play();

      // Calculate duration for the next dialogue
      const duration = dialogueSound.duration * 1000 || 3000;

      // Automatically move to the next dialogue
      this.time.delayedCall(duration + 500, () => {
        this.currentDialogueIndex++;
        this.saveProgress();
        this.showNextDialogue();
      });
    } else {
      // End dialogues and show start button
      this.showStartButton();
    }
  }

  saveProgress() {
    // Save current dialogue index to localStorage
    localStorage.setItem(
      "playerProgress",
      JSON.stringify({
        currentScene: "IntroductionScene",
        progress: { currentDialogue: this.currentDialogueIndex },
      })
    );
  }

  showStartButton() {
    this.dialogueText.setText("Click 'Start Game' to proceed!");

    // Add Start Game button
    this.add
      .text(this.scale.width / 2, this.scale.height - 50, "Start Game", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#007BFF",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.sound.play("clickSound");
        this.scene.start("Planet1Level1"); // Transition to the first level
      });
  }
}
