class Planet3Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Planet3Level2' });
        this.boat = null;
        this.trash = [];
        this.bins = [];
        this.score = 0;
        this.trashCollected = 0;
        this.inventory = []; // Store collected trash here
    }

    preload() {
        this.load.image('background', 'assets/river-background.png');
        this.load.image('boat', 'assets/boat.png');
        this.load.image('bin', 'assets/bin.png');
        this.load.image('rock', 'assets/rock.png');

        // Load trash images dynamically
        for (let i = 1; i <= 8; i++) {
            this.load.image(`trash${i}`, `assets/trash${i}.png`);
        }
    }

    create() {
        // Background
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
            .setDisplaySize(this.scale.width, this.scale.height);

        // Instructions
        this.add.text(20, 20, 'Use arrow keys to navigate the boat and collect trash!', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Boat (scaled down by 90%)
        this.boat = this.physics.add.sprite(400, this.scale.height - 100, 'boat').setScale(0.1);
        this.boat.setCollideWorldBounds(true);

        // Trash collection
        for (let i = 0; i < 10; i++) {
            // Randomly pick one of the trash images
            const trashType = `trash${Phaser.Math.Between(1, 8)}`;
            let trash = this.physics.add.sprite(
                Phaser.Math.Between(100, this.scale.width - 100),
                Phaser.Math.Between(100, this.scale.height / 2), 
                trashType
            ).setScale(0.2);

            this.trash.push(trash);
        }

        // Bins
        this.bins = [
            this.add.sprite(100, this.scale.height - 100, 'bin').setScale(0.5),
            this.add.sprite(700, this.scale.height - 100, 'bin').setScale(0.5)
        ];

        // Score Display (top right)
        this.scoreText = this.add.text(this.scale.width - 200, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Inventory Display (bottom left)
        this.inventoryText = this.add.text(20, this.scale.height - 100, 'Trash Collected: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Input for Boat Movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // Collisions
        this.trash.forEach(trash => {
            this.physics.add.overlap(this.boat, trash, (boat, trash) => {
                trash.destroy();
                this.trashCollected++;
                this.inventory.push(trash.texture.key);  // Add to inventory
                this.score += 10;
                this.updateInventory();  // Update inventory display
            });
        });

        // Obstacles (Rocks)
        for (let i = 0; i < 5; i++) {
            let rock = this.physics.add.staticSprite(
                Phaser.Math.Between(100, this.scale.width - 100),
                Phaser.Math.Between(100, this.scale.height / 2), 
                'rock'
            ).setScale(0.3);

            this.physics.add.collider(this.boat, rock);
        }
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

        // Update Score
        this.scoreText.setText('Score: ' + this.score);

        // Check for Level Completion
        if (this.trashCollected === this.trash.length) {
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'Level Complete!', {
                fontSize: '48px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(this.scale.width / 2, this.scale.height / 2 + 40, 
                'Reward: "Stabilizer" – improves spaceship performance.', {
                fontSize: '24px',
                fill: '#ffff00'
            }).setOrigin(0.5);

            this.time.delayedCall(5000, () => {
                this.scene.start('MainMenu'); // Return to Main Menu
            });
        }
    }

    // Update inventory text
    updateInventory() {
        let inventoryText = 'Trash Collected: ' + this.trashCollected + '\n';

        // Display collected trash types in the inventory (limited to a few)
        let inventoryLimit = 5;
        let displayInventory = this.inventory.slice(0, inventoryLimit).join(', ');

        if (this.inventory.length > inventoryLimit) {
            inventoryText += displayInventory + '...';
        } else {
            inventoryText += displayInventory;
        }

        this.inventoryText.setText(inventoryText);
    }
}