class Planet3Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Planet3Level2' });
        this.boat = null;
        this.trash = [];
        this.visibleTrash = [];
        this.bin = null;
        this.score = 0;
        this.trashCollected = 0;
        this.inventory = null;

        // Mapping of trash texture keys to unique names
        this.trashNames = {
            trash1: 'Candy Wrappers',
            trash2: 'Used Styrofoam Box',
            trash3: 'Used Styrofoam Box',
            trash4: 'Empty Plastic Bottle',
            trash5: 'Eaten Apples',
            trash6: 'White Plastic Bag',
            trash7: 'Green Plastic Bag with White Container',
            trash8: 'Used Styrofoam Boxes'
        };
    }

    preload() {
        this.load.image('river-background', 'assets/river-background.jpg');
        this.load.image('boat', 'assets/boat.png');
        this.load.image('3bins', 'assets/3bins.png');
        this.load.audio("lvl2backgroundMusic", "assets/lvl1backgroundMusic.mp3");
        this.load.audio("lvl2correctSound", "assets/lvl1correctSound.mp3");
        this.load.audio("lvl2wrongSound", "assets/lvl1wrongSound.mp3");
        this.load.audio("lvl2rewardSound", "assets/lvl1rewardSound.mp3");
        this.load.audio("clickSound", "assets/clickSound.mp3");

        // Load trash images dynamically
        for (let i = 1; i <= 8; i++) {
            this.load.image(`trash${i}`, `assets/trash${i}.png`);
        }
    }

    create() {
        let bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'river-background');
        bg.setScale(this.scale.width / bg.width);
        bg.setY(this.scale.height - bg.displayHeight / 2);

        let instructionBg = this.add.graphics();
        instructionBg.fillStyle(0x000000, 0.7);
        instructionBg.fillRect(10, 10, this.scale.width - 20, 50);

        this.add.text(20, 20, 'Use arrow keys to navigate, collect trash, and dispose of it in the bin!', {
            fontSize: '20px',
            fill: '#ffffff'
        });

        let inventoryBg = this.add.graphics();
        inventoryBg.fillStyle(0x000000, 0.7);
        inventoryBg.fillRect(10, 70, this.scale.width - 20, 30);

        this.inventoryText = this.add.text(20, 75, 'Inventory: Empty', {
            fontSize: '20px',
            fill: '#ffffff'
        });

        this.boat = this.physics.add.sprite(400, this.scale.height - 100, 'boat').setScale(0.1);
        this.boat.setCollideWorldBounds(true);

        // Trash generation
        for (let i = 0; i < 5; i++) {
            const trashType = `trash${Phaser.Math.Between(1, 8)}`;
            let trash = this.physics.add.sprite(
                Phaser.Math.Between(this.scale.width / 2, this.scale.width - 100),
                Phaser.Math.Between(this.scale.height / 2, this.scale.height - 200),
                trashType
            ).setScale(0.1);

            trash.setActive(false).setVisible(false);
            this.trash.push(trash);
        }

        this.spawnTrash();

        this.bin = this.physics.add.staticSprite(200, this.scale.height - 100, '3bins').setScale(0.5);
        this.bin.setSize(this.bin.displayWidth * 1.20, this.bin.displayHeight * 1.20)
        .setOffset(this.bin.displayWidth * 0.3, this.bin.displayHeight * 0.3); // Handles collision box position

        this.scoreText = this.add.text(this.scale.width - 200, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Input for Boat Movement
        this.cursors = this.input.keyboard.createCursorKeys();

        this.trash.forEach(trash => {
            this.physics.add.overlap(this.boat, trash, (boat, trash) => {
                if (!this.inventory && trash.visible) {
                    this.pickUpTrash(trash);
                }
            });
        });

        this.physics.add.overlap(this.boat, this.bin, (boat, bin) => {
            this.disposeTrash();
        });
    }

    update() {
        // Boat Controls
        let speed = 200;

        if (this.cursors.left.isDown) {
            this.boat.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.boat.setVelocityX(speed);
        } else {
            this.boat.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.boat.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.boat.setVelocityY(speed);
        } else {
            this.boat.setVelocityY(0);
        }

        this.scoreText.setText('Score: ' + this.score);

        if (this.trashCollected === 5) {
            // this.sound.play("lvl2rewardSound");
            this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Level Complete!', {
                fontSize: '48px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(this.scale.width / 2, this.scale.height / 2 + 20,
                'Reward: "Stabilizer" – improves spaceship performance.', {
                fontSize: '24px',
                fill: '#ffff00'
            }).setOrigin(0.5);

            let menuButton = this.add.text(this.scale.width / 3, this.scale.height / 2 + 50, 'Menu', {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#333'
            }).setOrigin(0.5).setInteractive();
            menuButton.on('pointerdown', () => {
                this.sound.play("clickSound");
                this.scene.start('MainMenu');
            });

            let replayButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Replay', {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#555'
            }).setOrigin(0.5).setInteractive();
            replayButton.on('pointerdown', () => {
                this.sound.play("clickSound");
                this.scene.restart();
            });

            let nextLevelButton = this.add.text((this.scale.width / 3) * 2, this.scale.height / 2 + 50, 'Next Level', {
                fontSize: '24px',
                fill: '#000000',
                backgroundColor: '#ffff00'
            }).setOrigin(0.5).setInteractive();
            nextLevelButton.on('pointerdown', () => {
                this.sound.play("clickSound");
                this.scene.start('Planet3Level3');
            });
        }
    }

    spawnTrash() {
        let count = 0;
        for (let trash of this.trash) {
            if (!trash.active) {
                trash.setActive(true).setVisible(true);
                this.visibleTrash.push(trash);
                count++;
            }
            if (count >= 2) break;
        }
    }

    pickUpTrash(trash) {
        trash.destroy();
        this.sound.play("lvl2correctSound");
        this.inventory = this.trashNames[trash.texture.key]; // Use the unique name
        this.inventoryText.setText(`Inventory: ${this.inventory}`);
        this.visibleTrash = this.visibleTrash.filter(t => t !== trash);

        // Spawn next trash if any
        this.spawnTrash();
    }

    disposeTrash() {
        if (this.inventory) {
            this.score += 10;
            this.trashCollected++;
            this.inventory = null;
            this.inventoryText.setText('Inventory: Empty');
        }
    }
}
