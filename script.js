// Set variables for all relevant HTML elements
var gamePanel = document.getElementById("game-row")
var feedbackPanel = document.getElementById("feedback-row")
var highscorePanel = document.getElementById("highscores-row")
var startButton = document.getElementById('start-btn')
var nextButton = document.getElementById('next-btn')
var endButton = document.getElementById('end-btn')
var reloadButton = document.getElementById('reload-btn')
var questionContainerElement = document.getElementById('question-container')
var questionElement = document.getElementById('question')
var answerButtonsElement = document.getElementById('answer-buttons')
var incorrectFeedbackBox = document.getElementById('incorrect-feedback')
var correctFeedbackBox = document.getElementById('correct-feedback')
var highscoresListElement = document.getElementById('listHighscores')

// Set score, number of questions answered and the amount of time (in seconds)
var score = 0;
var questionsAnswered = 0;
var timeLeft = 60;

// Initialise the timer
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

		// Set the conditions for timeout
        if (--timer < 0) {
			endQuiz();
			return;
        } 
    }, 1000);
}

// Trigger the timer to start upon click the 'start' button
startButton.addEventListener('click', function () {
    display = document.querySelector('#time');
	startTimer(timeLeft, display);
}); 
  
// Set function to start the game by selecting the first question at random
function startGame() {
	startButton.classList.add('hide')
	document.querySelector('.timer').classList.remove('hide')
	shuffledQuestions = questions.sort(() => Math.random() - .5)
	currentQuestionIndex = 0
	questionContainerElement.classList.remove('hide')
	setNextQuestion()
  }

// Question shuffling functionality
let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
  // Hide feedback from previous question upon clicking next
  correctFeedbackBox.classList.add('hide')
  incorrectFeedbackBox.classList.add('hide');
})

// Set the question and answer text by pulling from the questions object 
function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    var button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn-dark')
    if (answer.correct) {
	  button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

// Reset styling and pick new question AFTER user submits previous question
function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}
function resetState() {
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

// Set feedback display and scoring upon selecting an answer
function selectAnswer(e) {
  var selectedButton = e.target
  var correct = selectedButton.dataset.correct

  if (correct) {
	correctFeedbackBox.classList.remove('hide');
	score++;
  } else {
	incorrectFeedbackBox.classList.remove('hide');
	timeLeft = timeLeft - 5;
  }
  questionsAnswered++;

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
	endQuiz();
  }
}

// Set quiz ending functionality (used once questions completed or timer runs out)
function endQuiz(e) {
	questionContainerElement.classList.add('hide')
	document.querySelector('.timer').classList.add('hide')
	nextButton.classList.add('hide')
	endButton.classList.remove('hide')
	localStorage.setItem('mostRecentScore', score)
};

// Set trigger for the highscore functionality on the end button
endButton.addEventListener("click", saveHighscore);

// Set the highscore to be stored in local storage and push the user to see the highscores page
function saveHighscore() {
	var mostRecentScore = localStorage.getItem('mostRecentScore')
	const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
	var username = prompt("What is your name? This will identify your score on the list.");
	var scoresSaved = {
		score: mostRecentScore,
		name: username
	}
	// Push the saved score and username to the highscores array and sort it to show only best 5 scores
	highscores.push(scoresSaved);
	highscores.sort((a, b) => b.score - a.score);
	highscores.splice(5);

	localStorage.setItem('highscores', JSON.stringify(highscores));

	// Populate the highscores list
	for (var i = 0; i < highscores.length; i++) {
		var item = document.createElement("li");
		item.textContent = "Name: " + highscores[i].name + " | Score: " + highscores[i].score;
		document.getElementById('listHighscores').appendChild(item)
	}
	showScore();
}

// Hide the game panel and show the highscores panel
function showScore() {
	gamePanel.classList.add('hide')
	feedbackPanel.classList.add('hide')
	highscorePanel.classList.remove('hide')
}

// The reload button's functionality is inserted into the HTML

// Set the array with objects that contain the questions
var questions = [
	{
	  question: 'Which of these is a tag?',
	  answers: [
		{ text: '<div>', correct: true },
		{ text: '<fraction>', correct: false },
		{ text: '<block>', correct: false }
	  ]
	},
	{
	  question: 'JQuery is __________',
	  answers: [
		{ text: 'Nicer than native JS', correct: true },
		{ text: 'Not nicer than native JS', correct: false }
	  ]
	},
	{
	  question: 'The largest heading on a page should be:',
	  answers: [
		{ text: '<p>', correct: false },
		{ text: '<h1>', correct: true },
		{ text: '<h2>', correct: false },
		{ text: '<h3>', correct: false }
	  ]
	},
	{
	  question: 'MongoDB is:',
	  answers: [
		{ text: 'A relational database', correct: false },
		{ text: 'A non-relational database', correct: true }
	  ]
	},
	{
	  question: 'What is the correct syntax for a class called "big"?',
	  answers: [
		{ text: 'class.is(big)', correct: false },
		{ text: 'class="big"', correct: true },
		{ text: 'big="class"', correct: false },
		{ text: 'class=big', correct: false }
	  ]
	}
  ]