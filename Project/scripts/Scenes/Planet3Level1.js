class Planet3Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Planet3Level1' });
        this.solarPanels = [];
        this.grid = [];
        this.buildingsPowered = 0;
    }

    preload() {
        this.load.image('background', 'assets/level-background.png');
        this.load.image('solarPanel', 'assets/solar-panel.png');
        this.load.image('building1', 'assets/building1.png'); // First building image
        this.load.image('building2', 'assets/building2.png'); // Second building image
        this.load.image('building3', 'assets/building3.png'); // Third building image
        this.load.image('building4', 'assets/building4.png'); // Fourth building image
        this.load.image('building5', 'assets/building5.png'); // Fifth building image
        this.load.image('powerGrid', 'assets/power-grid.png'); // Power grid image
    }

    create() {
        // Background
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background')
            .setDisplaySize(this.scale.width, this.scale.height)
            .setOrigin(0.5);

        // Instructions
        this.add.text(20, 20, 'Drag and drop solar panels to the power grid and power the buildings!', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Power Grid
        this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, 'powerGrid')
            .setDisplaySize(this.scale.width * 0.2, this.scale.height * 0.4)
            .setAlpha(0.8); // Semi-transparent for better visibility

        // Buildings
        const buildingImages = ['building1', 'building2', 'building3', 'building4', 'building5'];

        // Define positions, ensuring they're spaced apart and not behind each other
        this.grid = [
            { x: 200, y: 400, powered: false, image: buildingImages[0] },
            { x: 400, y: 500, powered: false, image: buildingImages[1] },
            { x: 700, y: 500, powered: false, image: buildingImages[2] },
            { x: 1100, y: 500, powered: false, image: buildingImages[3] },
            { x: 1400, y: 500, powered: false, image: buildingImages[4] }
        ];

        this.grid.forEach((spot, index) => {
            // Apply smaller scale for building 4 (index 3 in grid)
            const scale = (index === 3) ? 0.3 : 0.6;

            spot.building = this.add.image(spot.x, spot.y, spot.image)
                .setScale(scale) // Adjust scale for building 4
                .setAlpha(0.5);

            // Add a unique "placement zone" at the bottom of each building
            spot.dropZone = this.add.zone(spot.x, spot.y + 50, 100, 60) // Slightly larger zone size
                .setRectangleDropZone(100, 60) // Unique size for each building
                .setData('powered', false);
        });

        // Solar Panels
        for (let i = 0; i < 5; i++) {
            let panel = this.add.image(100 + i * 120, this.scale.height - 100, 'solarPanel')
                .setScale(0.1) // Further reduced scale for smaller solar panels
                .setInteractive({ draggable: true });

            this.input.setDraggable(panel);

            panel.on('drag', (pointer, dragX, dragY) => {
                panel.x = dragX;
                panel.y = dragY;
            });

            panel.on('dragend', (pointer) => {
                let placed = false;

                this.grid.forEach((spot) => {
                    const zone = spot.dropZone;
                    const bounds = zone.getBounds();
                    // Increase the range of solar panel placement by checking against larger bounds
                    if (!spot.powered && Phaser.Math.Distance.Between(panel.x, panel.y, zone.x, zone.y) < 50) {
                        panel.x = zone.x; // Snap to drop zone
                        panel.y = zone.y;
                        spot.powered = true;
                        spot.building.setAlpha(1); // Highlight the powered building
                        this.buildingsPowered++;
                        placed = true;
                    }
                });

                if (!placed) {
                    panel.x = panel.input.dragStartX; // Reset to original position
                    panel.y = panel.input.dragStartY;
                }
            });

            this.solarPanels.push(panel);
        }
    }
    
    updateCompleteMessage() {
        if (this.buildingsPowered === this.grid.length) {
            this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Level Complete!', {
                fontSize: '48px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Reward message
            this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, 
                'Reward: "Energy Converter" – allows efficient use of collected energy.', {
                fontSize: '24px',
                fill: '#ffff00'
            }).setOrigin(0.5);

            this.time.delayedCall(5000, () => {
                this.scene.start('MainMenu'); // Planet3Level2??
            });
        }
    }

    update() {
        this.updateCompleteMessage();
    }
}