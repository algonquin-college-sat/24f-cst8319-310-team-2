// Select the start button, start screen, hover area, and the Next button
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const hoverArea = document.querySelector('.hover-area');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextButton = document.getElementById('Next'); // Updated to reference the Next button
const blackOverlay = document.getElementById('blackOverlay'); // Reference the black overlay
const smoke = document.getElementById('smoke2');
const board  = document.getElementById('board');
const prevButton = document.getElementById('Prev');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const prevImage = document.getElementById('prevImage');
const nextImage = document.getElementById('nextImage');
const closeModal = document.getElementById('closeModal');
const bins = document.getElementById('3bins');
const rover = document.getElementById('rover');
const next1 = document.getElementById('Next2');
const prev1 = document.getElementById('Prev2');
const scoreDisplay = document.getElementById('score'); 
const greenBin = document.getElementById('greenBin');
const blackBin =document.getElementById('blackBin');
const blueBin = document.getElementById('blueBin');
const trashItems3 = {
  brokenCan1: document.getElementById('brokenCan1'),
  cardboardBox1: document.getElementById('cardboardBox1'),
  plasticBottle1: document.getElementById('plasticBottle1'),
  glassBottle1: document.getElementById('glassBottle1'),
  foodWrapper1: document.getElementById('foodWrapper1'),
  plasticBag1: document.getElementById('plasticBag1'),
  oldShoe1: document.getElementById('oldShoe1'),
  crumpledPaper1: document.getElementById('crumpledPaper1'),
  rustyCan1: document.getElementById('rustyCan1'),
  bananaPeel1: document.getElementById('bananaPeel1'),
  brokenEgg1: document.getElementById('brokenEgg1'),
  organicWaste1: document.getElementById('organicWaste1'),
  oldCup1: document.getElementById('oldCup1'),
  milkCarton1: document.getElementById('milkCarton1'),
  pizzaBox1: document.getElementById('pizzaBox1')
};
const explosionSound = new Audio('public/assets/spaceexplosion.mp3'); // Load the explosion sound
const backgroundMusic = new Audio('public/assets/background.mp3'); // Load background music
backgroundMusic.loop = true; // Loop the background music
backgroundMusic.volume = 0.5;

function startBackgroundMusic() {
  backgroundMusic.play().catch(function (error) {
    console.log('Error playing background music: ', error);
  });
}

// Function to play explosion sound
function playExplosionSound() {
  explosionSound.play().catch(function (error) {
    console.log('Error playing explosion sound: ', error);
  });
}

// Load images
const stoneImage = new Image();
stoneImage.src = 'public/assets/stone2.png';
const rocketImage = new Image();
rocketImage.src = 'public/assets/rocket.png';
const newRocketImage = new Image();
newRocketImage.src = 'public/assets/crashedrocket.png';


const dialogueBox = document.getElementById('dialogueBox');

function showAstronautDialogues() {
    const dialogues = [
        "Oh no, what just happened?!",
        "Where are we? This place is a mess!",
        "Why am I surrounded by all this trash?",
        "Hmm, let’s explore and find out more!",
    ];
    
    let dialogueIndex = 0;

    function showNextDialogue() {
        if (dialogueIndex < dialogues.length) {
            dialogueBox.innerHTML = dialogues[dialogueIndex]; // Set dialogue text
            dialogueBox.style.display = 'block'; // Show dialogue box
            dialogueIndex++;
            setTimeout(showNextDialogue, 3000); 
        } else {
            dialogueBox.style.display = 'none'; // Hide dialogue box when done
        }
    }

    // Start showing dialogues
    showNextDialogue();
}

function showAstronautDialogues2() {
  const dialogues = [
      "Wow, this place is massive!",
      "Hey, I see a board over there! Let’s go check it out!",
      "..",
      "Look at the board! There’s some important information on it!",
      'I will call Manny to come join us while we check out the info board!',
      "Let’s explore more and see what else we can find!"
  ];
  
  let dialogueIndex = 0;

  function showNextDialogue() {
      if (dialogueIndex < dialogues.length) {
          dialogueBox.innerHTML = dialogues[dialogueIndex]; // Set dialogue text
          dialogueBox.style.display = 'block'; // Show dialogue box
          dialogueIndex++;
          setTimeout(showNextDialogue, 3000); // Show each dialogue for 3 seconds
      } else {
          dialogueBox.style.display = 'none'; // Hide dialogue box when done
      }
  }

  // Start showing dialogues
  setTimeout(showNextDialogue, 100);
}

