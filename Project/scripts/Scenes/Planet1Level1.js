class Planet1Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Planet1Level1" });
    this.trashItems = [];
    this.score = 0; // Start score at 0
    this.isGameStarted = false; // To check if the game has started
  }

  preload() {
    // Load assets
    this.load.image("lvl1background", "assets/lvl1background.png");
    this.load.image("blueBin", "assets/blueBin.png");
    this.load.image("greenBin", "assets/greenBin.png");
    this.load.image("blackBin", "assets/blackBin.png");
    this.load.image("glassWaste", "assets/glassWaste.png");
    this.load.image("metalWaste", "assets/metalWaste.png");
    this.load.image("foodWaste", "assets/foodWaste.png");
    this.load.image("paperWaste", "assets/paperWaste.png");
    this.load.image("cardboardWaste", "assets/cardboardWaste.png");

    // Load audio
    this.load.audio("lvl1backgroundMusic", "assets/lvl1backgroundMusic.mp3");
    this.load.audio("lvl1rewardSound", "assets/lvl1rewardSound.mp3");
    this.load.audio("lvl1correctSound", "assets/lvl1correctSound.mp3");
    this.load.audio("lvl1wrongSound", "assets/lvl1wrongSound.mp3");
  }

  init(data) {
    // Load progress if resuming
    const savedData = JSON.parse(localStorage.getItem("level1Progress")) || {};
    this.score = savedData.score || 0;
    this.trashItemsState = savedData.trashItems || [];
  }

  create() {
    // Add background
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "lvl1background")
      .setDisplaySize(this.scale.width, this.scale.height);

    // Play background music
    this.backgroundMusic = this.sound.add("lvl1backgroundMusic", {
      loop: true,
      volume: 0.3,
    });
    this.backgroundMusic.play();

    // Add bins
    this.createBins();

    // Display score
    this.scoreText = this.add
      .text(20, 20, `Score: ${this.score}/5`, {
        fontSize: "24px",
        color: "#000",
      })
      .setOrigin(0);

    // Add trash items (either create new or restore existing)
    this.isGameStarted = this.trashItemsState.length > 0;
    if (this.isGameStarted) {
      this.restoreTrash();
    } else {
      this.createTrash();
    }

    // Help Button
    this.addHelpButton();
  }

  createBins() {
    const binScale = 0.4; // Scale for bins
    const binY = this.scale.height - 150; // Position bins near bottom
    const binSpacing = 200; // Even spacing between bins
    const startX = this.scale.width - 450; // Position bins near right edge

    this.bins = {
      green: this.add.image(startX, binY, "greenBin").setScale(binScale),
      blue: this.add.image(startX + binSpacing, binY, "blueBin").setScale(binScale),
      black: this.add.image(startX + binSpacing * 2, binY, "blackBin").setScale(binScale),
    };
  }

  createTrash() {
    const trashData = [
      { key: "glassWaste", bin: "blue", scale: 0.2 },
      { key: "metalWaste", bin: "blue", scale: 0.7 },
      { key: "foodWaste", bin: "green", scale: 0.2 },
      { key: "paperWaste", bin: "black", scale: 0.25 },
      { key: "cardboardWaste", bin: "black", scale: 0.3 },
    ];

    const startX = 100; // Start position for trash
    const spacing = 150; // Spacing between trash items
    const topRowY = this.scale.height - 300; // Top row Y position
    const bottomRowY = this.scale.height - 150; // Bottom row Y position

    trashData.forEach((data, index) => {
      const trashY = index < 4 ? topRowY : bottomRowY;
      const trashX = startX + spacing * (index % 4); // Distribute evenly
      const trash = this.add
        .image(trashX, trashY, data.key)
        .setScale(data.scale)
        .setInteractive();

      trash.correctBin = data.bin;
      trash.startX = trashX;
      trash.startY = trashY;

      this.input.setDraggable(trash);
      this.trashItems.push(trash);
    });

    // Drag-and-drop functionality
    this.setupDragEvents();
  }

  restoreTrash() {
    this.trashItemsState.forEach((data) => {
      const trash = this.add
        .image(data.x, data.y, data.key)
        .setScale(data.scale)
        .setInteractive();

      trash.correctBin = data.bin;
      trash.startX = data.startX;
      trash.startY = data.startY;

      this.trashItems.push(trash);
    });

    this.setupDragEvents();
  }

  setupDragEvents() {
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      this.checkTrash(gameObject);
    });
  }

  checkTrash(trash) {
    const bins = this.bins;

    if (
      (trash.correctBin === "blue" && this.checkBoundingOverlap(trash, bins.blue)) ||
      (trash.correctBin === "green" && this.checkBoundingOverlap(trash, bins.green)) ||
      (trash.correctBin === "black" && this.checkBoundingOverlap(trash, bins.black))
    ) {
      this.sound.play("lvl1correctSound");
      trash.destroy(); // Destroy the trash if placed correctly
      this.trashItems = this.trashItems.filter((item) => item !== trash); // Remove from array
      this.score++; // Increment the score
      this.updateScore();
    } else {
      this.sound.play("lvl1wrongSound");
      this.tweens.add({
        targets: trash,
        x: trash.startX,
        y: trash.startY,
        duration: 500,
        ease: "Power2",
      });
    }
  }

  checkBoundingOverlap(spriteA, spriteB) {
    const boundsA = spriteA.getBounds();
    const boundsB = spriteB.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
  }

  updateScore() {
    this.scoreText.setText(`Score: ${this.score}/5`);
    if (this.score === 5) {
      this.endLevel();
    } else {
      this.saveProgress();
    }
  }

  saveProgress() {
    const trashItemsState = this.trashItems.map((trash) => ({
      key: trash.texture.key,
      x: trash.x,
      y: trash.y,
      bin: trash.correctBin,
      scale: trash.scaleX, // Assuming uniform scale for X and Y
      startX: trash.startX,
      startY: trash.startY,
    }));

    localStorage.setItem(
      "level1Progress",
      JSON.stringify({
        score: this.score,
        trashItems: trashItemsState,
      })
    );
  }

  endLevel() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Level Complete!\nReward: Spaceship Shell", {
        fontSize: "36px",
        color: "#fff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

       // Play the reward sound
      this.sound.play("lvl1rewardSound");

    localStorage.removeItem("level1Progress"); // Clear saved progress
    this.time.delayedCall(3000, () => {
      this.backgroundMusic.stop();
      this.scene.start("Planet1Level2"); // Transition to Level 2
    });
  }

  addHelpButton() {
    const helpButton = this.add
      .text(this.scale.width - 100, 20, "Help", {
        fontSize: "24px",
        color: "#fff",
        backgroundColor: "#00aabb",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    helpButton.on("pointerdown", () => {
      this.toggleHelpMenu();
    });
  }

  toggleHelpMenu() {
    if (this.isHelpVisible) {
      this.hideHelpMenu();
    } else {
      this.showHelpMenu();
    }
  }

  showHelpMenu() {
    this.helpMenu = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 4,
        "Help: Drag waste items to the correct bins.\nGreen Bin: Organic\nBlue Bin: Recyclable\nBlack Bin: General.",
        {
          fontSize: "20px",
          color: "#000",
          fontStyle: "bold",
          align: "center",
          padding: { x: 10, y: 10 },
        }
      )
      .setOrigin(0.5);
    this.isHelpVisible = true;

    // Hide help text after 5 seconds
    this.time.delayedCall(5000, () => this.hideHelpMenu());
  }

  hideHelpMenu() {
    if (this.helpMenu) this.helpMenu.destroy();
    this.isHelpVisible = false;
  }
}
