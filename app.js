let boxes = document.querySelectorAll(".box");
let resetbutton = document.querySelector("#reset-button");
let newGame = document.querySelector("#new-button");
let newContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let strikeLine = document.querySelector("#strike-line");

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

let scoreXEl = document.querySelector("#score-x");
let scoreOEl = document.querySelector("#score-o");
let scoreDrawEl = document.querySelector("#score-draw");

let turnO = true; //playerX, playerO
let count = 0;

const playSound = (frequency, duration, type = "sine") => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration,
  );

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  newContainer.classList.add("hide");
  strikeLine.classList.add("hide");
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO) {
      // playerO
      box.innerText = "O";
      box.classList.add("playerO");
      turnO = false;
    } else {
      //playerX
      box.innerText = "X";
      box.classList.add("playerX");
      turnO = true;
    }
    box.disabled = true;
    count++;
    playSound(400, 0.1);

    checkWinner();
  });
});

const disabledBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("playerX", "playerO");
  }
};

const showWinner = (winner, pattern) => {
  playSound(700, 0.4);
  msg.innerText = `Congratulations, Winner is ${winner}`;
  newContainer.classList.remove("hide");
  disabledBoxes();
  drawStrike(pattern);

  if (winner === "X") {
    scoreX++;
    scoreXEl.innerText = scoreX;
  } else {
    scoreO++;
    scoreOEl.innerText = scoreO;
  }
};

const showDraw = () => {
  playSound(200, 0.5);
  msg.innerText = `Game was a Draw!`;
  newContainer.classList.remove("hide");
  disabledBoxes();

  scoreDraw++;
  scoreDrawEl.innerText = scoreDraw;
};

const drawStrike = (pattern) => {
  const gameBox = document.querySelector(".game");
  const gameRect = gameBox.getBoundingClientRect();

  const box1 = boxes[pattern[0]].getBoundingClientRect();
  const box3 = boxes[pattern[2]].getBoundingClientRect();

  const x1 = box1.left + box1.width / 2 - gameRect.left;
  const y1 = box1.top + box1.height / 2 - gameRect.top;
  const x3 = box3.left + box3.width / 2 - gameRect.left;
  const y3 = box3.top + box3.height / 2 - gameRect.top;

  const length = Math.hypot(x3 - x1, y3 - y1);
  const angle = Math.atan2(y3 - y1, x3 - x1) * (180 / Math.PI);

  strikeLine.style.width = `${length}px`;
  strikeLine.style.left = `${x1}px`;
  strikeLine.style.top = `${y1}px`;
  strikeLine.style.transform = `rotate(${angle}deg)`;
  strikeLine.classList.remove("hide");
};

const checkWinner = () => {
  let winnerFound = false;

  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val, pattern);
        winnerFound = true;
      }
    }
  }

  if (count === 9 && !winnerFound) {
    showDraw();
  }
};

newGame.addEventListener("click", resetGame);
resetbutton.addEventListener("click", resetGame);
