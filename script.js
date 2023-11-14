const apiUrl = 'https://opentdb.com/api.php?amount=20&category=22&type=multiple';

let currentQuestion = 0;
let score = 0;
let quizData = [];

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const retryButton = document.getElementById('retry-button');
const nextButton = document.getElementById('next-button');

async function fetchQuizData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        quizData = data.results;
        loadQuestion();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        resultContainer.innerText = 'Failed to fetch quiz data. Please try again later.';
    }
}

function loadQuestion() {
    const currentQuizData = quizData[currentQuestion];
    questionElement.innerHTML = decodeEntities(currentQuizData.question);

    optionsContainer.innerHTML = "";
    const options = shuffleArray(currentQuizData.incorrect_answers.concat(currentQuizData.correct_answer));
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerHTML = decodeEntities(option);
        button.classList.add('option');
        optionsContainer.appendChild(button);
    });
}

function handleOptionClick(event) {
    const clickedButton = event.target;
    if (clickedButton.classList.contains('option')) {
        checkAnswer(clickedButton.innerHTML);
    }
}

optionsContainer.addEventListener('click', handleOptionClick);


function checkAnswer(answer) {
    const currentQuizData = quizData[currentQuestion];
    if (answer === currentQuizData.correct_answer) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
    resultContainer.style.color = score === quizData.length ? '#2ecc71' : '#e74c3c';
    optionsContainer.innerHTML = ""; // Clear options container
    nextButton.style.display = 'none'; // Hide next button
    retryButton.style.display = 'block'; // Show retry button
}

function retryQuiz() {
    currentQuestion = 0;
    score = 0;
    optionsContainer.innerHTML = ""; // Clear existing buttons
    fetchQuizData();
    resultContainer.innerText = ""; // Clear result
    retryButton.style.display = 'none'; // Hide retry button
    nextButton.style.display = 'block'; // Show next button
}



function attachOptionButtonListeners() {
    const optionButtons = document.querySelectorAll('.option');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => checkAnswer(button.innerHTML));
    });
}

// Call this function after creating buttons in loadQuestion
attachOptionButtonListeners();


// Function to shuffle an array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Function to decode HTML entities
function decodeEntities(encodedString) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedString;
    return textarea.value;
}

function reloadPage() {
    location.reload();
}


// Fetch quiz data when the page loads
fetchQuizData();
