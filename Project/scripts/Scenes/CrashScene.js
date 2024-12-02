class CrashScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CrashScene' });
    }

    preload() {
        this.load.image('earth', 'assets/earth.png');  // Potential Favicon
        this.load.image('background', 'assets/bg.jpg');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('stone', 'assets/stone2.png');
        this.load.audio('popSound', 'assets/pop-sound.mp3');
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setDisplaySize(this.scale.width, this.scale.height).setOrigin(0.5);

        this.popSound = this.sound.add('popSound');
        const stone = this.add.image(640, 360, 'stone');
        
        stone.setScale(0.0);

        this.rocket = this.add.sprite(1000, 0, 'rocket').setOrigin(0.5);

        this.tweens.add({
            targets: this.rocket,
            x: 0,
            y: 300,
            duration: 5000,
            ease: 'easeInOut',
            onComplete: () => {
                console.log('Rocket animation complete!');
            }
        });

        this.skipButton = this.add.text(100, this.scale.height - 50, 'Skip', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => { this.popSound.play(), this.scene.start('IntroScene') } )
            .setStyle({
                borderRadius: '10px',
                shadow: { offsetX: 2, offsetY: 2, color: '#333', blur: 2, stroke: true, fill: true }
            });
    }

    update() {
        
    }
}