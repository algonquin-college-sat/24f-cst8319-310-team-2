class Planet2Level1 extends Phaser.Scene {
    constructor() {
        super("Planet2Level1");
    }

    preload() {
        // Load assets
        this.load.image("background2", "assets/topic2/level1/backgrund2.png");
        this.load.image("bamboo", "assets/topic2/level1/bamboo.png");
        this.load.image("moss", "assets/topic2/level1/moss.png");
        this.load.image("vines", "assets/topic2/level1/vines.png");
        this.load.image("leaves", "assets/topic2/level1/leaves.png");
        this.load.image("shelter1", "assets/topic2/level1/shelter1den.png");
        this.load.image("shelter2", "assets/topic2/level1/shelter2burrow.png");
        this.load.image("shelter3", "assets/topic2/level1/shelter3birdhouse.png");
        this.load.image("glowingspot", "assets/topic2/level1/glowingspot.png");
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
        this.load.image("BlackBin", "assets/topic2/level1/blackBin.png");
        this.load.image("BlueBin", "assets/topic2/level1/blueBin.png");
        this.load.image("GreenBin", "assets/topic2/level1/greenBin.png");
        this.load.image("rocks", "assets/topic2/level1/rocks.png");
        this.load.image("spaceship", "assets/topic2/level1/spaceship.png");
        this.load.image("abandonedJunk", "assets/topic2/level1/abandonedjunk1.png"); 
        this.load.audio('correctSound', 'assets/topic2/music/correctAnswer.mp3'); // Correct bin placement
        this.load.audio('wrongSound', 'assets/topic2/music/wrongAnswer.mp3');
        this.load.audio("Dialogue6", "assets/topic2/music/Drag materials to g.mp3");
      this.load.audio('winSound', 'assets/topic2/music/win.mp3');  // Incorrect bin placement
      this.load.audio('gameOverSound', 'assets/topic2/music/GameOver.mp3'); // Game over sound
      this.load.audio("backgroundMusic", "assets/topic2/music/backgroundMusic.mp3");
    }

    create() {
        // Background
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, "background2").setDisplaySize(window.innerWidth, window.innerHeight);
        this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 0.5 });
        this.backgroundMusic.play();
        // Timer, Score, and Progress Bar
        this.timeLeft = 180; // 3 minutes
        this.score = 0;
        this.targetScore = 25;

        this.add.graphics()
            .fillStyle(0xFFA500, 0.9) // Orange box
            .fillRoundedRect(20, 30, 280, 100, 10); // Increased height for progress bar

        this.add.text(30, 30, "Time Left:", { fontSize: "18px", color: "#000" });
        this.timerText = this.add.text(150, 30, "3:00", { fontSize: "18px", color: "#000" });
        this.add.text(30, 60, "Oxygen Generator:", { fontSize: "17px", color: "#000" });
        this.scoreText = this.add.text(230, 60, `${this.score} / ${this.targetScore}`, { fontSize: "18px", color: "#000" });
        

// Add instructions at the top center
const instructionBox = this.add.graphics()
    .fillStyle(0x000000, 0.8) // Black background with some transparency
    .fillRoundedRect(window.innerWidth / 2 - 300, 10, 600, 60, 10) // Centered box
    .setDepth(15); // Ensure it appears on top

const instructionText = this.add.text(
    window.innerWidth / 2,
    40,
    "Drag materials to glowing spots to build shelters!",
    { fontSize: "20px", color: "#FFF", fontStyle: "bold", align: "center" }
).setOrigin(0.5).setDepth(16); // Ensure text is above the box

// Play dialogue5 audios
this.sound.play('Dialogue6');

// Automatically hide the instructions after a few seconds
this.time.delayedCall(5000, () => {
    instructionBox.destroy();
    instructionText.destroy();
});


        // Progress Bar
        this.progressBar = this.add.graphics();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft -= 1;
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                this.timerText.setText(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
                if (this.timeLeft <= 0) {
                    this.endGame();
                }
            },
            callbackScope: this,
            loop: true,
        });