function showAstronautDialogues3() {
  const dialogues = [
      "Oh, hey Manny, what's up?", // Astronaut greets Manny
      "Beep bop beep!", // Manny responds
      "I’ll upload all the information from the board to Manny.", // Astronaut explaining
      "Beep bop bop!", // Manny acknowledges
      "Now, let’s go pick up all the trash with Manny and come back!", // Astronaut motivates for cleanup
  ];
  
  let dialogueIndex = 0;

  function showNextDialogue() {
      if (dialogueIndex < dialogues.length) {
          dialogueBox.innerHTML = dialogues[dialogueIndex]; // Set dialogue text
          dialogueBox.style.display = 'block'; // Show dialogue box
          dialogueIndex++;
          setTimeout(showNextDialogue, 3000); // Show each dialogue for 3 seconds
      } else {
          dialogueBox.style.display = 'none'; // Hide dialogue box when done
      }
  }

  setTimeout(showNextDialogue, 500);
}

function showAstronautDialogues4() {
  const dialogues = [
      "Good job, Manny, on collecting all the trash!", // Astronaut praises Manny
      "Beep bop beep! ",
      "Now let’s sort out the trash into the right bins.",
      "We’re almost done! Sorting the trash will help keep this place clean and win us points!", // Astronaut motivates the kids
      "Let’s do this together and make this planet shine again!" // Final cheer-up message
  ];
  
  let dialogueIndex = 0;

  function showNextDialogue() {
      if (dialogueIndex < dialogues.length) {
          dialogueBox.innerHTML = dialogues[dialogueIndex]; // Set dialogue text
          dialogueBox.style.display = 'block'; // Show dialogue box
          dialogueIndex++;
          setTimeout(showNextDialogue, 3500); // Add a slight delay between dialogues (3.5 seconds)
      } else {
          setTimeout(() => {
              dialogueBox.style.display = 'none'; // Hide dialogue box when done
          }, 1000); // Slight delay before hiding the box at the end
      }
  }

  // Start showing dialogues with a slight initial delay
  setTimeout(showNextDialogue, 2000); // Delay the start of the first dialogue by 0.5 seconds
}



// Initial astronaut position
let astronautX = -170;
let astronautY = -30;
const astronautSpeed = 10; // Speed of movement (in pixels)

