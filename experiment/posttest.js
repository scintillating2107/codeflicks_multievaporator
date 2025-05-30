/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////

(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        //answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
 

/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////






/////////////// Write the MCQ below in the exactly same described format ///////////////

const myQuestions = [
  {
    question: "What is the primary purpose of using multiple effects in an evaporator system?",
    answers: {
      a: "To reduce the boiling point of water",
      b: "To increase the pressure in each effect",
      c: "To improve energy efficiency by reusing steam",
      d: "To increase the feed flow rate"
    },
    correctAnswer: "c"
  },
  {
    question: "Steam economy is defined as:",
    answers: {
      a: "The amount of steam required per unit of product",
      b: "The amount of vapor produced per unit of steam consumed",
      c: "The rate of heat transfer in each effect",
      d: "The cost savings in a steam plant"
    },
    correctAnswer: "b"
  },
  {
    question: "In a forward-feed MEE, the feed and steam flow:",
    answers: {
      a: "In opposite directions",
      b: "In the same direction",
      c: "Are both constant and parallel",
      d: "Are irrelevant to each other"
    },
    correctAnswer: "b"
  },
  {
    question: "What is the effect of increasing the number of effects in a multi-effect evaporator?",
    answers: {
      a: "Decreases steam economy",
      b: "Increases energy consumption",
      c: "Decreases vapor output",
      d: "Increases overall energy efficiency"
    },
    correctAnswer: "d"
  },
  {
    question: "Which of the following parameters is essential for calculating the overall heat transfer coefficient in MEE?",
    answers: {
      a: "Only pressure",
      b: "Feed viscosity",
      c: "Temperature difference and heat transfer area",
      d: "Color of the liquid"
    },
    correctAnswer: "c"
  }
];

  
/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////


  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener("click", showResults);
})();


/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////
