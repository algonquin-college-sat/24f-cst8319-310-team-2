class SpaceshipScene extends Phaser.Scene {
  constructor() {
    super({ key: "SpaceshipScene" });
    this.dialogues = [
      { text: "AI: Welcome aboard, Captain!", sound: "dialogue1Sound" },
      { text: "AI: Detecting unusual activity in the propulsion system...", sound: "dialogue2Sound" },
      { text: "AI: Warning! Malfunction detected. Initiating emergency landing.", sound: "dialogue3Sound" },
      { text: "AI: Scanning nearby planets... Planet 1 is suitable for survival.", sound: "dialogue4Sound" },
      { text: "AI: Brace yourself, Captain. We're crash landing on Planet 1!", sound: "dialogue5Sound" },
    ];
    this.currentDialogueIndex = 0;
  }

  preload() {
    // Load assets
    this.load.image("spaceshipInterior", "assets/spaceshipInterior.png");
    this.load.audio("malfunctionSound", "assets/malfunctionSound.mp3");
    this.load.audio("crashSound", "assets/crashSound.mp3");

    // Load dialogue sounds dynamically
    this.dialogues.forEach(({ sound }) => {
      this.load.audio(sound, `assets/${sound}.mp3`);
    });
  }

  init(data) {
    // Load saved progress or start fresh
    this.currentDialogueIndex = data.currentDialogueIndex || 0;
    this.isShaking = data.isShaking || false; // Check if shaking was in progress
  }

  create() {
    // Add spaceship interior background
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "spaceshipInterior")
      .setDisplaySize(this.scale.width, this.scale.height);

    // Add dialogue text box
    this.dialogueText = this.add
      .text(this.scale.width / 2, this.scale.height - 100, "", {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 10 },
        wordWrap: { width: this.scale.width - 50 },
      })
      .setOrigin(0.5);

    // Play malfunction sound at a lower volume
    this.malfunctionSound = this.sound.add("malfunctionSound", { volume: 0.14 });
    this.malfunctionSound.play();

    // Resume shaking if it was in progress
    if (this.isShaking) {
      this.startContinuousShake();
    }

    // Resume the dialogue sequence
    this.showNextDialogue();
  }

  startContinuousShake() {
    this.isShaking = true;
    this.shakeEvent = this.time.addEvent({
      delay: 200, // Frequency of shakes
      callback: () => {
        this.cameras.main.shake(100, 0.01); // Shake for 100ms with low intensity
      },
      loop: true, // Keep shaking continuously
    });
  }

  stopContinuousShake() {
    if (this.shakeEvent) {
      this.shakeEvent.remove(); // Stop the shaking event
    }
    this.isShaking = false;
  }

  showNextDialogue() {
    if (this.currentDialogueIndex < this.dialogues.length) {
      const { text, sound } = this.dialogues[this.currentDialogueIndex];
      this.dialogueText.setText(text);

      // Play the corresponding dialogue sound
      const dialogueSound = this.sound.add(sound, { volume: 1.0 });
      dialogueSound.play();

      // Start screen shaking after the first dialogue
      if (this.currentDialogueIndex === 1 && !this.isShaking) {
        this.startContinuousShake();
      }

      // Calculate the duration of the dialogue
      const textLength = text.length * 30; // Estimate 30ms per character
      const soundDuration = dialogueSound.duration * 1000 || 2000; // Use a default duration if sound has no duration
      const duration = Math.max(textLength, soundDuration) + 500; // Add 0.5 second buffer

      // Automatically move to the next dialogue after the duration
      this.time.delayedCall(duration, () => {
        this.currentDialogueIndex++;
        this.saveProgress(); // Save progress
        this.showNextDialogue();
      });
    } else {
      // If all dialogues are complete, stop shaking and initiate crash landing
      this.stopContinuousShake();
      this.initiateCrashLanding();
    }
  }

  saveProgress() {
    // Save current progress to localStorage
    localStorage.setItem(
      "playerProgress",
      JSON.stringify({
        currentScene: "SpaceshipScene",
        currentDialogueIndex: this.currentDialogueIndex,
        isShaking: this.isShaking,
      })
    );
  }

  initiateCrashLanding() {
    // Stop the malfunction sound if it is still playing
    if (this.malfunctionSound && this.malfunctionSound.isPlaying) {
      this.malfunctionSound.stop();
    }

    // Play crash sound
    this.crashSound = this.sound.add("crashSound", { volume: 1.0 });
    this.crashSound.play();

    // Add a flash effect for the crash
    this.cameras.main.flash(500, 255, 0, 0); // Flash red

    // Transition to the next scene after a delay
    this.time.delayedCall(1000, () => {
      this.scene.start("IntroductionScene"); // Transition to the first planet's level
    });
  }
}