// Function to start the game
function startGame() {
  // Hide the start screen
  startScreen.style.display = 'none';

  // Show the hover-area with the game canvas
  hoverArea.style.display = 'block';

  startBackgroundMusic();

  // Draw the stone image at the bottom left corner of the canvas
  stoneImage.onload = function () {
    ctx.drawImage(stoneImage, 20, canvas.height - stoneImage.height - 20);
  };

  // Start the animation for the rocket
  const movingObject = document.querySelector('.moving-object');
  movingObject.classList.add('animate-rocket');

  // Handle the end of the rocket animation
  movingObject.addEventListener('animationend', () => {
    // Show black overlay
    blackOverlay.style.display = 'block';
    blackOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    playExplosionSound();
    setTimeout(() => {
      // Hide the black overlay
      blackOverlay.style.display = 'none';

      // Replace the rocket image with the crashed rocket image
      movingObject.style.backgroundImage = `url('public/assets/crashedrocket.png')`;
      movingObject.style.transform = 'translate(0, 300px)';
      movingObject.style.zIndex = '4';
      showAstronautDialogues();

      // Show the smoke
      smoke.style.display = 'block';
      smoke.classList.add('animate-smoke');
      smoke.style.zIndex = '6';

      // Show the astronaut and make it movable
      const astronaut = document.getElementById('astronaut');
      astronaut.style.display = 'block';
      astronaut.style.opacity = '1';

      // Set the initial position of the astronaut
      astronaut.style.transform = `translate(${astronautX}px, ${astronautY}px)`;

      // Listen for keyboard inputs
      window.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'ArrowUp': // Move up
            astronautY -= astronautSpeed;
            break;
          case 'ArrowDown': // Move down
            astronautY += astronautSpeed;
            break;
          case 'ArrowLeft': // Move left
            astronautX -= astronautSpeed;
            break;
          case 'ArrowRight': // Move right
            astronautX += astronautSpeed;
            break;
        }

        // Update astronaut position
        astronaut.style.transform = `translate(${astronautX}px, ${astronautY}px)`;
        
        // Check if astronaut is within the bounds for showing the Prev button
        if (astronautX >= -500 && astronautX <= -400 && astronautY >= 0 && astronautY <= 100) {
          prevButton.style.display = 'block'; // Show the Prev button
        } else {
          prevButton.style = 'none';
        }
        // Check if astronaut is within the specified bounds
        if (astronautX >= 600 && astronautX <= 700 && astronautY >= 0 && astronautY <= 100) {
          nextButton.style.display = 'block'; // Show the Next button
        }
        else {
          nextButton.style.display = 'none';
        }
      });

      // Show trash items after 1.5 seconds
      setTimeout(() => {
        const trashItems = document.querySelectorAll('.trash-item');
        trashItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 300);
        });
      }, 1100);
    }, 1000);
  });
}
// Add event listener for the Next button
nextButton.addEventListener('click', () => {
  // Hide the Next button
  nextButton.style.display = 'none';
  smoke.style.display = 'none';
  const stone = document.getElementById('stone');
  stone.style.display = 'none';
  board.style.display = 'block';
  bins.style.display = 'block';

  // Show the black overlay
  blackOverlay.style.display = 'block';
  blackOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';

  setTimeout(() => {
    // Change the background to bg2
    canvas.style.backgroundImage = "url('public/assets/bg2.jpg')";
    hoverArea.style.backgroundSize = 'cover';

    // Reset astronaut position and make it visible
    const astronaut = document.getElementById('astronaut');
    astronautX = -430;
    astronautY = 10;
    astronaut.style.transform = `translate(${astronautX}px, ${astronautY}px)`;
    showAstronautDialogues2();

    // Add fade-in effect for the astronaut
    astronaut.style.opacity = '0';
    astronaut.style.transition = 'opacity 1s ease-in-out'; // Fade-in animation
    astronaut.style.display = 'block';

    setTimeout(() => {
      astronaut.style.opacity = '1'; // Make the astronaut fully visible after the fade-in
      astronaut.style.transition = 'transform 0.1s linear';
      const trashItems2 = document.querySelectorAll('.trash-item-2');
      trashItems2.forEach((item, index) => {
        setTimeout(() => {
          item.style.display = 'block'; // Ensure it's visible
          item.style.opacity = '1'; // Fade in
          item.style.transition = 'opacity 0.5s ease-in-out';
        }, index * 300); // Staggered appearance
      });
    }, 50);

    
    // Hide other items
    const trashItems = document.querySelectorAll('.trash-item');
    trashItems.forEach((item) => {
      item.style.display = 'none';
    });

    const movingObject = document.querySelector('.moving-object');
    movingObject.style.display = 'none';

    // Hide the black overlay after the transition
    blackOverlay.style.display = 'none';
  }, 1000);
});

// Add event listener to the start button
startButton.addEventListener('click', startGame);

// Add event listener for the Prev button
prevButton.addEventListener('click', () => {
  // Hide the Prev button
  prevButton.style.display = 'none';

  // Show the black overlay
  blackOverlay.style.display = 'block';
  blackOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';

  setTimeout(() => {
    // Change the background to the first scene
    canvas.style.backgroundImage = "url('public/assets/bg.jpg')";
    hoverArea.style.backgroundSize = 'cover';

    // Reset astronaut position to the initial state
    astronautX = 650;
    astronautY = 50;
    const astronaut = document.getElementById('astronaut');

    // Fade-out the astronaut before moving (optional)
    astronaut.style.display = 'none';

    setTimeout(() => {
      astronaut.style.transform = `translate(${astronautX}px, ${astronautY}px)`;

      // Fade-in effect for the astronaut
      astronaut.style.display = 'block';
      astronaut.style.transition = 'opacity 1s ease-in-out, transform 0.1s linear'; // Fade-in animation
    }, 300);

    // Show first scene trash items
    const trashItems = document.querySelectorAll('.trash-item');
    trashItems.forEach((item) => {
      item.style.display = 'block';
      item.style.opacity = '1';
      item.style.transition = 'opacity 0.5s ease-in-out';
    });

    bins.style.display = 'none';

    // Hide second scene trash items
    const trashItems2 = document.querySelectorAll('.trash-item-2');
    trashItems2.forEach((item) => {
      item.style.display = 'none';
    });

    // Reset other scene elements
    const movingObject = document.querySelector('.moving-object');
    movingObject.style.display = 'block'; // Ensure it is visible
    movingObject.classList.remove('animate-rocket'); // Prevent animation

    const stone = document.getElementById('stone');
    stone.style.display = 'block'; // Ensure the stone is visible

    smoke.style.display = 'block'; // Show smoke
    board.style.display = 'none'; // Hide the board in the first scene

    // Hide the black overlay after transition
    blackOverlay.style.display = 'none';
    handleBackNavigation();
  }, 1000);
});