// Spaceship Button
         const spaceship = this.add.image(400, 60, "spaceship").setScale(0.8).setInteractive();
         this.tweens.add({
         targets: spaceship,
         alpha: { from: 1, to: 0.8 },
         duration: 500,
         yoyo: true,
         loop: -1,
         });

        spaceship.on("pointerdown", () => {
        this.pauseGame();
        this.showProgressBox();
});

        // Bins
        this.greenBin = this.add.image(window.innerWidth - 100, 150, "GreenBin").setScale(0.45).setInteractive();
        this.blueBin = this.add.image(window.innerWidth - 100, 350, "BlueBin").setScale(0.45).setInteractive();
        this.blackBin = this.add.image(window.innerWidth - 100, 550, "BlackBin").setScale(0.45).setInteractive();

        // Garbage and Materials
        const garbageItems = [
            { x: 1010, y: 400, key: "plasticbottle", bin: "blue" },
            { x: 140, y: 400, key: "rustedBarrel", bin: "black" },
            { x: 200, y: 400, key: "apple", bin: "green" },
            { x: 250, y: 400, key: "batteries", bin: "blue" },
            { x: 300, y: 400, key: "bigbattery", bin: "blue" },
            { x: 370, y: 550, key: "can", bin: "blue" },
            { x: 450, y: 300, key: "chicken", bin: "green" },
            { x: 500, y: 400, key: "egg", bin: "green" },
            { x: 650, y: 400, key: "foodwaste", bin: "green" },
            { x: 900, y: 400, key: "rustedmachinery", bin: "black" },
        ];

        garbageItems.forEach(item => this.createGarbage(item.x, item.y, item.key, item.bin));

        // Update Progress Bar
        this.updateProgressBar();
        // Define Shelters
        const shelters = [
        { x: 150, y: window.innerHeight - 140, shelter: "shelter1", info: "Rocks and Vines", materials: ["rocks", "vines"] },
        { x: 600, y: window.innerHeight - 140, shelter: "shelter2", info: "Moss and Bamboo", materials: ["moss", "bamboo"] },
        { x: 900, y: window.innerHeight - 140, shelter: "shelter3", info: "Leaves and Bamboo", materials: ["leaves", "bamboo"] },
];
// Define Materials
const materials = [
    { x: 200, y: 200, key: "bamboo" },
    { x: 1100, y: 200, key: "moss" },
    { x: 950, y: 200, key: "vines" },
    { x: 400, y: 200, key: "rocks" },
    { x: 550, y: 200, key: "leaves" },
    { x: 80, y: 200, key: "bamboo" }
];

// Create each material
materials.forEach(material => {
    this.createMaterial(material.x, material.y, material.key);
});

