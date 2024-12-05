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
            debug: false
        }
    },
    scene: [LoadingScreen, StartScreenScene, NameInputScene, SpaceshipScene, CrashScene, IntroScene, IntroductionScene, MainMenu, Planet1Level1, Planet1Level2, Planet1Level3, Scene1, Planet2Level1, Planet2Level2, Planet2Level3, Planet3Level1, Planet3Level2, Planet3Level3],
    parent: 'game-container',
};

const game = new Phaser.Game(config);