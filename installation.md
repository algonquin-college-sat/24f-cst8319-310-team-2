
# Installation Guide for Eco-Adventures

Eco-Adventures is built using Phaser.js and must be run via Visual Studio. Follow the steps below to set up and run the game.

---

## Prerequisites
1. **Visual Studio**:
   - Install Visual Studio from [Microsoft's website](https://visualstudio.microsoft.com/).
   - Ensure that the **Node.js development workload** is installed during the Visual Studio setup (optional for debugging purposes).
2. **Web Browser**:
   - A modern browser such as Chrome, Firefox, or Edge.

---

## Steps to Install and Run

### Step 1: Clone the Repository
1. Open a terminal or command prompt.
2. Run the following command to clone the project:
   ```bash
   git clone https://github.com/nav3112/SoftwareProject.git
   ```
3. Navigate to the project directory:
   ```bash
   cd SoftwareProject
   ```

### Step 2: Open the Project in Visual Studio
1. Launch Visual Studio.
2. Click on **Open a Project or Solution**.
3. Navigate to the folder where you cloned the repository.
4. Select the `index.html` file to open the project.

### Step 3: Configure the Project
1. Ensure that all the required Phaser.js libraries are in the `libs/` directory (these are already included in the repository).
2. Verify the file structure:
   - `index.html`: Main entry point for the game.
   - `assets/`: Contains game images, sounds, and other assets.
   - `scripts/`: JavaScript files containing game logic.

### Step 4: Run the Game
1. Right-click on `index.html` in the Solution Explorer.
2. Select **Set as Startup File**.
3. Click the green **Run** button (or press `F5`) to launch the game in your default browser.

---

## Troubleshooting
- **Phaser.js Errors**: Ensure the `phaser.js` library is correctly referenced in the `index.html` file.
- **Browser Issues**: Use a modern browser like Chrome for optimal performance.
- **File Path Problems**: Verify that all file paths in `index.html` are correctly pointing to the `assets/` and `scripts/` directories.

---

## Repository
The repository for this project is available at [https://github.com/nav3112/SoftwareProject](https://github.com/nav3112/SoftwareProject).

---

If you encounter any issues, feel free to raise an issue in the repository or contact the developers.


---

## Level Contributions
The game is organized into levels, and each contributor has developed the following directories for their respective levels:

- **Navjot**: `levels/navjot/`
  - Contains code and assets for the levels navjot contributed, Topic 1.

- **Kushi**: `levels/kushi/`
  - Includes all files related to the levels Kushi designed, such as Topic 2's planting and sorting waste tasks.

- **Savio**: `levels/savio/`
  - Features levels for Topic 3 and the initial design of the sorting waste game mechanics.

- **Lijoy**: `levels/lijoy/`
  - Covers Topic 4, including the air pollution finder and methods to prevent pollution.

Each directory contains the scripts, assets, and configurations specific to the respective levels.

