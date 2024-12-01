class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Main Menu Title
        this.add.text(this.scale.width / 2, this.scale.height * 0.2, 'Main Menu', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Level 1 Button
        let level1Button = this.add.text(this.scale.width / 2, this.scale.height * 0.4, 'Planet 3: Level 1', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5).setInteractive();

        level1Button.on('pointerdown', () => {
            this.scene.start('Planet3Level1');
        });

        // Level 2 Button
        let level2Button = this.add.text(this.scale.width / 2, this.scale.height * 0.6, 'Planet 3: Level 2', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#555'
        }).setOrigin(0.5).setInteractive();

        level2Button.on('pointerdown', () => {
            this.scene.start('Planet3Level2');
        });
    }

    update() {
        // Additional logic if needed
    }
}
