class Planet4IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Planet4IntroScene' });
    }

    preload() {
        this.load.image('menu-bg', 'assets/planet4/background.webp');
        this.load.image('leaf', 'assets/planet4/leaf.png');
        this.load.audio('bgMusic', 'assets/planet4/music/bgm.mp3');
        this.load.audio('click', 'assets/planet4/music/click.wav');
        
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

        this.add.text(window.innerWidth / 2, window.innerHeight / 3, 'Planet 4: Air Quality Restoration', {
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

        // this.input.once('pointerdown', () => {
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
        // });

    }
    fadeToNextLevel(nextLevel) {
        this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(nextLevel);
            }
        });
    }
}