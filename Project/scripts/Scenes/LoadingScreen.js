class LoadingScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScreen' });
    }

    preload() {
        this.load.video('background', 'assets/outer-space-video.mp4');
        this.load.audio('outerSound', 'assets/Outer.mp3');
    }

    create() {
        let backgroundVideo = this.add.video(game.scale.width / 2, game.scale.height / 2, 'background').setOrigin(0.5);

        let startButton = this.add.text(game.scale.width / 2, game.scale.height * 0.85, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000'
        }).setOrigin(0.5).setInteractive();

        backgroundVideo.play(false);
        backgroundVideo.on('complete', () => {
            backgroundVideo.play(false);
        });

        startButton.on('pointerdown', () => {
            const outerSound = this.sound.add('outerSound');
            startButton.setVisible(false); // can also use startButton.destroy();
            outerSound.play();
            this.time.delayedCall(2000, () => {
                outerSound.stop();
                this.scene.start('CrashScene'); //IntroScene
            });
        });
    }
}