// Image array for modal navigation
const images = ['public/assets/bins.jpg','public/assets/info.jpg'];
let currentImageIndex = 0;

// Update modal image function
function updateModalImage() {
    modalImage.src = images[currentImageIndex];
}

// Show modal when board is clicked
board.addEventListener('click', () => {
    modal.style.display = 'flex'; // Show the modal
    currentImageIndex = 0; // Start with the first image
    updateModalImage();
});

// Navigate to previous image
prevImage.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; // Loop back to last image
    updateModalImage();
});

// Navigate to next image
nextImage.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length; // Loop back to first image
    updateModalImage();
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
    rover.style.display = 'block';
    scoreDisplay.style.display = 'block';
    showAstronautDialogues3();
    updateModalImage();
});

const trashItems = document.querySelectorAll('#brokenCan, #cardboardBox, #plasticBottle, #glassBottle, #foodWrapper, #plasticBag, #oldShoe, #crumpledPaper, #rustyCan, #bananaPeel, #brokenEgg, #organicWaste, #oldCup, #milkCarton, #pizzaBox');

// State to track collected items
let trashState = {
  brokenCan: false,
  cardboardBox: false,
  plasticBottle: false,
  glassBottle: false,
  foodWrapper: false,
  plasticBag: false,
  oldShoe: false,
  crumpledPaper: false,
  rustyCan: false,
  bananaPeel: false,
  brokenEgg: false,
  organicWaste: false,
  oldCup: false,
  milkCarton: false,
  pizzaBox: false,
};

// Score tracking
let score = 0; // Initial score

// Function to update the score display
function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Initial rover position and movement speed
let roverX = 55; // Initial position matching the left CSS property of rover
let roverY = -35; // Initial position matching the top CSS property of rover
const roverSpeed = 12; // Speed of movement in pixels

// Function to update rover position
function updateRoverPosition() {
  rover.style.transition = 'opacity 1s ease-in-out, transform 0.1s linear';
  rover.style.transform = `translate(${roverX}px, ${roverY}px)`;
  checkCollisions(); // Check for collisions with trash items
  updateButtonVisibility(); // Update the visibility of next1 and prev1 buttons
}

// Function to check collisions between the rover and trash items
function checkCollisions() {
  // Get the bounding box of the rover
  const roverRect = rover.getBoundingClientRect();

  // Iterate through each trash item to check for collisions
  trashItems.forEach((item) => {
    const itemId = item.id; // Get the item ID
    if (!trashState[itemId]) { // Only check if the item is not already collected
      const itemRect = item.getBoundingClientRect();

      // Check if rover intersects with the item
      if (
        roverRect.x < itemRect.x + itemRect.width &&
        roverRect.x + roverRect.width > itemRect.x &&
        roverRect.y < itemRect.y + itemRect.height &&
        roverRect.y + roverRect.height > itemRect.y
      ) {
        // If a collision is detected, hide the item and update the state
        item.style.display = 'none';
        trashState[itemId] = true; // Mark item as collected

        // Increment the score and update the display
        score += 10; // Increment score by 10 for each collected item
        updateScoreDisplay();
      }
    }
  });
}

// Function to update the visibility of next1 and prev1 buttons based on rover's position
function updateButtonVisibility() {
  // Show Next1 button if the rover is within the specified coordinates for "Next"
  if (roverX >= 300 && roverX <= 500 && roverY >= -100 && roverY <= 100) {
    next1.style.display = 'block';
  } else {
    next1.style.display = 'none';
  }

  // Show Prev1 button if the rover is within the specified coordinates for "Prev"
  if (roverX >= -800 && roverX <= -400 && roverY >= -100 && roverY <= 100) {
    prev1.style.display = 'block';
  } else {
    prev1.style.display = 'none';
  }
}

// Restore item visibility based on state
function restoreTrashItems() {
  trashItems.forEach((item) => {
    const itemId = item.id;
    if (trashState[itemId]) {
      item.style.display = 'none'; // Hide if already collected
    } else {
      item.style.display = 'block'; // Show if not collected
    }
  });
}

