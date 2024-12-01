class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        this.add.text(this.scale.width / 2, this.scale.height * 0.2, 'Main Menu', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height * 0.4, 'Planet 3: Level 1', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        let startLevel3Button = this.add.text(this.scale.width / 2, this.scale.height * 0.6, 'Start Level 1', {
            fontSize: '28px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5).setInteractive();

        startLevel3Button.on('pointerdown', () => {
            this.scene.start('Planet3Level1');
        });
    }

    update() {
        // Add any logic if needed
    }
}
