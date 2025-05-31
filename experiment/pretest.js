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
    question: "What is the main function of an evaporator in a chemical process?",
    answers: {
      a: "Mixing different chemicals",
      b: "Separating solid impurities from a liquid",
      c: "Concentrating a solution by removing solvent as vapor",
      d: "Cooling a hot fluid stream"
    },
    correctAnswer: "c"
  },
  {
    question: "Which of the following components is typically used to supply heat in an evaporator?",
    answers: {
      a: "Cold water",
      b: "Saturated steam",
      c: "Compressed air",
      d: "Refrigerant gas"
    },
    correctAnswer: "b"
  },
  {
    question: "Why is vacuum often applied in evaporators used for heat-sensitive materials?",
    answers: {
      a: "To increase pressure and speed up boiling",
      b: "To raise the temperature of the feed",
      c: "To lower the boiling point and avoid thermal degradation",
      d: "To condense the vapor more quickly"
    },
    correctAnswer: "c"
  },
  {
    question: "In which industry is the use of multi-effect evaporators most common?",
    answers: {
      a: "Textile industry",
      b: "Food and dairy industry",
      c: "Construction industry",
      d: "Power generation industry"
    },
    correctAnswer: "b"
  },
  {
    question: "Which of the following is NOT a benefit of using a multi-effect evaporator?",
    answers: {
      a: "Reduced steam consumption",
      b: "Higher energy efficiency",
      c: "Increase in product impurities",
      d: "Cost savings on energy usage"
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