// Rover movement with keyboard input
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w': roverY -= roverSpeed; break; // Move up
    case 's': roverY += roverSpeed; break; // Move down
    case 'a': roverX -= roverSpeed; break; // Move left
    case 'd': roverX += roverSpeed; break; // Move right
  }

  // Update the rover's position and check for collisions
  updateRoverPosition();
});

// Function to handle navigating back to a previous area
function handleBackNavigation() {
  restoreTrashItems(); // Restore item visibility based on the state when returning to a previous area
  updateScoreDisplay(); // Ensure the score is correctly displayed when navigating back
}

// Add event listener for the Next button
next1.addEventListener('click', () => {
  // Hide the Next button
  next1.style.display = 'none';
  smoke.style.display = 'none';
  const stone = document.getElementById('stone');
  stone.style.display = 'none';
  board.style.display = 'block';
  bins.style.display = 'block';

  // Show the black overlay
  blackOverlay.style.display = 'block';
  blackOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';

  setTimeout(() => {
    // Change the background to bg2
    canvas.style.backgroundImage = "url('public/assets/bg2.jpg')";
    hoverArea.style.backgroundSize = 'cover';

    // Set the rover position
    roverX = -680;
    roverY = 10;
    updateRoverPosition();

    // Set the score as if all items were collected
    score = Object.keys(trashState).length * 10;
    updateScoreDisplay();

    // Fade-in effect for the rover
    rover.style.opacity = '0';
    rover.style.transition = 'opacity 1s ease-in-out'; // Fade-in animation
    rover.style.display = 'block';
    astronaut.style.transform = `translate(${astronautX}px, ${astronautY}px)`;
    astronaut.style.display = 'block';

    setTimeout(() => {
      rover.style.opacity = '1'; // Make the rover fully visible
      rover.style.transition = 'transform 0.1s linear';
      astronaut.style.opacity = '1'; // Make the astronaut fully visible after the fade-in
      astronaut.style.transition = 'transform 0.1s linear';

      const trashItems2 = document.querySelectorAll('.trash-item-2');
      trashItems2.forEach((item) => {
        item.style.display = 'none'; // Hide all trash items immediately
      });
    }, 50);

    showAstronautDialogues4();
    // Hide other items
    const trashItems = document.querySelectorAll('.trash-item');
    trashItems.forEach((item) => {
      item.style.display = 'none';
    });

    const movingObject = document.querySelector('.moving-object');
    movingObject.style.display = 'none';

    // Hide the black overlay after the transition
    blackOverlay.style.display = 'none';

    // Function to reset score
    function resetScore() {
      scoreDisplay.innerText = `Score: 0`; // Reset score to 0
      scoreDisplay.style.zIndex = '101';
    }

    // Function to get the current score
    function getCurrentScore() {
      return parseInt(scoreDisplay.innerText.replace('Score: ', '')) || 0;
    }

    // Allow dropping on bins
    function allowDrop(event) {
      event.preventDefault(); // Enable dropping
    }

    // Handle drag start for Trash Items
    Object.values(trashItems3).forEach((trashItem) => {
      trashItem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id); // Set the item's ID for dragging
      });
    });

    // State to track if items are correctly sorted
    let sortedItemsCount = 0;
    const totalTrashItems = Object.keys(trashItems3).length;

    // Function to show congratulatory message when all items are sorted
    function showCongratulatoryMessage() {
      const congratsMessage = document.getElementById('congratsMessage');
      const finalScore = document.getElementById('finalScore');
      finalScore.innerText = getCurrentScore(); // Set the final score in the message
      congratsMessage.style.display = 'block'; // Show the congratulations message
    }

    // Handle drop for Trash Items
    function drop(event) {
      event.preventDefault(); // Prevent default behavior
      const trashId = event.dataTransfer.getData('text'); // Get the item's ID
      const trashElement = document.getElementById(trashId); // Get the dragged element

      // Check if the dropped item is in the correct bin
      const binId = event.target.id;
      const correctBins = {
        brokenCan1: 'blackBin',         // Matches garbage
        cardboardBox1: 'blueBin',       // Matches recycle
        plasticBottle1: 'blueBin',      // Matches recycle
        glassBottle1: 'blueBin',        // Matches recycle
        foodWrapper1: 'blackBin',       // Matches garbage
        plasticBag1: 'blackBin',        // Matches garbage
        oldShoe1: 'blackBin',           // Matches garbage
        crumpledPaper1: 'blueBin',      // Matches recycle
        rustyCan1: 'blackBin',          // Matches garbage
        bananaPeel1: 'greenBin',        // Matches organic
        brokenEgg1: 'greenBin',         // Matches organic
        organicWaste1: 'greenBin',      // Matches organic
        oldCup1: 'blackBin',            // Matches garbage
        milkCarton1: 'blueBin',         // Matches recycle
        pizzaBox1: 'blueBin'            // Matches recycle
      };

      let currentScore = getCurrentScore(); // Get the current score from scoreDisplay

      if (correctBins[trashId] === binId) {
        // If correct, append the trash item to the bin and increase the score
        event.target.appendChild(trashElement);
        setTimeout(() => {
          trashElement.style.display = 'none'; // Hide the trash item after a small delay to ensure drop event completes
        }, 0);
        currentScore += 10; // Increase score for a correct item
        sortedItemsCount++; // Increment sorted items count

        // Check if all items have been sorted correctly
        if (sortedItemsCount === totalTrashItems) {
          setTimeout(() => {
            scoreDisplay.innerText = `Score: ${currentScore}`; // Update score before showing congratulations
            showCongratulatoryMessage(); // Show congratulations message
          }, 500); // Show the message with a delay
        }
      } else {
        currentScore -= 5; // Decrease the score slightly for incorrect drop
      }

      // Update the scoreboard
      scoreDisplay.innerText = `Score: ${currentScore}`;
    }

    // Add event listeners to bins for dropping
    [greenBin, blackBin, blueBin].forEach((bin) => {
      bin.ondrop = drop;
      bin.ondragover = allowDrop;
    });

    // Show the game window when clicking on the element with ID '3bins'
    document.getElementById('3bins').addEventListener('click', () => {
      const gameWindow = document.getElementById('gameWindow');
      if (gameWindow.style.display !== 'flex') {
        gameWindow.style.display = 'flex'; // Show the game window
        resetScore(); // Reset score when the game starts
        sortedItemsCount = 0; // Reset sorted items count
      }
    });

    // Close the game window
    document.getElementById('closeGame').addEventListener('click', () => {
      document.getElementById('gameWindow').style.display = 'none'; // Hide the game window
    });

    // Show congratulatory message HTML
    document.body.insertAdjacentHTML('beforeend', `
  <div id="congratsMessage" class="congrats-container" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.7); color: white; padding: 20px; border-radius: 10px; text-align: center;">
    <h2>Congratulations! You finished Level 1!</h2>
    <p>Final Score: <span id="finalScore"></span></p>
    <button onclick="document.getElementById('congratsMessage').style.display='none';">Close</button>
  </div>
`);

  }, 1000);
});

