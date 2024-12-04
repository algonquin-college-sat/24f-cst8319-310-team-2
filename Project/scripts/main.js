let isDebugMode = false;
let debugPopup = null;

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [LoadingScreen, CrashScene, IntroScene, MainMenu, Planet3Level1, Planet3Level2, Planet3Level3],
    parent: 'game-container',
};

const game = new Phaser.Game(config);

game.scene.events.on('start', (scene) => {
    // Reset debug state when a scene starts
    if (isDebugMode && debugPopup) {
        debugPopup.setVisible(true);
    }
});

game.events.on('keydown-F8', toggleDebugMode);

// Function to toggle debug mode and show/hide the popup
function toggleDebugMode() {
    isDebugMode = !isDebugMode;

    if (isDebugMode) {
        // Show the popup with scene switch options
        if (!debugPopup) {
            createDebugPopup();
        } else {
            debugPopup.setVisible(true);
        }
    } else {
        // Hide the popup
        if (debugPopup) {
            debugPopup.setVisible(false);
        }
    }
}

// Function to create the debug popup
function createDebugPopup() {
    debugPopup = game.scene.scenes[0].add.container(0, 0);  // Add to the first scene

    // Create a semi-transparent background
    const background = game.scene.scenes[0].add.graphics();
    background.fillStyle(0x000000, 0.7);
    background.fillRect(0, 0, game.config.width, game.config.height);

    // Create a list of scene buttons
    const sceneNames = ['MainMenu', 'Planet3Level1', 'Planet3Level2', 'CrashScene', 'IntroScene'];
    sceneNames.forEach((sceneName, index) => {
        const button = game.scene.scenes[0].add.text(200, 100 + (index * 50), sceneName, {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333'
        }).setOrigin(0.5).setInteractive();

        button.on('pointerdown', () => {
            game.scene.start(sceneName);
            debugPopup.setVisible(false);  // Hide the debug popup after switching
        });

        debugPopup.add(button);
    });

    // Add the background to the popup container
    debugPopup.add(background);
    debugPopup.setVisible(false);  // Hide initially
}