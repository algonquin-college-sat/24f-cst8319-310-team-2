class StartScreenScene extends Phaser.Scene {
    constructor() {
      super({ key: "StartScreenScene" });
    }
  
    preload() {
      // Load assets
      this.load.image("startBackground", "assets/startBackground.png"); // Background image
      this.load.audio("ClickSound", "assets/ClickSound.mp3"); // Button click sound
    }
  
    create() {
      // Add background image
      this.add
        .image(this.scale.width / 2, this.scale.height / 2, "startBackground")
        .setDisplaySize(this.scale.width, this.scale.height);
  
      // Add game title
      this.add
        .text(this.scale.width / 2, this.scale.height / 3, "Eco Adventures", {
          fontSize: "85px",
          color: "#fff",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
  
      // Add tagline or instructions
      this.add
        .text(this.scale.width / 2, this.scale.height / 2.2, "Clean the planets. Rebuild your spaceship!", {
          fontSize: "50px",
          color: "#fff",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
  
      // Add "Start Game" button
      this.add
        .text(this.scale.width / 2, this.scale.height / 1.5, "StartGame", {
          fontSize: "32px",
          color: "#fff",
          fontStyle: "bold",
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          this.sound.play("ClickSound"); // Play click sound
          this.scene.start("NameInputScene"); // Transition to NameInputScene
        });
    }
  }
  