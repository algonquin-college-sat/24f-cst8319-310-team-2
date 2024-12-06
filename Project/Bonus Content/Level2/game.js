const quizData = [
    {
        question: "What should you do with old newspapers?",
        options: ["Burn them", "Recycle them", "Throw them in the trash", "Keep them forever"],
        answer: "Recycle them"
    },
    {
        question: "Can you recycle juice boxes?",
        options: ["Yes, if they’re empty", "No, they can’t be recycled", "Only the straw", "Only if they are clean"],
        answer: "Yes, if they’re empty"
    },
    {
        question: "Which of these is a good way to save water?",
        options: ["Leave the tap running while brushing teeth", "Fix leaks right away", "Fill the bathtub", "Water the plants during the day"],
        answer: "Fix leaks right away"
    },
    {
        question: "What should you do with a broken pencil?",
        options: ["Throw it in the trash", "Recycle it", "Use it as a toy", "Keep it as is"],
        answer: "Throw it in the trash"
    },
    {
        question: "What should you do with an old sneaker?",
        options: ["Throw it in the trash", "Donate it", "Burn it", "Recycle it"],
        answer: "Donate it"
    },
    {
        question: "Can you recycle a paper plate with food on it?",
        options: ["Yes, if it's clean", "No", "Only if the food is dry", "Yes, always"],
        answer: "No"
    },
    {
        question: "Which of these can go into the compost bin?",
        options: ["Empty soda can", "Banana peel", "Plastic fork", "Styrofoam cup"],
        answer: "Banana peel"
    },
    {
        question: "Which of these items is made from recycled materials?",
        options: ["Plastic bottles", "A brand-new toy", "Styrofoam", "Newspapers"],
        answer: "Plastic bottles"
    },
    {
        question: "What should you do with leftover food?",
        options: ["Throw it in the trash", "Save it for later", "Throw it in the compost", "Give it to someone else"],
        answer: "Throw it in the compost"
    },
    {
        question: "Which of these is a reusable item?",
        options: ["Plastic fork", "Metal spoon", "Paper towel", "Aluminum foil"],
        answer: "Metal spoon"
    },
    {
        question: "Which of these can you recycle?",
        options: ["A plastic bag", "A glass bottle", "A broken glass", "A dirty napkin"],
        answer: "A glass bottle"
    },
    {
        question: "What should you do with plastic bottles?",
        options: ["Recycle them", "Throw them in the trash", "Leave them outside", "Use them as decoration"],
        answer: "Recycle them"
    },
    {
        question: "What is the best way to reduce waste?",
        options: ["Throw away everything", "Reuse items as much as possible", "Buy more things", "Burn everything"],
        answer: "Reuse items as much as possible"
    },
    {
        question: "Which of these is harmful to the environment?",
        options: ["Using paper bags", "Recycling", "Plastic bottles", "Using a bike"],
        answer: "Plastic bottles"
    },
    {
        question: "Where should you put empty cardboard boxes?",
        options: ["In the trash", "In the recycling bin", "In the compost bin", "In the garden"],
        answer: "In the recycling bin"
    },
    {
        question: "What should you do with broken electronics?",
        options: ["Throw them in the trash", "Recycle them", "Fix them", "Give them away"],
        answer: "Recycle them"
    }
];

const backgroundMusic = new Audio('../public/assets/aud2.mp3'); // Load background music
backgroundMusic.loop = true; // Loop the background music
backgroundMusic.volume = 0.5;

function startBackgroundMusic() {
  backgroundMusic.play().catch(function (error) {
    console.log('Error playing background music: ', error);
  });
}

let currentQuestion = 0;
let score = 0;

// DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const tryAgainBtn = document.getElementById("try-again-btn");
const returnToMenuBtn = document.getElementById("return-to-menu-btn");

startBackgroundMusic();

function returnToMenu() {
    // This should redirect to a phaser scene
    // game.scene.start("NameInputScene");
    window.location.href = "../../game.html?scene=NameInputScene"
}

// Display the current question
function loadQuestion() {
    const currentData = quizData[currentQuestion];
    questionEl.textContent = currentData.question;
    optionsEl.innerHTML = '';

    currentData.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsEl.appendChild(button);
    });
}


// Check answer
function checkAnswer(selected) {
    const correctAnswer = quizData[currentQuestion].answer;

    if (selected === correctAnswer) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
        currentQuestion++;

        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showCongrats();
        }
    } else {
        showWrongMessage();
    }
}


function showWrongMessage() {
    const wrongMessage = document.getElementById("wrong");

    // Show the wrong message
    wrongMessage.style.display = "block";

    // Add fade-out class after 0.2s
    setTimeout(() => {
        wrongMessage.classList.add("fade-out");
    }, 1000);

    // Hide the message completely after animation ends (0.2s)
    setTimeout(() => {
        wrongMessage.style.display = "none";
        wrongMessage.classList.remove("fade-out");
    }, 1000); // Message will fade out in 0.2 seconds, hide after that
}


// Show congratulatory message and try again button
function showCongrats() {
    questionEl.textContent = "Congratulations! You've finished the quiz!";
    optionsEl.innerHTML = "";
    scoreEl.textContent = `Your final score is: ${score}`;

    tryAgainBtn.style.display = "inline-block"; // Show the try again button
    returnToMenuBtn.style.display = "inline-block";
}

// Handle the Try Again button click
function tryAgain() {
    score = 0;
    currentQuestion = 0;
    scoreEl.textContent = `Score: ${score}`;
    tryAgainBtn.style.display = "none"; // Hide the try again button
    returnToMenuBtn.style.display = "none";
    loadQuestion();
}

// Start the game
loadQuestion();

// Add event listener for the try again button
tryAgainBtn.addEventListener("click", tryAgain);
returnToMenuBtn.addEventListener("click", returnToMenu);
