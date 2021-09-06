//Section list
var quizSections = document.querySelectorAll(".quiz-section");

// Time
var timerEl = document.getElementById("countdown");

// Start
//const START_SECTION = document.getElementById("start");
var startButton = document.getElementById("btn1");

// Quiz Questions
var quizSection = document.getElementById("quiz-questions");
var questionQ = document.getElementById("question");
var choices = document.getElementById("choices");
var choiceMessage = document.getElementById("imessage");
var choiceStatuses = document.querySelectorAll(".choice-status");
var correct = document.getElementById("correct");
var wrong = document.getElementById("wrong"); 
var timeRemaining = document.getElementById("time-remaining");

// End
var endSection = document.getElementById("end");
var endTitle = document.getElementById("end-title");
var score = document.getElementById("score");
var initialsInput = document.getElementById("initials");
var submitScore = document.getElementById("submit-score");
var errorMessages = document.getElementById("error-message");


//Questions
class Question {
	constructor(question, choices, indexOfCorrectChoice) {
	  this.question = question;
	  this.choices = choices;
	  this.indexOfCorrectChoice = indexOfCorrectChoice;
	}
}

var question1 = new Question("Commonly used data types DO NOT include: ", 
  ["Strings", "Booleans", "Alerts", "Numbers"], 2);
var question2 = new Question("The condition in an if / else statement is enclosed within ____.", 
  ["Quotes", "Curly brackets", "Parentheses", "Square brackets"], 2);
var question3 = new Question("Arrays in JavaScript can be used to store ____.", 
  ["Numbers and Strings", "Other arrays", "Booleans", "All of the above"], 3);
var question4 = new Question("String values must be enclosed within _____ when being assigned to variables.", 
  ["Commas", "Curly brackets", "Quotes", "Parentheses"], 2);
var question5 = new Question("A very useful tool used during development and debugging for printing content to the debugger is: ", 
  ["JavaScript", "Terminal/Bash", "For Loops", "console.log"], 3);
var questionList = [question1, question2, question3, question4, question5];

let currentQuestion = 0;
var timeLeft = 70;
let timeInterval;
let choiceStatusTimeout;

startButton.addEventListener("click", startGame);
choices.addEventListener("click", pickChoices);
submitScore.addEventListener("submit", processInput);


function startGame(){
	showElement(quizSections, quizSection);

	displayQuestion();

	startTimer();
}

function showElement(siblingList, showElement) {
	for (element of siblingList) {
	  hideElement(element);
	}
	showElement.classList.remove("hidden");
  } 
  
  function hideElement(element) {
	if (!element.classList.contains("hidden")) {
	  element.classList.add("hidden");
	}
  }



function startTimer(){
	timeInterval = setInterval(() => {
		if(timeLeft > 1 ){
			timerEl.textContent = timeLeft + ' seconds remaining';
			timeLeft--;
		}else if(timeLeft === 1){
			timerEl.textContent = timeLeft + ' second remaining';
			timeLeft--;
		}else {
			timerEl.textContent = '';
		}
	}, 1000);

}


function displayQuestion(){
	questionQ.textContent = questionList[currentQuestion].question;

	displayChoiceList();
}

function displayChoiceList(){
	choices.innerHTML = "";

	questionList[currentQuestion].choices.forEach((answer, index) => {
		var li = document.createElement("li");
		li.dataset.index = index;
		var button = document.createElement("button");
		button.textContent = (index + 1) + ". " + answer;
		li.appendChild(button);
		choices.appendChild(li);
	});
}

//When user answers a question
function pickChoices(event){
	var userChoice = parseInt(event.target.parentElement.dataset.index);
	console.log(userChoice);

	checkChoice(userChoice);
	getNextQuestion();
}

// Display choice status
function checkChoice(userChoice){
	if(isChoiceCorrect(userChoice)){
		displayCorrectChoiceEffects();
	}else{
		displayWrongChoiceEffects();
	}
}

function isChoiceCorrect(choice){
	return choice === questionList[currentQuestion].indexOfCorrectChoice;
}

function displayCorrectChoiceEffects(){
	choiceMessage.innerHTML = "Correct Answer";
	showElement(choiceStatuses, correct);
}

function displayWrongChoiceEffects(){
	choiceMessage.innerHTML = "Wrong Answer";
	deductTimeBy(10);
	showElement(choiceStatuses, wrong);
}

function deductTimeBy(seconds){
	timeLeft -= seconds;
}

// Generate next question
function getNextQuestion(){
	currentQuestion++;
	if (currentQuestion >= questionList.length){
		endGame();
	}else{
		displayQuestion();
	}
}

// End Game
function endGame(){
	clearInterval(timeInterval);

	showElement(quizSections, endSection);
	displayScore();
	setEndHeading();
}

function displayScore(){
	score.textContent = timeLeft;
}

function setEndHeading(){
	if (timeLeft === 0){
		endTitle.textContent = "Sorry! time is out!";
	}else{
		endTitle.textContent = "Congrats! You completed the quiz!";
	}	
}

// Submitting Initials
function processInput(event){
	event.preventDefault();

	var initials = initialsInput.value.toLocaleUpperCase();

	if (isInputValid(initials)) {
		var score = timeLeft;
		var highscoreEntry = getNewHighscoreEntry(initials, score);
		saveHighscoreEntry(highscoreEntry);
		window.location.href = "./highscores.html";
	}
}

function getNewHighscoreEntry(initials, score){
	var entry = {
		initials: initials,
		score: score,
	}
	console.log(entry);
	return entry;
}

function isInputValid(initials){
	let errorMessage = "";
	if (initials === ""){
		errorMessage = "You can't submit empty initials";
		displayFormError(errorMessage);
		return false;
	}else if (initials.match(/[^a-z]/ig)){
		errorMessage = "Initials may only include letters";
		displayFormError(errorMessage);
		return false;		
	}else {
		return true;	
	}
}

function displayFormError(errorMessage) {
	errorMessages.textContent = errorMessage;
	if (!initialsInput.classList.contains("error")) {
	  initialsInput.classList.add("error");
	}
}

function saveHighscoreEntry(highscoreEntry) {
	const currentScores = getScoreList();
	placeEntryInHighscoreList(highscoreEntry, currentScores);
	localStorage.setItem('scoreList', JSON.stringify(currentScores));
}

function getScoreList() {
	const currentScores = localStorage.getItem('scoreList');
	if (currentScores) {
	  return JSON.parse(currentScores);
	} else {
	  return [];
	}
}

function placeEntryInHighscoreList(newEntry, scoreList) {
	const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
	scoreList.splice(newScoreIndex, 0, newEntry);
}

function getNewScoreIndex(newEntry, scoreList) {
	if (scoreList.length > 0) {
	  for (let i = 0; i < scoreList.length; i++) {
		if (scoreList[i].score <= newEntry.score) {
		  return i;
		}
	  } 
	}
	return scoreList.length;
}

	
	