// Create each shelter with glowing spots
        shelters.forEach(shelter => {
        this.createShelter(shelter.x, shelter.y, shelter.shelter, shelter.info, shelter.materials);
});

    }
    showProgressBox() {
        // Dim background
        const dimBackground = this.add.graphics()
            .fillStyle(0x000000, 0.7)
            .fillRect(0, 0, window.innerWidth, window.innerHeight)
            .setDepth(10);
    
        // White box
        const box = this.add.graphics()
            .fillStyle(0xFFFFFF, 1)
            .fillRoundedRect(window.innerWidth / 4, window.innerHeight / 4, window.innerWidth / 2, window.innerHeight / 2, 10)
            .setDepth(11);
    
        // Title
        const titleText = this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 4 + 30,
            "Progress Details",
            { fontSize: "24px", fontStyle: "bold", color: "#000" }
        ).setOrigin(0.5).setDepth(12);
    
        // Progress Text
        const progressText = this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 2 - 50,
            `Points Needed: ${this.targetScore - this.score}\n\nCorrect Garbage to Bin Mapping:\n- Green Bin: Organic Waste\n- Blue Bin: Plastics\n- Black Bin: Hazardous Waste`,
            { fontSize: "18px", color: "#000", align: "center", wordWrap: { width: window.innerWidth / 2 - 50 } }
        ).setOrigin(0.5).setDepth(12);
    
        // Automatically hide the progress box after a few seconds
        this.time.delayedCall(6000, () => {
            if (dimBackground) dimBackground.destroy();
            if (box) box.destroy();
            if (titleText) titleText.destroy();
            if (progressText) progressText.destroy();
            console.log("Progress box elements destroyed");
            this.resumeGame(); // Resume the game
        });
        
    }
    pauseGame() {
        this.scene.pause();
    }
    
    resumeGame() {
        console.log("Resuming the game"); // Debug message
        this.scene.resume(); // Resume the game
    }
    
    
    createShelter(x, y, shelterKey, info, requiredMaterials) {
        const glowingSpot = this.add.image(x, y, "glowingspot").setScale(1).setInteractive();
        glowingSpot.requiredMaterials = [...requiredMaterials];
        glowingSpot.collectedMaterials = [];
    
        // Display material requirements below the glowing spot
        const infoBox = this.add.graphics()
            .fillStyle(0xFFFFFF, 1) // White box for text
            .fillRoundedRect(x - 100, y + 40, 200, 60, 10);
        const infoText = this.add.text(x, y + 70, `Needs: ${info}`, {
            fontSize: "14px",
            color: "#000",
            align: "center",
            wordWrap: { width: 180 },
        }).setOrigin(0.5);
    
        // Handle glowing spot click
        glowingSpot.on("pointerdown", () => {
            if (!this.selectedMaterial) return; // No material selected
    
            const material = this.selectedMaterial;
            if (glowingSpot.requiredMaterials.includes(material.texture.key)) {
                glowingSpot.collectedMaterials.push(material.texture.key);
                glowingSpot.requiredMaterials = glowingSpot.requiredMaterials.filter(item => item !== material.texture.key);
                material.destroy(); // Remove material from the scene
                this.selectedMaterial = null; // Clear selected material
    
                // Check if all materials are collected
                if (glowingSpot.requiredMaterials.length === 0) {
                    this.createSmokeEffect(x, y); // Show smoke effect
                    this.time.delayedCall(500, () => {
                        glowingSpot.setTexture(shelterKey); // Replace glowing spot with shelter
                        infoBox.destroy(); // Remove info box
                        infoText.destroy(); // Remove text
                        this.updateScore(4); // Add points for completing the shelter
                    });
                }
            }
        });
    }
    createMaterial(x, y, key) {
        const material = this.add.image(x, y, key).setScale(0.4).setInteractive({ useHandCursor: true });
        material.originalX = x;
        material.originalY = y;
    
        material.on("pointerdown", () => {
            if (this.selectedMaterial) {
                this.selectedMaterial.clearTint(); // Clear previous selection
            }
            this.selectedMaterial = material;
            this.selectedMaterial.setTint(0x00FF00); // Highlight selected material in green
        });
    }
    
    createGarbage(x, y, key, correctBin) {
        const garbage = this.add.image(x, y, key).setScale(0.4).setInteractive({ useHandCursor: true });
        garbage.originalX = x;
        garbage.originalY = y;
    
        garbage.on("pointerdown", () => {
            if (this.selectedGarbage) {
                this.selectedGarbage.clearTint(); // Clear previous selection
            }
            this.selectedGarbage = garbage;
            this.selectedGarbage.correctBin = correctBin; // Assign the correct bin to the selected garbage
            this.selectedGarbage.setTint(0x00FF00); // Highlight selected item in green
        });
    
        this.input.on("gameobjectdown", (pointer, clickedObject) => {
            if (!this.selectedGarbage || !clickedObject) return;
    
            const binKey = this.getBinKey(clickedObject);
    
            if (binKey === this.selectedGarbage.correctBin) {
                this.sound.play("correctSound"); // Play correct sound
                this.selectedGarbage.destroy();
                this.selectedGarbage = null;
                this.updateScore(2); // Add points for correct bin
            } else if (["green", "blue", "black"].includes(binKey)) {
                this.sound.play("wrongSound"); // Play wrong sound
                clickedObject.setTint(0xFF0000); // Highlight incorrect bin in red
                this.time.delayedCall(500, () => clickedObject.clearTint()); // Reset tint
                this.resetGarbagePosition(); // Reset garbage position
                this.updateScore(-1); // Deduct points for incorrect bin
            }
        });
    }
    

    getBinKey(binObject) {
        if (binObject === this.greenBin) return "green";
        if (binObject === this.blueBin) return "blue";
        if (binObject === this.blackBin) return "black";
        return null;
    }

    resetGarbagePosition() {
        if (this.selectedGarbage) {
            this.selectedGarbage.x = this.selectedGarbage.originalX;
            this.selectedGarbage.y = this.selectedGarbage.originalY;
            this.selectedGarbage.clearTint();
            this.selectedGarbage = null;
        }
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`${this.score} / ${this.targetScore}`);
        this.updateProgressBar();
        this.checkLevelCompletion();

        
    }

    updateProgressBar() {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x00FF00, 1); // Green color for progress bar
        const progressWidth = (this.score / this.targetScore) * 180; // Adjusted width to fit in the box
        this.progressBar.fillRect(30, 90, progressWidth, 10); // Position under score in orange box
    }
    createSmokeEffect(x, y) {
        const smoke = this.add.image(x, y, "smoke").setScale(1).setAlpha(0.8);
        this.tweens.add({
            targets: smoke,
            alpha: 0,
            duration: 1000,
            onComplete: () => smoke.destroy(),
        });
    }

    checkLevelCompletion() {
        if (this.score >= this.targetScore) {
            this.sound.play("winSound"); // Play win sound
    
            // Dim the background
            const overlay = this.add.graphics()
                .fillStyle(0x000000, 0.7)
                .fillRect(0, 0, window.innerWidth, window.innerHeight);
    
            // Display level completion message
            const completionText = this.add.text(
                window.innerWidth / 2,
                window.innerHeight / 2,
                "Level Complete!\nSpaceship got the Oxygen Generator!",
                { fontSize: "48px", color: "#FFF", fontStyle: "bold", align: "center" }
            ).setOrigin(0.5);
    
            // Delay for the "Level 2" fade effect
            this.time.delayedCall(3000, () => {
                completionText.destroy(); // Remove the completion text
                overlay.clear(); // Clear overlay
    
                // Display "Level 2" with fade effect
                const level2Text = this.add.text(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    "Level 2",
                    { fontSize: "72px", fontStyle: "bold", color: "ff0000", align: "center" }
                ).setOrigin(0.5).setAlpha(0);
    
                this.tweens.add({
                    targets: level2Text,
                    alpha: 1, // Fade in
                    duration: 2000,
                    onComplete: () => {
                        this.time.delayedCall(1000, () => {
                            this.tweens.add({
                                targets: level2Text,
                                alpha: 0, // Fade out
                                duration: 2000,
                                onComplete: () => {
                                    this.backgroundMusic.stop();
                                    this.scene.start("Planet2Level2"); // Transition to Level 2
                                },
                            });
                        });
                    },
                });
            });
        }
    }
    saveProgress() {
        // Save current progress to localStorage
        localStorage.setItem(
            "playerProgress",
            JSON.stringify({
            currentScene: "Planet2Level1",
            currentDialogueIndex: this.currentDialogueIndex,
            isShaking: this.isShaking,
            })
        );
    }
}    