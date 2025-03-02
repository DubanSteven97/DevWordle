const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const HINT_AFTER_ATTEMPTS = 3;

const VALID_WORDS = [
  { word: "ARRAY", description: "Estructura de datos que almacena elementos de manera ordenada." },
  { word: "CAMPO", description: "Espacio reservado para almacenar un valor en una base de datos." },
  { word: "CLASE", description: "Plantilla para crear objetos en programación orientada a objetos." },
  { word: "BUCLE", description: "Estructura de control que repite un bloque de código." },
  { word: "VALOR", description: "Dato que puede ser asignado a una variable." },
  { word: "TOKEN", description: "Unidad mínima con significado en un lenguaje de programación." },
  { word: "DEBUG", description: "Proceso de identificar y corregir errores en el código." },
  { word: "INDEX", description: "Posición de un elemento en un arreglo o lista." }
];

let correctWordData = VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)];
let correctWord = correctWordData.word;
let correctDescription = correctWordData.description;

const board = document.getElementById("board");
const guessInput = document.getElementById("guess-input");
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button");
const message = document.getElementById("message");
const hint = document.getElementById("hint");
const description = document.getElementById("description");
const totalPointsElement = document.getElementById("total-points");

let currentAttempt = 0;
let hintGiven = false;
let totalPoints = 0;

function initializeBoard() {
  console.log(correctWord)
  board.innerHTML = "";
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < WORD_LENGTH; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}

function giveHint() {
  if (!hintGiven && currentAttempt >= HINT_AFTER_ATTEMPTS) {
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = correctWord[i];
      if (!guessInput.value.toUpperCase().includes(letter)) {
        hint.textContent = `Pista: La letra "${letter}" está en la palabra.`;
        hintGiven = true;
        break;
      }
    }
  }
}

function calculatePoints(attempts) {
  const basePoints = 100;
  const points = basePoints - (attempts * 10);
  return points > 0 ? points : 10;
}

function checkGuess() {
  const guess = guessInput.value.toUpperCase();
  if (guess.length !== WORD_LENGTH) {
    message.textContent = "La palabra debe tener 5 letras.";
    return;
  }

  const row = board.children[currentAttempt];
  let correctLetters = 0;

  for (let i = 0; i < WORD_LENGTH; i++) {
    const cell = row.children[i];
    const letter = guess[i];
    cell.textContent = letter;

    if (letter === correctWord[i]) {
      cell.style.backgroundColor = "#6aaa64";
      correctLetters++;
    } else if (correctWord.includes(letter)) {
      cell.style.backgroundColor = "#c9b458";
    } else {
      cell.style.backgroundColor = "#787c7e";
    }
  }

  if (correctLetters === WORD_LENGTH) {
    const points = calculatePoints(currentAttempt + 1);
    totalPoints += points;
    message.textContent = `¡Felicidades! ¡Ganaste! Obtuviste ${points} puntos.`;
    description.textContent = `Significado: ${correctDescription}`;
    totalPointsElement.textContent = `Puntos totales: ${totalPoints}`;
    endGame();
  } else {
    currentAttempt++;
    if (currentAttempt === MAX_ATTEMPTS) {
      message.textContent = `¡Perdiste! La palabra era: ${correctWord}`;
      description.textContent = `Significado: ${correctDescription}`;
      endGame();
    } else {
      giveHint();
    }
  }

  guessInput.value = "";
}

function endGame() {
  guessInput.disabled = true;
  submitButton.disabled = true;
  savePoints();
}

function savePoints() {
  localStorage.setItem("totalPoints", totalPoints);
  console.log(`Puntos totales guardados: ${totalPoints}`);
}

function resetGame() {
  currentAttempt = 0;
  hintGiven = false;
  message.textContent = "";
  hint.textContent = "";
  description.textContent = "";
  guessInput.disabled = false;
  submitButton.disabled = false;
  correctWordData = VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)];
  correctWord = correctWordData.word;
  correctDescription = correctWordData.description;
  initializeBoard();
}

submitButton.addEventListener("click", checkGuess);
guessInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") checkGuess();
});
resetButton.addEventListener("click", resetGame);

initializeBoard();

if (localStorage.getItem("totalPoints")) {
  totalPoints = parseInt(localStorage.getItem("totalPoints"));
  totalPointsElement.textContent = `Puntos totales: ${totalPoints}`;
  console.log(`Puntos totales cargados: ${totalPoints}`);
}