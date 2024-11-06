// web-app/public/script.js

// Global variables
let clonedSvg;
const selectedAnswers = {};

let dbAnswers = {};

function fetchQuestions() {
    console.log('Attempting to fetch questions');
    fetch('questions.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(questions => {
        console.log('Questions fetched successfully', questions);
        setupQuestionnaire(questions);
      })
      .catch(error => console.error('Error loading questions:', error));
}


function setupQuestionnaire(questions) {
    const container = document.getElementById('questions-container');

    questions.forEach((q, index) => {
        const questionSection = document.createElement('div');
        questionSection.classList.add('question-section', 'hidden');
        questionSection.id = `question${index + 1}`;

        const questionText = document.createElement('p');
        questionText.classList.add('question');
        questionText.textContent = q.question;

        const answersDiv = document.createElement('div');
        answersDiv.classList.add('answers');

        if (q.answers.length === 0) {
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = `textInput${index + 1}`;
            textInput.placeholder = 'Your answer here...';
            answersDiv.appendChild(textInput);
        } else {
            q.answers.forEach(answerTuple => {
                const answerButton = document.createElement('button');
                answerButton.classList.add('answer-button');
                answerButton.textContent = answerTuple[0];
                answerButton.dataset.answer = answerTuple[0];
                answerButton.dataset.value = answerTuple[1];
                answerButton.dataset.color = answerTuple[2];
                answersDiv.appendChild(answerButton);
            });
        }

        const nextButton = document.createElement('button');
        nextButton.classList.add('next-button');
        nextButton.textContent = 'Next';

        questionSection.appendChild(questionText);
        questionSection.appendChild(answersDiv);
        questionSection.appendChild(nextButton);

        container.appendChild(questionSection);
    });

    addEventListeners();
}


function addEventListeners() {
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            document.getElementById('welcome-section').classList.add('hidden');
            const firstQuestion = document.getElementById('question1');
            if (firstQuestion) {
                firstQuestion.classList.remove('hidden');
            } else {
                console.error('First question section not found');
            }
        });
    } else {
        console.error('Start button not found');
    }

    document.querySelectorAll('.next-button').forEach((button, index, buttons) => {
        button.addEventListener('click', () => handleNextButtonClick(button, index, buttons));
    });

    document.querySelectorAll('.answer-button').forEach(button => {
        button.addEventListener('click', handleAnswerButtonClick);
    });
}


function handleNextButtonClick(button, index, buttons) {
    const isLastQuestion = index + 1 === buttons.length;
    const selectedAnswerButton = button.parentElement.querySelector('.answer-button.selected');

    if (!selectedAnswerButton) {
        alert('Please select an answer before proceeding to the next question.');
        return;
    }

    const selectedIntegerValue = selectedAnswerButton.dataset.value;
    const selectedColor = selectedAnswerButton.dataset.color;
    const questionIndex = button.closest('.question-section').id.replace('question', '');
    
    dbAnswers[questionIndex] = parseInt(selectedIntegerValue);


    if (questionIndex != 31) {
        colorSegment(questionIndex, parseInt(selectedIntegerValue), selectedColor);
    }

    // Handle last question differently
    if (isLastQuestion) {
        submitForm();
        const currentSection = button.closest('.question-section');
        if (currentSection) {
            currentSection.classList.add('hidden');
        }
        return; 
    }

    const currentSection = button.parentElement;
    if (currentSection) {
        currentSection.classList.add('hidden');
    }

    const nextSection = currentSection.nextElementSibling;
    if (nextSection) {
        nextSection.classList.remove('hidden');
    } else {
        console.error('Next question section not found');
    }
}


function handleAnswerButtonClick() {
    this.parentElement.querySelectorAll('.answer-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    this.classList.add('selected');

    // Store the selected answer
    const questionIndex = this.closest('.question-section').id.replace('question', '');
    selectedAnswers[questionIndex] = this.dataset.answer;

}


function fetchAndEmbedSvg(svgPath, containerId, callback) {
    console.log(`Starting to fetch and embed SVG from: ${svgPath}`);
    fetch(svgPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(svgData => {
            const container = document.getElementById(containerId);
            if (container) {
                console.log(`Embedding SVG into container: ${containerId}`);
                container.innerHTML = svgData;
                console.log(`SVG embedded successfully.`);
                if (callback) callback();
            } else {
                console.error(`Container with ID ${containerId} not found.`);
            }
        })
        .catch(error => console.error('Error fetching SVG:', error));
}


function cloneSvgElement(containerId) {
    console.log(`Starting to clone SVG in container: ${containerId}`);
    const container = document.getElementById(containerId);
    const originalSvg = container.querySelector('svg');
    if (originalSvg) {
        clonedSvg = originalSvg.cloneNode(true);
        console.log(`SVG cloned successfully.`);
        
    } else {
        console.error('Original SVG element not found for cloning.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
    // fetchDBQuestions();
    //const DBquestions = JSON.parse(fetchQuestions());

    console.log("Questions Loaded")
    
    const svgPath = 'assets/28discoball_custom_30.svg'; 
    const containerId = 'svgContainer';
    
    fetchAndEmbedSvg(svgPath, containerId, function() {
        cloneSvgElement(containerId);
    
    });
});
    

function colorSegment(questionIndex, answer, color) {
    const classSelector = `.q${questionIndex}`;
    
    console.log(`inside colorSegment(): Coloring segment: ${classSelector} with color: ${color} for answer: ${answer}`);
    const svgElements = clonedSvg.querySelectorAll(classSelector);
    
    svgElements.forEach(element => {
        if (element) {
            element.style.fill = color;
        } else {
            console.warn(`Element with class ${classSelector} not found in cloned SVG.`);
        }
    });
}


function saveSvg(svgElement, filename) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(svgUrl);
}

   
function submitForm() {
    const answersArray = Object.values(dbAnswers);

    //console.log(dbAnswers);

    if (!clonedSvg || !(clonedSvg instanceof SVGSVGElement)) {
        console.error('Cloned SVG is not ready for saving.');
        return;
    }

    const svgDisplayContainer = document.getElementById('svgDisplayContainer');
    svgDisplayContainer.innerHTML = '';
    svgDisplayContainer.appendChild(clonedSvg);

    const downloadButton = document.getElementById('download-button');
    downloadButton.style.display = 'flex'; 


    downloadButton.addEventListener('click', function() {
        saveSvg(clonedSvg, 'export_discoball.svg');
    });
    
    // Make an HTTP POST request to the server
    fetch('https://discoball.vercel.app/api/server',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // Send the dbAnswers object to the server
            answers: dbAnswers
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        return response.json();
    })
    .then(data => {
        console.log('Form data submitted successfully:', data);
    })
    .catch(error => {
        console.error('Error submitting form:', error);
    });
}
