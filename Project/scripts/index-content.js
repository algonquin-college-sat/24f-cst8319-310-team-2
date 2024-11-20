

document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const instructions = document.getElementById('instructions');
    const spaceship = new Image();
    spaceship.src = 'images/spaceship.png';
    const trashBin = new Image();
    trashBin.src = 'images/trash_bin.png';
    const recycleBin = new Image();
    recycleBin.src = 'images/recycle_bin.png';

    const items = [
        { x: 200, y: 150, type: 'trash' },
        { x: 250, y: 100, type: 'recycle' },
        { x: 300, y: 180, type: 'trash' },
        { x: 350, y: 130, type: 'recycle' },
    ];

    let collectedItems = 0;
    const totalItems = items.length;

    gameCanvas.width = 800;
    gameCanvas.height = 300;

    function startLevel1() {
        instructions.textContent = "Crash Site Cleanup: Click items to pick them up and sort them into the correct bins.";
        drawEnvironment();
    }

    function drawEnvironment() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        ctx.drawImage(spaceship, 100, 100, 100, 100);

        ctx.drawImage(trashBin, 650, 50, 50, 50);
        ctx.drawImage(recycleBin, 650, 150, 50, 50);

        items.forEach(item => {
            if (!item.collected) {
                ctx.fillStyle = item.type === 'trash' ? 'brown' : 'blue';
                ctx.beginPath();
                ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        });
    }

    function handleItemClick(event) {
        const clickX = event.clientX - gameCanvas.offsetLeft;
        const clickY = event.clientY - gameCanvas.offsetTop;

        for (const item of items) {
            if (!item.collected && Math.hypot(item.x - clickX, item.y - clickY) < 10) {
                item.collected = true;
                collectedItems++;
                sortItem(item);
                drawEnvironment();
                break;
            }
        }

        if (collectedItems === totalItems) {
            instructions.textContent = "Well done! You've cleared the crash site. Storage area unlocked!";
        }
    }

    function sortItem(item) {
        const binType = item.type === 'trash' ? 'Trash' : 'Recyclables';
        instructions.textContent = `Item sorted into ${binType} bin!`;
    }

    gameCanvas.addEventListener('click', handleItemClick);
    startLevel1();
});
