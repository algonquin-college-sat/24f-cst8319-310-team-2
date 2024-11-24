
let game;
import Level1 from './Level1.js';
import Level2 from './Level2.js';
import Level3 from './Level3.js';
import QuizScene from './QuizScene.js';


window.onload = function () {
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'main-container',
        scene: [MainMenu, Level1, Level2, Level3, QuizScene, TransitionScene],
        physics: {
            default: 'arcade',
            arcade: { debug: false }
        },
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        }
    };

    game = new Phaser.Game(config);

    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });
};

class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('menu-bg', 'images/background.webp');
        this.load.image('leaf', 'images/leaf.png');
        this.load.audio('bgMusic', 'music/bgm.mp3');
        this.load.audio('click', 'music/click.wav');
        
        this.load.on('progress', (value) => {
            console.log('Loading:', Math.round(value * 100) + '%');
        });
        
        this.load.on('loaderror', (file) => {
            console.error('Error loading:', file.key);
        });
    }

    create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'menu-bg')
            .setDisplaySize(window.innerWidth, window.innerHeight);

        this.add.particles(0, 0, 'leaf', {
            x: { min: 0, max: window.innerWidth },
            y: -50,
            lifespan: 4000,
            speedY: { min: 100, max: 200 },
            speedX: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0.2 },
            quantity: 2,
            frequency: 200,
            alpha: { start: 1, end: 0.5 }
        });

        this.add.text(window.innerWidth / 2, window.innerHeight / 3, 'Air Quality Restoration', {
            fontSize: '48px',
            fill: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);

        const startButton = this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 2,
            'Start Level',
            {
                fontSize: '36px',
                fill: '#ffffff',
                backgroundColor: '#2C8A4B',
                padding: { left: 40, right: 40, top: 20, bottom: 20 },
                stroke: '#1a5c31',
                strokeThickness: 2,
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: '#000000',
                    blur: 5,
                    fill: true
                },
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        ).setInteractive().setOrigin(0.5);
        
        startButton.on('pointerover', () => {
            startButton.setStyle({ 
                backgroundColor: '#34A65A',
                stroke: '#217A40'
            });
            this.tweens.add({
                targets: startButton,
                scale: 1.05,
                duration: 200,
                ease: 'Power2'
            });
        });
        
        startButton.on('pointerout', () => {
            startButton.setStyle({ 
                backgroundColor: '#2C8A4B',
                stroke: '#1a5c31'
            });
            this.tweens.add({
                targets: startButton,
                scale: 1,
                duration: 200,
                ease: 'Power2'
            });
        });
        
        startButton.on('pointerdown', () => {
            this.sound.play('click', { volume: 0.5 });
            this.tweens.add({
                targets: startButton,
                scale: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2',
                onComplete: () => {
                    this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                        if (progress === 1) {
                            this.scene.start('TransitionScene', { nextScene: 'Level1' });
                        }
                    });
                }
            });
        });

        this.input.once('pointerdown', () => {
            const music = this.sound.add('bgMusic', {
                volume: 1,
                loop: true
            });
            
            const musicButton = this.add.text(
                window.innerWidth - 100,
                50,
                '🔊',
                {
                    fontSize: '32px',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 10, y: 10 }
                }
            ).setInteractive();

            let isMuted = false;
            musicButton.on('pointerdown', () => {
                if (isMuted) {
                    music.resume();
                    musicButton.setText('🔊');
                } else {
                    music.pause();
                    musicButton.setText('🔈');
                }
                isMuted = !isMuted;
            });

            music.play();
            this.registry.set('bgMusic', music);
        });

    }
    fadeToNextLevel(nextLevel) {
        this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(nextLevel);
            }
        });
    }
}

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