// Add event listener for the Prev button
prev1.addEventListener('click', () => {
  // Hide the Prev button
  prev1.style.display = 'none';

  // Show the black overlay
  blackOverlay.style.display = 'block';
  blackOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';

  setTimeout(() => {
    // Change the background to the first scene
    canvas.style.backgroundImage = "url('public/assets/bg.jpg')";
    hoverArea.style.backgroundSize = 'cover';

    // Set the rover position
    roverX = 450;
    roverY = 10;
    updateRoverPosition();

    // Fade-in effect for the rover
    rover.style.display = 'none';
    astronaut.style.display = 'none';

    setTimeout(() => {
      updateRoverPosition();

      // Fade-in effect for the astronaut
      rover.style.display = 'block';
      rover.style.transition = 'opacity 1s ease-in-out, transform 0.1s linear'; // Fade-in animation
    }, 300);

    // Show first scene trash items
    const trashItems = document.querySelectorAll('.trash-item');
    trashItems.forEach((item) => {
      item.style.display = 'block';
      item.style.opacity = '1';
      item.style.transition = 'opacity 0.5s ease-in-out';
    });

    bins.style.display = 'none';

    // Hide second scene trash items
    const trashItems2 = document.querySelectorAll('.trash-item-2');
    trashItems2.forEach((item) => {
      item.style.display = 'none';
    });

    // Reset other scene elements
    const movingObject = document.querySelector('.moving-object');
    movingObject.style.display = 'block';
    movingObject.classList.remove('animate-rocket');

    const stone = document.getElementById('stone');
    stone.style.display = 'block';

    smoke.style.display = 'block';
    board.style.display = 'none';

    // Hide the black overlay after transition
    blackOverlay.style.display = 'none';
    handleBackNavigation(); 
  }, 1000);
});