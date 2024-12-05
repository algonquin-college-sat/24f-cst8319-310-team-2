class Planet1Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Planet1Level2" });
    this.trashItems = [];
    this.score = 0;
    this.timeLeft = 60;
    this.trashItemsState = [];
  }

  preload() {
    // Load assets
    this.load.image("lvl2background", "assets/lvl2background.png");
    this.load.image("blueBin", "assets/blueBin.png");
    this.load.image("greenBin", "assets/greenBin.png");
    this.load.image("blackBin", "assets/blackBin.png");
    this.load.image("plasticBottle", "assets/plasticBottle.png");
    this.load.image("bananaPeel", "assets/bananaPeel.png");
    this.load.image("newspaper", "assets/newspaper.png");
    this.load.image("aluminumFoil", "assets/aluminumFoil.png");
    this.load.image("pizzaBox", "assets/pizzaBox.png");
    this.load.image("lettuceLeaves", "assets/lettuceLeaves.png");
    this.load.image("tinCan", "assets/tinCan.png");
    this.load.audio("lvl2backgroundMusic", "assets/lvl1backgroundMusic.mp3");
    this.load.audio("lvl2correctSound", "assets/lvl1correctSound.mp3");
    this.load.audio("lvl2wrongSound", "assets/lvl1wrongSound.mp3");
    this.load.audio("lvl2rewardSound", "assets/lvl1rewardSound.mp3");
  }

  init(data) {
    const savedData = JSON.parse(localStorage.getItem("level2Progress")) || {};
    this.score = savedData.score || 0;
    this.timeLeft = savedData.timeLeft ?? 60;
    this.trashItemsState = savedData.trashItems || [];
  }

  create() {
    // Background
    this.add.image(this.scale.width / 2, this.scale.height / 2, "lvl2background")
      .setDisplaySize(this.scale.width, this.scale.height);

    // Play background music
    this.backgroundMusic = this.sound.add("lvl2backgroundMusic", { loop: true, volume: 0.3 });
    this.backgroundMusic.play();

    // Create bins
    this.createBins();

    // Display score and timer
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}/7`, { fontSize: "24px", color: "#fff" });
    this.timeText = this.add.text(20, 60, `Time: ${this.timeLeft}`, { fontSize: "24px", color: "#fff" });

    // Timer countdown
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Start falling items or restore saved progress
    if (this.trashItemsState.length > 0) {
      this.restoreTrash();
    } else {
      this.startFallingItems();
    }

    // Add Help button
    this.addHelpButton();
  }

  updateTimer() {
    this.timeLeft--;
    this.timeText.setText(`Time: ${this.timeLeft}`);
    if (this.timeLeft <= 0) {
      this.endLevel();
    }
  }

  createBins() {
    const binScale = 0.35;
    const binY = this.scale.height - 150;
    const binSpacing = 120;
    const startX = this.scale.width - 350;

    this.bins = {
      green: this.add.image(startX, binY, "greenBin").setScale(binScale).setInteractive(),
      blue: this.add.image(startX + binSpacing, binY, "blueBin").setScale(binScale).setInteractive(),
      black: this.add.image(startX + binSpacing * 2, binY, "blackBin").setScale(binScale).setInteractive(),
    };

    this.enableBinDrag();
  }

  enableBinDrag() {
    this.input.setDraggable(Object.values(this.bins));

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }

  startFallingItems() {
    const trashData = [
      { key: "plasticBottle", bin: "blue" },
      { key: "bananaPeel", bin: "green" },
      { key: "newspaper", bin: "black" },
      { key: "aluminumFoil", bin: "blue" },
      { key: "pizzaBox", bin: "black" },
      { key: "lettuceLeaves", bin: "green" },
      { key: "tinCan", bin: "blue" },
    ];

    const spawnTrashItem = () => {
      if (this.score < 7 && this.timeLeft > 0) {
        const randomIndex = Phaser.Math.Between(0, trashData.length - 1);
        const data = trashData[randomIndex];

        const trashItem = this.add.image(this.scale.width / 2, -100, data.key).setScale(0.3).setInteractive();
        trashItem.correctBin = data.bin;

        this.tweens.add({
          targets: trashItem,
          y: this.scale.height - 50,
          duration: 4000,
          ease: "Linear",
          onUpdate: () => {
            this.checkTrashPlacement(trashItem);
          },
          onComplete: () => {
            if (!trashItem.placed) {
              trashItem.destroy(); // Remove the trash if it misses a bin
              this.sound.play("lvl2wrongSound");
            }
          },
        });

        this.trashItems.push(trashItem);

        // Schedule the next trash item
        this.time.addEvent({ delay: 3000, callback: spawnTrashItem });
      }
    };

    spawnTrashItem();
  }

  checkTrashPlacement(trash) {
    if (trash.placed) return;

    const correctBin = this.bins[trash.correctBin];
    if (this.isOverlapping(trash, correctBin)) {
      trash.placed = true;
      this.sound.play("lvl2correctSound");
      trash.destroy(); // Destroy the trash item on correct placement
      this.trashItems = this.trashItems.filter((item) => item !== trash);
      this.score++;
      this.updateScore();
    } else if (this.isOverlapping(trash, this.bins.green) || 
               this.isOverlapping(trash, this.bins.blue) || 
               this.isOverlapping(trash, this.bins.black)) {
      trash.placed = true;
      this.sound.play("lvl2wrongSound");
      this.tweens.add({
        targets: trash,
        y: this.scale.height + 50,
        duration: 500,
        ease: "Power2",
        onComplete: () => trash.destroy(),
      });
    }
  }

  isOverlapping(spriteA, spriteB) {
    return Phaser.Geom.Intersects.RectangleToRectangle(spriteA.getBounds(), spriteB.getBounds());
  }

  updateScore() {
    this.scoreText.setText(`Score: ${this.score}/7`);
    if (this.score === 7) {
      this.endLevel();
    }
  }

  saveProgress() {
    localStorage.setItem(
      "level2Progress",
      JSON.stringify({
        score: this.score,
        timeLeft: this.timeLeft,
        trashItems: this.trashItems.map((trash) => ({
          key: trash.texture.key,
          x: trash.x,
          y: trash.y,
          bin: trash.correctBin,
        })),
      })
    );
  }

  endLevel() {
    this.add.text(this.scale.width / 2, this.scale.height / 2, "Level Complete!\nReward: Engine Core", {
      fontSize: "36px",
      color: "#0fff",
      align: "center",
    }).setOrigin(0.5);

    this.sound.play("lvl2rewardSound");
    localStorage.removeItem("level2Progress");
    this.time.delayedCall(3000, () => {
      this.backgroundMusic.stop();
      this.scene.start("Planet1Level3")}
    ); 
  }

  addHelpButton() {
    const helpButton = this.add.text(this.scale.width / 2, this.scale.height - 100, "Help", {
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#00aabb",
    }).setOrigin(0.5).setInteractive();

    helpButton.on("pointerdown", () => this.showHelpMenu());
  }

  showHelpMenu() {
    const helpText = this.add.text(this.scale.width / 2, this.scale.height / 3, 
      "Green Bin: Organic\nBlue Bin: Recyclable\nBlack Bin: General", {
      fontSize: "20px",
      color: "#fff",
      align: "center",
    }).setOrigin(0.5);

    this.time.delayedCall(5000, () => helpText.destroy());
  }
  saveProgress() {
    // Save current progress to localStorage
    localStorage.setItem(
      "playerProgress",
      JSON.stringify({
        currentScene: "Planet1Level2",
        currentDialogueIndex: this.currentDialogueIndex,
        isShaking: this.isShaking,
      })
    );
  }
}
