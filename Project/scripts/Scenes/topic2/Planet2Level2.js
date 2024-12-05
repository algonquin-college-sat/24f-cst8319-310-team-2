class Planet2Level2 extends Phaser.Scene {
    constructor() {
        super("Planet2Level2");
    }

    preload() {
        // Load assets using your provided image names
        this.load.image("backgroundlvl2", "assets/topic2/level2/lvl2background.png");
        this.load.image("astronaut", "assets/topic2/level2/astronaut.png");
        this.load.image("seeds", "assets/topic2/level2/seeds.png");
        this.load.image("watering", "assets/topic2/level2/watering.png");
        this.load.image("sapling", "assets/topic2/level2/sapling.png");
        this.load.image("hempPlant", "assets/topic2/level2/hempplant.png");
        this.load.image("solarPanel", "assets/topic2/level2/solarpane.png");
        this.load.audio('winSound', 'assets/topic2/music/win.mp3');
        this.load.audio("Dialogue7", "assets/topic2/music/Grow 6 Hemp Plants t.mp3");
        this.load.audio("backgroundMusic", "assets/topic2/music/backgroundMusic.mp3");
    }

    create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, "backgroundlvl2").setDisplaySize(window.innerWidth, window.innerHeight);
        this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 0.5 });
        this.backgroundMusic.play();

       
        // Initialize variables
        this.score = 0;
        this.plants = []; // Array to track plants
        this.currentTool = "none"; // Currently selected tool
        this.plantCount = 0; // Track number of seeds planted
        this.maxPlants = 40; // Maximum number of seeds allowed

        // Add orange score box at the top
        this.add.graphics()
            .fillStyle(0xFFA500, 0.8) // Orange color
            .fillRoundedRect(window.innerWidth / 2 - 150, 20, 300, 100, 10); // Centered score box

        this.add.text(window.innerWidth / 2 - 140, 30, "Score:", { fontSize: "24px", fontWeight: "bold", color: "#000" });
        this.scoreText = this.add.text(window.innerWidth / 2 + 10, 30, "0", { fontSize: "24px", fontWeight: "bold", color: "#000" });

        // Progress bar
        this.progressBar = this.add.graphics();
        this.updateProgressBar = () => {
            this.progressBar.clear();
            const progressWidth = (this.plants.filter((plant) => plant.stage === "hempPlant").length / this.maxPlants) * 240;
            this.progressBar.fillStyle(0x00FF00, 1);
            this.progressBar.fillRect(window.innerWidth / 2 - 120, 70, progressWidth, 10);
        };

        this.updateProgressBar();

        // Astronaut Animation
        const astronaut = this.add.image(-150, window.innerHeight / 2, "astronaut").setScale(2);
        this.tweens.add({
            targets: astronaut,
            x: 750,
            duration: 7000,
            onComplete: () => {
                const messageBox = this.add.graphics()
                    .fillStyle(0x000000, 0.9)
                    .fillRoundedRect(250, window.innerHeight / 2 - 150, 700, 100, 5); // Black box for text

                const dialogueText = this.add.text(270, window.innerHeight / 2 - 140, "Grow 6 Hemp Plants to earn Solar Panels!", {
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#FFF",
                });
// Play Dialogue7 audio
                this.sound.play("Dialogue7");
                this.time.delayedCall(3000, () => {
                    messageBox.destroy();
                    dialogueText.destroy();
                });

                this.tweens.add({
                    targets: astronaut,
                    x: -150,
                    duration: 7000,
                });
            },
        });

        // Add tool selection
        const toolsBox = this.add.graphics()
            .fillStyle(0xFFFFFF, 1)
            .fillRoundedRect(window.innerWidth - 250, window.innerHeight / 6 - 50, 160, 400, 10);

        this.seedButton = this.add.image(window.innerWidth - 280, window.innerHeight / 12, "seeds").setScale(1.2).setInteractive();
        this.waterButton = this.add.image(window.innerWidth - 270, window.innerHeight / 12 + 380, "watering").setScale(1.2).setInteractive();

        this.tweens.add({
            targets: [this.seedButton, this.waterButton],
            alpha: { from: 1, to: 0.7 },
            duration: 500,
            yoyo: true,
            loop: -1,
        });

        this.seedButton.on("pointerdown", () => (this.currentTool = "seeds"));
        this.waterButton.on("pointerdown", () => (this.currentTool = "watering"));

        // Planting and watering mechanism
        this.input.on("pointerdown", (pointer) => {
            if (pointer.x > window.innerWidth - 250) return; // Ignore clicks on the tools UI
        
            if (this.currentTool === "seeds" && this.plantCount < this.maxPlants) {
                this.plantSeed(pointer.x, pointer.y); // Plant a seed
            } else if (this.currentTool === "watering") {
                this.waterPlants(); // Water plants
            }
            this.updateProgressBar(); // Update progress bar after any action
        });
        
    }

    plantSeed(x, y) {
        // Add a seed
        const seed = this.add.image(x, y, "seeds").setScale(0.5);
        this.plants.push({ x, y, stage: "seed", sprite: seed });
        this.plantCount++;
        this.updateScore(1); // Add 1 points for planting a seed
    }

    waterPlants() {
        if (this.currentTool !== "watering") return; // Ensure the watering tool is selected
    
        this.plants.forEach((plant) => {
            if (plant.stage === "seed") {
                // Upgrade seed to sapling
                plant.sprite.setTexture("sapling").setScale(0.5);
                plant.stage = "sapling";
                this.updateScore(1); // Add 1 point
            } else if (plant.stage === "sapling") {
                // Upgrade sapling to hemp plant
                plant.sprite.setTexture("hempPlant").setScale(0.5);
                plant.stage = "hempPlant";
                this.updateScore(2); // Add 1 point
            }
        });
    
        this.updateProgressBar(); // Update progress bar
        if (this.score >= 16) { // Check if the score condition for level completion is met
            this.levelComplete();
        }
    }
    
    updateScore(points) {
        this.score += points;
        this.scoreText.setText(this.score);
    }
    levelComplete() {
        // Disable further interactions
        this.input.removeAllListeners();
    
        // Play win sound
        this.sound.play("winSound");
    
        // Dim the background
        const dimLayer = this.add.graphics()
            .fillStyle(0x000000, 0.5) // Semi-transparent black
            .fillRect(0, 0, window.innerWidth, window.innerHeight); // Full screen
    
        // Display solar panel and winning message
        const panel = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "solarPanel").setScale(1.2);
    
        // Make text bold and fullscreen
        const message = this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 2 - 100,
            "Level Complete!\nSpaceship got the Solar Panel",
            { fontSize: "72px", fontWeight: "bold", color: "#FFF", align: "center" }
        ).setOrigin(0.5);
    
        // Show "Level 3" after a delay
        this.time.delayedCall(3000, () => {
            message.destroy(); // Remove "Level Complete!" message
            panel.destroy(); // Remove the solar panel image
    
            // Show "Level 3" text with fade effect
            const level3Text = this.add.text(window.innerWidth / 2, window.innerHeight / 2, "Level 3", {
                fontSize: "120px",
                fontStyle: "bold",
                color: "#FF0000",
                fontFamily: "Arial",
            }).setOrigin(0.5);
    
            this.tweens.add({
                targets: level3Text,
                alpha: 0,
                duration: 3000, // 3 seconds fade-out
                onComplete: () => {
                    level3Text.destroy(); // Remove "Level 3" text after fade-out
                    this.scene.start("Planet2Level3"); // Replace with the next scene name
                },
            });
        });
    }
}    