class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        this.add.text(400, 300, 'Main Menu!', {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // More game elements go here
    }

    update() {
        // More game element logics go here
    }
}