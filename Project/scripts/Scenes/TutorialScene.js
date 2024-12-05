class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: "TutorialScene" });
  }

  preload() {
    // Load assets
    this.load.image("tutorialBackground", "assets/tutorialBackground.jpeg"); // Background image
    this.load.image("planet1Preview", "assets/planet1Preview.png"); // Preview image for Planet 1
    this.load.image("spaceshipPart", "assets/spaceshipPart.png"); // Reward image
  }

  create() {
    // Ensure audio context resumes
    this.input.once("pointerdown", () => {
      if (this.sound.context.state === "suspended") {
        this.sound.context.resume().then(() => console.log("AudioContext resumed"));
      }
    });

    // Background
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "tutorialBackground")
      .setDisplaySize(this.scale.width, this.scale.height);

    // Title
    this.add
      .text(this.scale.width / 2, 50, "Tutorial: Planet 1 Overview", {
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5);

    // Planet Preview
    this.add
      .image(this.scale.width / 2, 150, "planet1Preview")
      .setScale(0.5);

    // Theme Description
    const themeDescription = `
Planet 1: Polluted Planet - Waste Disposal
Theme: Educating players on proper waste sorting and disposal.
    `;
    this.add
      .text(this.scale.width / 2, 250, themeDescription, {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: this.scale.width - 100 },
      })
      .setOrigin(0.5);

    // Level Descriptions
    const levelDescriptions = `
Level 1: Drag and Drop Game
Gameplay:
- Players sort trash into the correct bins (Organic, Recyclable, General).
- Real-time feedback on correct and incorrect sorting.
- Hint button provides a quick guide on what belongs in each bin.
Objective:
- Collect 8 spaceship parts by correctly sorting all waste.
Reward:
- "Spaceship Shell" – the first part of the spaceship.
    `;
    this.add
      .text(this.scale.width / 2, 400, levelDescriptions, {
        fontSize: "18px",
        color: "#ffffff",
        align: "left",
        wordWrap: { width: this.scale.width - 100 },
      })
      .setOrigin(0.5);

    // Reward Preview
    this.add
      .image(this.scale.width / 2, this.scale.height - 150, "spaceshipPart")
      .setScale(0.5);

    // Continue Button
    this.add
      .text(this.scale.width / 2, this.scale.height - 50, "Start Planet 1", {
        fontSize: "28px",
        color: "#ffffff",
        backgroundColor: "#007BFF",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("Planet1Level1"); // Transition to the first level
      });
  }
}
