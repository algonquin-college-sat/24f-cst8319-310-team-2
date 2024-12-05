class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    init(data) {
        // Validate incoming data
        if (!data || !data.nextScene) {
            console.error('TransitionScene: No next scene specified');
            return this.scene.start('MainMenu');
        }
        this.nextScene = data.nextScene;
        this.levelNumber = this.nextScene.match(/\d+/)?.[0] || null;
    }

    create() {
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(
            0x000000, 0x000000, 0x111111, 0x111111,
            1, 1, 0.8, 0.8
        );
        gradient.fillRect(0, 0, window.innerWidth, window.innerHeight);

        const container = this.add.container(window.innerWidth / 2, window.innerHeight / 2);

        const spinnerRadius = 40;
        const spinner = this.add.graphics();
        container.add(spinner);

        const loadingText = this.add.text(0, 70, 'Loading...', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(loadingText);

        const barWidth = 200;
        const barHeight = 4;
        const progressBg = this.add.rectangle(0, 100, barWidth, barHeight, 0x333333);
        container.add(progressBg);

        const progressBar = this.add.rectangle(
            -barWidth/2, 100, 
            0, barHeight, 
            0x00ff00
        ).setOrigin(0, 0.5);
        container.add(progressBar);

        if (this.levelNumber) {
            const levelText = this.add.text(0, -100, `Level ${this.levelNumber}`, {
                fontSize: '48px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            container.add(levelText);

            this.tweens.add({
                targets: levelText,
                y: -90,
                duration: 1500,
                ease: 'Sine.inOut',
                yoyo: true,
                repeat: -1
            });
        }

        this.tweens.add({
            targets: spinner,
            rotation: Math.PI * 2,
            duration: 1000,
            repeat: -1,
            onUpdate: () => {
                spinner.clear();
                spinner.lineStyle(3, 0xffffff, 1);
                spinner.beginPath();
                spinner.arc(0, 0, spinnerRadius, 0, Math.PI * 1.5);
                spinner.strokePath();
            }
        });

        this.tweens.add({
            targets: loadingText,
            alpha: 0.5,
            duration: 600,
            ease: 'Sine.InOut',
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: progressBar,
            width: barWidth,
            duration: 1000,
            ease: 'Cubic.Out'
        });

        this.cameras.main.fadeIn(500);

        this.time.delayedCall(2000, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(this.nextScene);
                }
            });
        });
        
    }

    shutdown() {
        this.tweens.killAll();
        this.time.removeAllEvents();
    }

}