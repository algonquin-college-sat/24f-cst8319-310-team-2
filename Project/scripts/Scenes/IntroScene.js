class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.dialogues = [
            { text: "Welcome, young explorer! 🌍", audio: "assets/dialogue1.mp3" },
            { text: "You’ve crash-landed on a polluted planet that needs your help.", audio: "assets/dialogue2.mp3" },
            { text: "Rebuild your ship by cleaning up and mastering sustainable living skills.", audio: "assets/dialogue3.mp3" },
            { text: "Let’s get started on your mission to be an eco-hero!", audio: "assets/dialogue4.mp3" }
        ];
        this.currentDialogue = 0;
        this.currentAudio = null;
        this.backgroundMusic = null;
    }

    preload() {
        this.load.image('pollutedPlanet', 'assets/polluted-planet.png');
        this.load.audio('popSound', 'assets/pop-sound.mp3');
        //this.load.audio('backgroundMusic', 'assets/planet-one-audio.mp3'); //TODO: Implement the audio
        this.dialogues.forEach((dialogue, index) => {
            this.load.audio(`dialogue${index}`, dialogue.audio);
        });
    }

    create() {
        // this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.5, loop: true });
        // this.backgroundMusic.play();

        let pollutedPlanet = this.add.image(this.scale.width / 2, this.scale.height / 2, 'pollutedPlanet')
            .setDisplaySize(this.scale.width, this.scale.height)
            .setOrigin(0.5);
        this.popSound = this.sound.add('popSound');

        this.dialogueText = this.add.text(this.scale.width * 0.2, this.scale.height * 0.1, "", {
            fontSize: '24px',
            fill: '#000000',
            wordWrap: { width: this.scale.height * 0.8 }
        })/*.setOrigin(0.5)*/;
        this.showNextDialogue();

        this.nextButton = this.add.text(this.scale.width - 100, this.scale.height - 50, 'Next', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.showNextDialogue())
            .setStyle({
                borderRadius: '10px',
                shadow: { offsetX: 2, offsetY: 2, color: '#333', blur: 2, stroke: true, fill: true }
            });

        this.skipButton = this.add.text(100, this.scale.height - 50, 'Skip', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => { this.stopCurrentAudio(), this.popSound.play(), this.scene.start('MainMenu') } )
            .setStyle({
                borderRadius: '10px',
                shadow: { offsetX: 2, offsetY: 2, color: '#333', blur: 2, stroke: true, fill: true }
            });

        /**
         * This method allows the user to press M to mute the background audio.
         */
        this.input.keyboard.on('keydown-M', () => {
            if (this.backgroundMusic.isPlaying) {
                this.backgroundMusic.pause();
            } else {
                this.backgroundMusic.resume();
            }
        });
    }

    showNextDialogue() {
        this.stopCurrentAudio();
        this.popSound.play();

        if (this.currentDialogue < this.dialogues.length) {
            const { text, audio } = this.dialogues[this.currentDialogue];
            this.dialogueText.setText(text);

            this.currentAudio = this.sound.add(`dialogue${this.currentDialogue}`);
            this.currentAudio.play();

            this.currentDialogue++;
        } else {
            this.scene.start('MainMenu');
        }
    }

    stopCurrentAudio() {
        if (this.currentAudio && this.currentAudio.isPlaying) {
            this.currentAudio.stop();
        }
    }

    update() {
        // More game element logics go here
    }
}