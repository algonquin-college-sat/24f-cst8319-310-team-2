class NameInputScene extends Phaser.Scene {
  constructor() {
    super({ key: "NameInputScene" });
  }

  preload() {
    // Load assets
    this.load.image("background", "assets/background.png"); // Background image
    this.load.audio("clickSound", "assets/clickSound.mp3"); // Click sound
  }

  create() {
    // Add background image
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "background")
      .setDisplaySize(this.scale.width, this.scale.height);

    // Welcome message
    this.add
      .text(this.scale.width / 2, 100, "Hi Captain, welcome aboard!", {
        fontSize: "32px",
        color: "#fff",
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 150, "Let us grab your name to save your progress.", {
        fontSize: "24px",
        color: "#fff",
      })
      .setOrigin(0.5);

    // Check if the player's name and progress are already saved in localStorage
    const savedName = localStorage.getItem("playerName");
    const savedProgress = JSON.parse(localStorage.getItem("playerProgress"));

    if (savedName && savedProgress) {
      // Display welcome back message for returning players
      this.add
        .text(this.scale.width / 2, 200, `Welcome back, Captain ${savedName}!`, {
          fontSize: "24px",
          color: "#fff",
        })
        .setOrigin(0.5);

      // Resume Game Button
      this.add
        .text(this.scale.width / 2, 300, "Resume Game", {
          fontSize: "24px",
          color: "#0f0",
          backgroundColor: "#000",
          padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          this.sound.play("clickSound"); // Play click sound
          this.scene.start(savedProgress.currentScene, savedProgress); // Resume game with saved progress
        });

        // UNCOMMENT THE BELOW LINES TO SHOW BUTTONS TO GO TO DIFFERENT SCENES IF YOU NEED TO DEBUG OR DEMO THEM

        // // Jump to a Scene Button (Planet 3; For Demo Purposes)
        // this.add.text(this.scale.width / 2, 400, "Jump to Planet 3", {
        //   fontSize: "24px",
        //   color: "#0f0",
        //   backgroundColor: "#000",
        //   padding: { x: 10, y: 5 },
        // })
        // .setOrigin(0.5)
        // .setInteractive()
        // .on("pointerdown", () => {
        //   this.sound.play("clickSound"); // Play click sound
        //   this.scene.start("Planet3Level1");
        // });

        // // Jump to a Scene Button (Planet 4; For Demo Purposes)
        // this.add.text(this.scale.width / 2, 450, "Jump to Planet 4", {
        //   fontSize: "24px",
        //   color: "#0f0",
        //   backgroundColor: "#000",
        //   padding: { x: 10, y: 5 },
        // })
        // .setOrigin(0.5)
        // .setInteractive()
        // .on("pointerdown", () => {
        //   this.sound.play("clickSound"); // Play click sound
        //   this.scene.start("Planet4IntroScene");
        // });

        // // Jump to a Scene Button (Planet 4 Level 3; For Demo Purposes)
        // this.add.text(this.scale.width / 2 + 350, 450, "Jump to Planet 4 Level 3", {
        //   fontSize: "24px",
        //   color: "#0f0",
        //   backgroundColor: "#000",
        //   padding: { x: 10, y: 5 },
        // })
        // .setOrigin(0.5)
        // .setInteractive()
        // .on("pointerdown", () => {
        //   this.sound.play("clickSound"); // Play click sound
        //   this.scene.start("Planet4Level3");
        // });

        // // Jump to a Scene Button (Planet 4 Level 4; For Demo Purposes)
        // this.add.text(this.scale.width / 2 + 650, 450, "Jump to Planet 4 Level 4", {
        //   fontSize: "24px",
        //   color: "#0f0",
        //   backgroundColor: "#000",
        //   padding: { x: 10, y: 5 },
        // })
        // .setOrigin(0.5)
        // .setInteractive()
        // .on("pointerdown", () => {
        //   this.sound.play("clickSound"); // Play click sound
        //   this.scene.start("Planet4Level4");
        // });

      // Start Fresh Button
      this.add
        .text(this.scale.width / 2, 350, "Start Fresh", {
          fontSize: "24px",
          color: "#fff",
          backgroundColor: "#000",
          padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          localStorage.removeItem("playerName"); // Clear saved name
          localStorage.removeItem("playerProgress"); // Clear progress
          this.scene.restart(); // Restart NameInputScene
        });
    } else {
      // Create HTML input element for name entry for new players
      const inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.placeholder = "Enter your name";
      inputElement.style.position = "absolute";
      inputElement.style.top = "50%";
      inputElement.style.left = "50%";
      inputElement.style.transform = "translate(-50%, -50%)";
      inputElement.style.fontSize = "20px";
      inputElement.style.padding = "10px";
      inputElement.style.borderRadius = "5px";
      inputElement.style.border = "2px solid #00f";
      inputElement.style.width = "200px";
      inputElement.style.zIndex = "1"; // Ensure it's above the canvas
      document.body.appendChild(inputElement);

      // Save and Start Button
      this.add
        .text(this.scale.width / 2, 300, "Save and Start", {
          fontSize: "24px",
          color: "#0f0",
          backgroundColor: "#000",
          padding: { x: 10, y: 5 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          const playerName = inputElement.value.trim();
          if (playerName) {
            localStorage.setItem("playerName", playerName); // Save player name
            localStorage.setItem(
              "playerProgress",
              JSON.stringify({ currentScene: "SpaceshipScene", progress: {} }) // Initialize progress
            );
            inputElement.remove(); // Remove the input field
            this.sound.play("clickSound"); // Play click sound
            this.scene.start("SpaceshipScene"); // Transition to SpaceshipScene
          }
        });
    }
  }
}
