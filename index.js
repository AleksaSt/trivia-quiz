const mainDiv = document.querySelector(".main");
const counterDiv = document.querySelector(".counter");
const button = document.getElementById("button");
const buttonTwo = document.getElementById("button-two");

const correctCounterSpan = document.getElementById("correct-counter");
const incorrectCounterSpan = document.getElementById("incorrect-counter");
const totalSpan = document.getElementById("total");

let correctCounter = 0;
let incorrectCounter = 0;

function fetchData() {
  const selectEl = document.querySelector(".select-topic");
  const selectOption = selectEl.value;
  let topic = "";

  switch (selectOption) {
    case "1":
      topic = "geography";
      break;
    case "2":
      topic = "history";
      break;
    case "3":
      topic = "film_and_tv";
      break;
    case "4":
      topic = "music";
      break;
    case "5":
      topic = "science";
      break;
    case "6":
      topic = "general_knowledge";
      break;
    default:
      console.log("Please choose a topic :)");
  }
  const difficulty = selectDifficulty();
  const numberOfQuestions = selectNumberOfQuestions();
  const api = `https://the-trivia-api.com/api/questions?categories=${topic}&limit=${numberOfQuestions}&difficulty=${difficulty}`;

  console.log(api);
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      quizData(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

button.addEventListener("click", () => {
  fetchData();
});

function selectDifficulty() {
  const selectDiff = document.querySelector(".select-difficulty");
  const selectOptionTwo = selectDiff.value;
  let difficulty = "";

  switch (selectOptionTwo) {
    case "11":
      difficulty = "easy";
      break;
    case "22":
      difficulty = "medium";
      break;
    case "33":
      difficulty = "hard";
      break;
    default:
      console.log("Please choose a difficulty :)");
  }
  return difficulty;
}

function selectNumberOfQuestions() {
  const selectNumber = document.querySelector(".select-number");
  const selectOptionThree = selectNumber.value;
  let number = "";

  switch (selectOptionThree) {
    case "1":
      number = "5";
      break;
    case "2":
      number = "10";
      break;
    case "3":
      number = "20";
      break;
    default:
      console.log("Please choose a difficulty :)");
  }
  return number;
}

function quizData(data) {
  if (typeof data !== "undefined") {
    mainDiv.innerHTML = "";
    data.forEach((el) => {
      const packedAnswers = packAnswers(el);

      const questionDiv = document.createElement("h6");
      questionDiv.innerHTML += el.question;
      questionDiv.classList.add("nav-header", "disabled");

      const answersWrapperDiv =
        createAnswerDivsAndAddClickEvents(packedAnswers);

      mainDiv.appendChild(questionDiv);
      mainDiv.appendChild(answersWrapperDiv);
    });
  }
}

function handleCorrectAnswer(event) {
  correctCounter++;
  correctCounterSpan.innerHTML = correctCounter;
  disableAnswers(event);
  document.getElementById(`${event.target.id}`).classList =
    "list-group-item list-group-item-success";
}

function disableAnswers(event) {
  let answerElement = event.target;
  let parent = answerElement.parentNode;

  Array.from(parent.children).forEach(function (child) {
    child.replaceWith(child.cloneNode(true));
  });

  let total = incorrectCounter + correctCounter;
  totalSpan.innerHTML = `Total Score: ${total}`;
}

function handleIncorrectAnswer(event) {
  incorrectCounter--;
  incorrectCounterSpan.innerHTML = incorrectCounter;
  disableAnswers(event);
  document.getElementById(`${event.target.id}`).classList =
    "list-group-item list-group-item-danger";
}

function packAnswers(questionData) {
  const packedAnswers = [];
  questionData.incorrectAnswers.forEach((incorrectAnswer) => {
    packedAnswers.push({ isCorrect: false, answer: incorrectAnswer });
  });
  packedAnswers.push({ isCorrect: true, answer: questionData.correctAnswer });

  shuffleArray(packedAnswers);
  return packedAnswers;
}

function createAnswerDivsAndAddClickEvents(packedAnswers) {
  const answersWrapperDiv = document.createElement("div");
  answersWrapperDiv.classList.add("list-group", "list-group-flush");

  packedAnswers.forEach((answerObject) => {
    const answerDiv = document.createElement("div");
    answerDiv.innerHTML += answerObject.answer;

    answerDiv.classList.add("list-group-item", "list-group-item-action");
    answerDiv.setAttribute("role", "button");

    answerDiv.id = Math.random().toString();

    if (answerObject.isCorrect) {
      answerDiv.addEventListener("click", handleCorrectAnswer);
    } else {
      answerDiv.addEventListener("click", handleIncorrectAnswer);
    }
    answersWrapperDiv.appendChild(answerDiv);
  });
  return answersWrapperDiv;
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
