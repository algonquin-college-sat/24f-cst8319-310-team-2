export default class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
        this.isIntroComplete = false;
        this.score = 0;
        this.placedObjects = [];
        this.isGameComplete = false;
        this.canPlant = false;
    }

    preload() {
        this.load.image('level2-bg', 'images/level2/level2.avif');
        this.load.audio('click', 'music/click.wav');
        this.load.image('player', 'images/player.webp');
        this.load.image('tree', 'images/level2/tree.png');
        this.load.image('cactus', 'images/level2/cactus.png');
        this.load.image('shrub', 'images/level2/shrub.png');
        this.load.image('grass', 'images/level2/grass.png');
        this.load.image('flower', 'images/level2/flower.png');
        this.load.audio('introAudio', 'music/level2/into.mp3');
        this.load.audio('congratsAudio', 'music/level2/congrats.mp3');
        this.load.audio('warningAudio', 'music/level2/lap.mp3');
    }

    create() {

        this.guide = this.add.sprite(-100, window.innerHeight - 50, 'player')
        .setScale(0.5)
        .setOrigin(0.5, 1)
        .setDepth(1000);

    this.dialogueBubble = this.createInfoBubble(200, window.innerHeight - 220, 'Can we get started?\nPress on the screen to begin.')
        .setDepth(1000);
        this.createNavigationBar();
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'level2-bg')
            .setDisplaySize(window.innerWidth, window.innerHeight);

        this.createNavigationBar();
        this.createIntro();

        this.input.on('pointerdown', (pointer) => {
            if (this.isIntroComplete && pointer.y > this.cameras.main.height / 2) {
                this.plantVegetation(pointer.x, pointer.y);
            }
        });
    }

    createNavigationBar() {
        const navBar = this.add.graphics();
        navBar.fillStyle(0x000000, 0.8);
        navBar.fillRect(0, 0, window.innerWidth, 80);

        this.add.text(window.innerWidth / 2, 40, 'Level 2: Greening the Desert', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.scoreText = this.add.text(window.innerWidth - 20, 40, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(1, 0.5);
    }

    createIntro() {
        this.guide = this.add.sprite(-100, window.innerHeight - 50, 'player')
        .setScale(0.5)
        .setOrigin(0.5, 1);

    this.dialogueBubble = this.createInfoBubble(250, window.innerHeight - 240, 'Hey eco-warrior! 🌱\nTap to plant greens and earn 10 points each.\nFit 10 plants here without overlap to control air pollution.\nReady? Tap to start!');

    this.tweens.add({
        targets: this.guide,
        x: 150,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
            this.tweens.add({
                targets: this.dialogueBubble,
                alpha: 1,
                duration: 500,
                onComplete: () => {
                    this.introAudio = this.sound.add('introAudio');
                    this.introAudio.play();
                }
            });
        }
    });

        this.input.on('pointerdown', (pointer) => {
            if (!this.isIntroComplete && pointer.y > 80) {
                this.sound.play('click');
                this.completeIntro();
            }
        });
    }

    completeIntro() {
        if (this.isIntroComplete) return;
        
        this.isIntroComplete = true;
        if (this.introAudio) this.introAudio.stop();
    
        this.tweens.add({
            targets: [this.dialogueBubble, this.skipButton],
            alpha: 0,
            duration: 500,
            onComplete: () => {
                if (this.dialogueBubble) this.dialogueBubble.destroy();
                if (this.skipButton) this.skipButton.destroy();
            }
        });
    
        this.tweens.add({
            targets: this.guide,
            x: window.innerWidth + 100,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                if (this.guide) this.guide.destroy();
                this.time.delayedCall(1000, () => {
                    this.canPlant = true;
                });
            }
        });
    }

    createInfoBubble(x, y, text) {
        const padding = 10;
        const bubbleWidth = 300;
        const bubbleHeight = 200;
    
        const bubble = this.add.graphics({ x: x, y: y });
        
        //  Bubble color
        bubble.fillStyle(0xffffff, 1);
        
        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);
        
        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        
        // Triangle infill
        bubble.fillTriangle(bubbleWidth / 2, bubbleHeight, bubbleWidth / 2 - 10, bubbleHeight + 10, bubbleWidth / 2 + 10, bubbleHeight + 10);
        bubble.lineStyle(4, 0x565656, 1);
        bubble.lineBetween(bubbleWidth / 2 - 10, bubbleHeight, bubbleWidth / 2 + 10, bubbleHeight);
    
        const content = this.add.text(0, 0, text, { 
            fontFamily: 'Arial', 
            fontSize: 20, 
            color: '#000000', 
            align: 'center',
            wordWrap: { width: bubbleWidth - (padding * 2) }
        });
    
        const b = content.getBounds();
    
        content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
    
        const container = this.add.container(0, 0, [ bubble, content ])
        .setDepth(1000); // High depth value for the container
    container.setAlpha(0);

    return container;
    
        return container;
    }

    reintroduceCharacter() {
        if (this.isGameComplete) return;
        if (this.guide) this.guide.destroy();
        if (this.warningBubble) this.warningBubble.destroy();
        if (this.warningAudio) this.warningAudio.stop();
    
        this.guide = this.add.sprite(-100, this.cameras.main.height - 50, 'player')
            .setScale(0.5)
            .setOrigin(0.5, 1)
            .setDepth(1000);
    
        this.warningBubble = this.createInfoBubble(250, this.cameras.main.height - 240, 
            "Hold on, green-thumb guru! Plants need space to grow.\nTry planting somewhere else!")
            .setDepth(1000);
    
        this.tweens.add({
            targets: this.guide,
            x: 150,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.tweens.add({
                    targets: this.warningBubble,
                    alpha: 1,
                    duration: 500,
                    onComplete: () => {
                        // Play warning audio
                        this.warningAudio = this.sound.add('warningAudio');
                        this.warningAudio.play();
                        
                        this.time.delayedCall(3000, () => {
                            if (this.warningAudio) this.warningAudio.stop();
                            this.tweens.add({
                                targets: [this.guide, this.warningBubble],
                                alpha: 0,
                                duration: 1000,
                                onComplete: () => {
                                    if (this.guide) this.guide.destroy();
                                    if (this.warningBubble) this.warningBubble.destroy();
                                }
                            });
                        });
                    }
                });
            }
        });
    }


    showWarningMessage() {
        const warningText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'You could not place one on top of the other!', {
            fontSize: '32px',
            fill: '#ff0000',
            backgroundColor: '#ffffff',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5);
    
        this.time.delayedCall(2000, () => warningText.destroy());
    }

    checkOverlap(x, y) {
        for (let obj of this.placedObjects) {
            const distance = Phaser.Math.Distance.Between(x, y, obj.x, obj.y);
            const combinedRadius = (obj.object.width * obj.object.scaleX + obj.object.height * obj.object.scaleY) / 4;
            if (distance < combinedRadius) {
                return true;
            }
        }
        return false;
    }

    plantVegetation(x, y) {
        if (!this.canPlant) return;
        
        if (this.checkOverlap(x, y)) {
            this.reintroduceCharacter();
            return;
        }
    
        
        
        const vegetation = ['tree', 'cactus', 'shrub', 'grass', 'flower'];
        const randomVegetation = vegetation[Math.floor(Math.random() * vegetation.length)];
        
        const vegetationScales = {
            'tree': 1.5,
            'cactus': 1.0,
            'shrub': 0.5,
            'grass': 0.5,
            'flower': 0.5
        };
        
        const distanceFromMiddle = y - (this.cameras.main.height / 2);
        const maxDistance = this.cameras.main.height / 2;
        const distanceRatio = Math.abs(distanceFromMiddle) / maxDistance;
        
        const baseScale = vegetationScales[randomVegetation];
        const finalScale = baseScale * (.5 + distanceRatio);
        const depth = y;
        
        const newVegetation = this.add.image(x, y, randomVegetation)
            .setScale(finalScale)
            .setDepth(depth);
        
        this.placedObjects.push({x, y, object: newVegetation});
        this.sound.play('click');
        this.score += 10;
        this.updateScore();
    
        
    }
    
    

    updateScore() {
        this.scoreText.setText(`Score: ${this.score}`);
        if (this.score === 100) {
            this.isGameComplete = true;
            this.showCongratulations();
        }
    }

    showCongratulations() {
        // Stop any existing audio
        if (this.introAudio) this.introAudio.stop();
        if (this.warningAudio) this.warningAudio.stop();
    
        // Add character
        this.guide = this.add.sprite(-100, this.cameras.main.height - 50, 'player')
            .setScale(0.5)
            .setOrigin(0.5, 1)
            .setDepth(1000);
    
        // Create congratulations bubble
        this.congratsBubble = this.createInfoBubble(250, this.cameras.main.height - 240, 
            "🎉 Woohoo! You did it! \nThe desert is now a blooming wonderland thanks to you. \nTime for the next adventure!")
            .setDepth(1000);
    
        // Add next level button
        this.nextLevelButton = this.add.text(
            this.cameras.main.width - 30,
            this.cameras.main.height - 30,
            'Next Level',
            {
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                fill: '#ffffff',
                backgroundColor: '#4CAF50',
                padding: { left: 20, right: 20, top: 12, bottom: 12 },
                shadow: { offsetX: 2, offsetY: 2, color: '#2E7D32', fill: true, blur: 4 }
            }
        )
        .setOrigin(1, 1)
        .setInteractive({ useHandCursor: true })
        .setDepth(1000);
    
        // Add hover effects
        this.nextLevelButton.on('pointerover', () => {
            this.nextLevelButton.setStyle({ backgroundColor: '#45a049' });
        });
    
        this.nextLevelButton.on('pointerout', () => {
            this.nextLevelButton.setStyle({ backgroundColor: '#4CAF50' });
        });
    
        // Add click effect
        this.nextLevelButton.on('pointerdown', () => {
            this.nextLevelButton.setStyle({ backgroundColor: '#3d8b40' });
        });
    
        this.nextLevelButton.on('pointerup', () => {
            this.nextLevelButton.setStyle({ backgroundColor: '#45a049' });
            this.sound.play('click');
            this.cleanupAndTransition();
        });
    
        // Animate button appearance
        this.nextLevelButton.setAlpha(0);
        this.tweens.add({
            targets: this.nextLevelButton,
            alpha: 1,
            duration: 500,
            delay: 1000 
        });
    
        // Play congratulation animation and audio
        this.tweens.add({
            targets: this.guide,
            x: 150,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.tweens.add({
                    targets: this.congratsBubble,
                    alpha: 1,
                    duration: 500,
                    onComplete: () => {
                        // Play congratulatory audio
                        this.congratsAudio = this.sound.add('congratsAudio');
                        this.congratsAudio.play();
                        
                        // Listen for audio completion
                        this.congratsAudio.once('complete', () => {
                            this.cleanupAndTransition();
                        });
                    }
                });
            }
        });
    
        // Handle next level button click
        this.nextLevelButton.on('pointerdown', () => {
            this.sound.play('click');
            this.cleanupAndTransition();
        });
    }
    
    cleanupAndTransition() {
        // Stop all audio
        if (this.congratsAudio) this.congratsAudio.stop();
        if (this.introAudio) this.introAudio.stop();
        if (this.warningAudio) this.warningAudio.stop();
    
        // Cleanup game objects
        if (this.guide) this.guide.destroy();
        if (this.congratsBubble) this.congratsBubble.destroy();
        if (this.nextLevelButton) this.nextLevelButton.destroy();
    
        // Transition to next level
        this.scene.start('TransitionScene', { nextScene: 'Level3' });
    }

}