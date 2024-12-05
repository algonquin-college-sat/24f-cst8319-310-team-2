class Planet3Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Planet3Level1' });
        this.solarPanels = [];
        this.grid = [];
        this.buildingsPowered = 0;
        this.levelComplete = false;
    }

    preload() {
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('solar-panel', 'assets/solar-panel.png');
        this.load.image('building1', 'assets/building1.png');
        this.load.image('building2', 'assets/building2.png');
        this.load.image('building3', 'assets/building3.png');
        this.load.image('building4', 'assets/building4.png');
        this.load.image('building5', 'assets/building5.png');
        this.load.image('powerGrid', 'assets/power-grid.png');
        this.load.audio("lvl1backgroundMusic", "assets/background.mp3");
        this.load.audio("lvl1correctSound", "assets/lvl1correctSound.mp3");
        this.load.audio("lvl1wrongSound", "assets/lvl1wrongSound.mp3");
        this.load.audio("lvl1rewardSound", "assets/lvl1rewardSound.mp3");
        this.load.audio("clickSound", "assets/clickSound.mp3");
    }

    create() {
        this.backgroundMusic = this.sound.add("lvl1backgroundMusic", { loop: true, volume: 1 });
        this.backgroundMusic.play();

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg')
            .setDisplaySize(this.scale.width, this.scale.height)
            .setOrigin(0.5);

        this.add.text(20, 20, 'Drag and drop solar panels to the power grid and power the buildings!', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        const powerGridWidth = this.scale.width * 0.1;
        const powerGridHeight = this.scale.height * 0.2;
        const gridSpacing = 20;
        const powerGridStartX = this.scale.width - 300;
        const powerGridStartY = 200;

        const gridPositions = [
            { x: powerGridStartX, y: powerGridStartY + 240 },
            { x: powerGridStartX + powerGridWidth + gridSpacing, y: powerGridStartY + 240 },
            { x: powerGridStartX, y: powerGridStartY + powerGridHeight + gridSpacing + 240 },
            { x: powerGridStartX + powerGridWidth + gridSpacing, y: powerGridStartY + powerGridHeight + gridSpacing + 240 }
        ];

        gridPositions.forEach(pos => {
            this.add.image(pos.x, pos.y, 'powerGrid')
                .setDisplaySize(powerGridWidth, powerGridHeight)
                .setAlpha(0.8);
        });

        // Define buildings and drop zones. The higher the dropZoneY value is, the lower the drop zone is.
        const buildingImages = ['building1', 'building2', 'building3', 'building4', 'building5'];
        this.grid = [
            { x: 200, y: 400, dropZoneY: 345, powered: false, image: buildingImages[0] },
            { x: 400, y: 500, dropZoneY: 300, powered: false, image: buildingImages[1] },
            { x: 700, y: 500, dropZoneY: 515, powered: false, image: buildingImages[2] },
            { x: 1100, y: 500, dropZoneY: 355, powered: false, image: buildingImages[3] },
            { x: 1400, y: 500, dropZoneY: 420, powered: false, image: buildingImages[4] }
        ];

        this.grid.forEach((spot, index) => {
            const scale = (index === 3) ? 0.3 : 0.6;

            spot.building = this.add.image(spot.x, spot.y, spot.image)
                .setScale(scale)
                .setAlpha(0.5);

            // Create a unique drop zone for each building
            spot.dropZone = this.add.zone(spot.x, spot.dropZoneY, 100, 60)
                .setRectangleDropZone(100, 60)
                .setData('powered', false);
        });

        // Create draggable solar panels
        for (let i = 0; i < 5; i++) {
            let panel = this.add.image(100 + i * 60, this.scale.height - 100, 'solar-panel')
                .setScale(0.1)
                .setInteractive({ draggable: true });

            this.input.setDraggable(panel);

            panel.on('drag', (pointer, dragX, dragY) => {
                panel.x = dragX;
                panel.y = dragY;
            });

            panel.on('dragend', (pointer) => {
                let placed = false;

                // Check if the panel is dropped on a valid drop zone
                this.grid.forEach((spot) => {
                    const zone = spot.dropZone;
                    const bounds = zone.getBounds();
                    if (!spot.powered && Phaser.Math.Distance.Between(panel.x, panel.y, zone.x, zone.y) < 65) {
                        panel.x = zone.x;
                        panel.y = zone.y;
                        spot.powered = true;
                        spot.building.setAlpha(1); // Make building appear fully powered
                        this.buildingsPowered++;
                        placed = true;
                        this.sound.play("lvl1correctSound");
                    }
                });

                // If not placed in a valid drop zone, return to the starting position
                if (!placed) {
                    panel.x = panel.input.dragStartX;
                    panel.y = panel.input.dragStartY;
                }
            });

            this.solarPanels.push(panel);
        }
    }

    updateCompleteMessage() {
        if (this.buildingsPowered === this.grid.length && !this.levelComplete) {
            this.levelComplete = true;
            this.sound.play("lvl1rewardSound");
            this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Level Complete!', {
                fontSize: '48px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.add.text(this.scale.width / 2, this.scale.height / 2 + 20,
                'Reward: "Energy Converter" – allows efficient use of collected energy.', {
                fontSize: '24px',
                fill: '#ffff00'
            }).setOrigin(0.5);

            let menuButton = this.add.text(this.scale.width / 3, this.scale.height / 2 + 50, 'Menu', {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#333'
            }).setOrigin(0.5).setInteractive();
            menuButton.on('pointerdown', () => {
                this.sound.play("clickSound");
                this.backgroundMusic.stop();
                this.scene.start('MainMenu');
            });

            let replayButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Replay', {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#555'
            }).setOrigin(0.5).setInteractive();
            replayButton.on('pointerdown', () => {
                this.backgroundMusic.stop();
                this.sound.play("clickSound");
                this.scene.restart();
            });

            let nextLevelButton = this.add.text((this.scale.width / 3) * 2, this.scale.height / 2 + 50, 'Next Level', {
                fontSize: '24px',
                fill: '#000000',
                backgroundColor: '#ffff00'
            }).setOrigin(0.5).setInteractive();
            nextLevelButton.on('pointerdown', () => {
                this.backgroundMusic.stop();
                this.sound.play("clickSound");
                this.scene.start('Planet3Level2');
            });
        }
    }

    update() {
        this.updateCompleteMessage();
    }
}