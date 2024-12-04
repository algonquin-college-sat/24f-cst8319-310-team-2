class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Title Text
        this.add.text(400, 100, 'Main Menu!', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Level Selection Buttons
        const levels = [
            { text: 'Level 1: Planting Grass and Flowers', scene: 'Level1Scene' },
            { text: 'Level 2: Building Animal Shelters', scene: 'Level2Scene' },
            { text: 'Level 3: Planting Trees and Shrubs', scene: 'Level3Scene' },
            { text: 'Level 4: Cleaning Water Sources', scene: 'Level4Scene' },
        ];

        levels.forEach((level, index) => {
            this.add.text(400, 200 + index * 50, level.text, {
                fontSize: '24px',
                fill: '#0f0'
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start(level.scene);
            })
            .on('pointerover', function () {
                this.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', function () {
                this.setStyle({ fill: '#0f0' });
            });
        });

        // Exit or Instructions Button (Optional)
        this.add.text(400, 500, 'Credits / Instructions', {
            fontSize: '20px',
            fill: '#fff'
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            console.log("Show Credits or Instructions");
        });
    }

    update() {
        // Additional logic if needed
    }
}
