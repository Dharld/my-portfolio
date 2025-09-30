/*=============== SHOW SIDEBAR ===============*/
const navMenu = document.getElementById("sidebar"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/*===== SIDEBAR SHOW =====*/
/* Validate If Constant Exists */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-sidebar");
  });
}

/*===== SIDEBAR HIDDEN =====*/
/* Validate If Constant Exists */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-sidebar");
  });
}

/*=============== SKILLS TABS ===============*/
const tabs = document.querySelectorAll("[data-target]"),
  tabContent = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabContent.forEach((tabContents) => {
      tabContents.classList.remove("skills__active");
    });

    target.classList.add("skills__active");

    tabs.forEach((tab) => {
      tab.classList.remove("skills__active");
    });

    tab.classList.add("skills__active");
  });
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixerPortfolio = mixitup(".work__container", {
  selectors: {
    target: ".work__card",
  },
  animation: {
    duration: 300,
  },
});

/*===== Link Active Work =====*/
const linkWork = document.querySelectorAll(".work__item");

function activeWork() {
  linkWork.forEach((l) => l.classList.remove("active-work"));
  this.classList.add("active-work");
}

linkWork.forEach((l) => l.addEventListener("click", activeWork));

/*===== Work Popup =====*/
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("work__button")) {
    togglePortfolioPopup();
    portfolioItemDetails(e.target.parentElement);
  }
});

function togglePortfolioPopup() {
  document.querySelector(".portfolio__popup").classList.toggle("open");
}

document
  .querySelector(".portfolio__popup-close")
  .addEventListener("click", togglePortfolioPopup);

function portfolioItemDetails(portfolioItem) {
  document.querySelector(".pp__thumbnail img").src =
    portfolioItem.querySelector(".work__img").src;
  document.querySelector(".portfolio__popup-subtitle span").innerHTML =
    portfolioItem.querySelector(".work__title").innerHTML;
  document.querySelector(".portfolio__popup-body").innerHTML =
    portfolioItem.querySelector(".portfolio__item-details").innerHTML;
}
/*=============== SERVICES MODAL ===============*/
const modalViews = document.querySelectorAll(".services__modal"),
  modelBtns = document.querySelectorAll(".services__button"),
  modalCloses = document.querySelectorAll(".services__modal-close");

let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modelBtns.forEach((modelBtn, i) => {
  modelBtn.addEventListener("click", () => {
    modal(i);
  });
});

modalCloses.forEach((modalClose) => {
  modalClose.addEventListener("click", () => {
    modalViews.forEach((modalView) => {
      modalView.classList.remove("active-modal");
    });
  });
});

/*=============== SWIPER TESTIMONIAL ===============*/
let swiper = new Swiper(".testimonials__container", {
  spaceBetween: 24,
  loop: true,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 48,
    },
  },
});

/*=============== INPUT ANIMATION ===============*/
const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
// get all sections that have an id defined
const sections = document.querySelectorAll("section[id]");

// add an event listener listening for scroll
window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
  // get current scroll position
  let scrollY = window.pageYOffset;
  // Now we loop through sections to get height, top and ID values for each
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50,
      sectionId = current.getAttribute("id");
    /* - If our current scroll position enters the space where current section on screen is, add .active class to corresponding navigation link, else remove it
    - To know which link needs an active class, we use sectionId variable we are getting while looping through sections as an selector */
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}

/*=============== SHOW SCROLL UP ===============*/
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // when the scroll is higher than 350 viewport height, add the show-scroll class to a tag with the scroll-top class
  if (this.scrollY >= 350) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/* EMAIL MANAGEMENT */
/* const publicKey = creds.publicKey;
const serviceId = creds.serviceId;

console.log(publicKey);

emailjs.init({
  publicKey,
});

document
  .querySelector(".contact__form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const username = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const phone = document.querySelector('input[type="tel"]').value;
    const message = document.querySelector("textarea").value;

    // Validate form data
    if (!username || !email || !phone || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = {
      username: username,
      email: email,
      phone: phone,
      message: message,
    };

    console.log(formData);

    // Send email using EmailJS
    emailjs.send(serviceId, "contact__form", formData).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Message sent successfully!");
      },
      function (error) {
        console.log("FAILED...");
        console.error(error);
        alert("Failed to send message. Please try again later.");
      }
    );
  }); */

/*=============== GAMES SECTION ===============*/
// Game Modal Management
const gameModal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const gameArea = document.getElementById('gameArea');
const modalClose = document.querySelector('.games__modal-close');
const restartBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn');

// Game state
let currentGame = null;
let gameState = {
  isPaused: false,
  isGameOver: false
};

// Game card click handlers
document.querySelectorAll('.games__card').forEach(card => {
  card.addEventListener('click', (e) => {
    const gameType = card.dataset.game;
    if (gameType) {
      openGameModal(gameType);
    }
  });
});

// Modal controls
modalClose?.addEventListener('click', closeGameModal);
window.addEventListener('click', (e) => {
  if (e.target === gameModal) {
    closeGameModal();
  }
});

restartBtn?.addEventListener('click', () => {
  if (currentGame) {
    initGame(currentGame);
  }
});

pauseBtn?.addEventListener('click', togglePause);

// Game modal functions
function openGameModal(gameType) {
  currentGame = gameType;
  gameModal.classList.add('active');
  modalTitle.textContent = getGameTitle(gameType);
  initGame(gameType);
  document.body.style.overflow = 'hidden';
}

function closeGameModal() {
  gameModal.classList.remove('active');
  currentGame = null;
  gameArea.innerHTML = '';
  document.body.style.overflow = '';
  gameState.isPaused = false;
  gameState.isGameOver = false;
}

function getGameTitle(gameType) {
  const titles = {
    'puzzle': 'Sliding Puzzle',
    'memory': 'Memory Match',
    'snake': 'Snake Game',
    'tictactoe': 'Tic Tac Toe',
    'colors': 'Color Rush',
    'pong': 'Pong Game'
  };
  return titles[gameType] || 'Game';
}

function togglePause() {
  gameState.isPaused = !gameState.isPaused;
  const icon = pauseBtn.querySelector('i');
  icon.className = gameState.isPaused ? 'uil uil-play' : 'uil uil-pause';
}

function initGame(gameType) {
  gameState.isGameOver = false;
  gameState.isPaused = false;
  pauseBtn.querySelector('i').className = 'uil uil-pause';
  
  switch(gameType) {
    case 'puzzle':
      initSlidingPuzzle();
      break;
    case 'memory':
      initMemoryGame();
      break;
    case 'snake':
      initSnakeGame();
      break;
    case 'tictactoe':
      initTicTacToe();
      break;
    case 'colors':
      initColorRush();
      break;
    case 'pong':
      initPongGame();
      break;
  }
}

// Sliding Puzzle Game
function initSlidingPuzzle() {
  const puzzleSize = 4;
  let puzzle = [];
  let emptyIndex = puzzleSize * puzzleSize - 1;
  
  // Initialize puzzle
  for (let i = 0; i < puzzleSize * puzzleSize - 1; i++) {
    puzzle[i] = i + 1;
  }
  puzzle[emptyIndex] = 0;
  
  // Shuffle puzzle
  for (let i = 0; i < 1000; i++) {
    const neighbors = getNeighbors(emptyIndex, puzzleSize);
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    [puzzle[emptyIndex], puzzle[randomNeighbor]] = [puzzle[randomNeighbor], puzzle[emptyIndex]];
    emptyIndex = randomNeighbor;
  }
  
  gameArea.innerHTML = `
    <div class="puzzle-game">
      <div class="puzzle-grid" id="puzzleGrid"></div>
      <div class="game-info">
        <div class="moves-counter">Moves: <span id="moveCount">0</span></div>
      </div>
    </div>
  `;
  
  const grid = document.getElementById('puzzleGrid');
  let moves = 0;
  
  function renderPuzzle() {
    grid.innerHTML = '';
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${puzzleSize}, 1fr);
      gap: 4px;
      width: 300px;
      height: 300px;
      margin: 0 auto;
    `;
    
    puzzle.forEach((num, index) => {
      const tile = document.createElement('div');
      tile.className = 'puzzle-tile';
      tile.textContent = num || '';
      tile.style.cssText = `
        background: ${num ? 'linear-gradient(135deg, var(--skin-color), hsl(202, 94%, 45%))' : 'transparent'};
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        cursor: ${num ? 'pointer' : 'default'};
        transition: all 0.3s ease;
        border: ${num ? 'none' : '2px dashed rgba(255, 255, 255, 0.3)'};
      `;
      
      if (num) {
        tile.addEventListener('click', () => moveTile(index));
        tile.addEventListener('mouseenter', () => {
          tile.style.transform = 'scale(0.95)';
        });
        tile.addEventListener('mouseleave', () => {
          tile.style.transform = 'scale(1)';
        });
      }
      
      grid.appendChild(tile);
    });
  }
  
  function moveTile(index) {
    if (gameState.isPaused || gameState.isGameOver) return;
    
    const neighbors = getNeighbors(emptyIndex, puzzleSize);
    if (neighbors.includes(index)) {
      [puzzle[index], puzzle[emptyIndex]] = [puzzle[emptyIndex], puzzle[index]];
      emptyIndex = index;
      moves++;
      document.getElementById('moveCount').textContent = moves;
      renderPuzzle();
      checkWin();
    }
  }
  
  function checkWin() {
    const isWin = puzzle.every((num, index) => 
      index === puzzleSize * puzzleSize - 1 ? num === 0 : num === index + 1
    );
    
    if (isWin) {
      gameState.isGameOver = true;
      setTimeout(() => {
        alert(`Congratulations! You solved the puzzle in ${moves} moves!`);
      }, 300);
    }
  }
  
  renderPuzzle();
}

function getNeighbors(index, size) {
  const neighbors = [];
  const row = Math.floor(index / size);
  const col = index % size;
  
  if (row > 0) neighbors.push(index - size); // up
  if (row < size - 1) neighbors.push(index + size); // down
  if (col > 0) neighbors.push(index - 1); // left
  if (col < size - 1) neighbors.push(index + 1); // right
  
  return neighbors;
}

// Snake Game
function initSnakeGame() {
  let snake = [{x: 200, y: 200}];
  let food = {x: 160, y: 160};
  let dx = 0;
  let dy = 0;
  let score = 0;
  let gameRunning = false;
  let gameLoop;
  
  gameArea.innerHTML = `
    <div class="snake-game">
      <div class="game-info">
        <div class="score">Score: <span id="snakeScore">0</span></div>
        <div class="controls">Use WASD or Arrow Keys to move</div>
        <button id="startSnake" class="start-btn">Start Game</button>
      </div>
      <canvas id="snakeCanvas" width="400" height="400"></canvas>
    </div>
  `;
  
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startSnake');
  
  canvas.style.cssText = `
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.5);
    display: block;
    margin: 10px auto;
  `;
  
  startBtn.style.cssText = `
    background: linear-gradient(135deg, var(--skin-color), hsl(202, 94%, 45%));
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    margin: 10px;
    font-weight: 500;
  `;
  
  function generateFood() {
    food = {
      x: Math.round((Math.random() * (canvas.width - 20)) / 20) * 20,
      y: Math.round((Math.random() * (canvas.height - 20)) / 20) * 20
    };
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        generateFood();
        return;
      }
    }
  }
  
  function drawSnake() {
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#16a34a'; // Head color
      } else {
        ctx.fillStyle = '#22c55e'; // Body color
      }
      ctx.fillRect(segment.x, segment.y, 18, 18);
    });
  }
  
  function drawFood() {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(food.x, food.y, 18, 18);
  }
  
  function clear() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function update() {
    if (gameState.isPaused || !gameRunning) return;
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      gameOver();
      return;
    }
    
    // Self collision
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        gameOver();
        return;
      }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.getElementById('snakeScore').textContent = score;
      generateFood();
    } else {
      snake.pop();
    }
  }
  
  function gameOver() {
    gameRunning = false;
    clearTimeout(gameLoop);
    startBtn.textContent = 'Restart Game';
    startBtn.style.display = 'block';
    setTimeout(() => {
      alert(`Game Over! Final Score: ${score}`);
    }, 100);
  }
  
  function runGameLoop() {
    clear();
    update();
    drawFood();
    drawSnake();
    
    if (gameRunning) {
      gameLoop = setTimeout(runGameLoop, 150);
    }
  }
  
  function startGame() {
    snake = [{x: 200, y: 200}];
    dx = 0;
    dy = 0;
    score = 0;
    gameRunning = true;
    startBtn.style.display = 'none';
    document.getElementById('snakeScore').textContent = score;
    generateFood();
    runGameLoop();
  }
  
  // Controls
  function handleKeyPress(e) {
    if (!gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    if ((key === 'arrowleft' || key === 'a') && dx !== 20) {
      dx = -20;
      dy = 0;
    } else if ((key === 'arrowright' || key === 'd') && dx !== -20) {
      dx = 20;
      dy = 0;
    } else if ((key === 'arrowup' || key === 'w') && dy !== 20) {
      dx = 0;
      dy = -20;
    } else if ((key === 'arrowdown' || key === 's') && dy !== -20) {
      dx = 0;
      dy = 20;
    }
  }
  
  document.addEventListener('keydown', handleKeyPress);
  startBtn.addEventListener('click', startGame);
  
  // Initial draw
  clear();
  drawFood();
  drawSnake();
}

// Memory Game
function initMemoryGame() {
  const icons = ['🌟', '❤️', '🎵', '🎨', '🚀', '🌈', '⚡', '🔥'];
  const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  
  gameArea.innerHTML = `
    <div class="memory-game">
      <div class="memory-grid" id="memoryGrid"></div>
      <div class="game-info">
        <div class="moves-counter">Moves: <span id="memoryMoves">0</span></div>
        <div class="pairs-counter">Pairs: <span id="pairsCount">0</span>/${icons.length}</div>
      </div>
    </div>
  `;
  
  const grid = document.getElementById('memoryGrid');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    width: 320px;
    height: 320px;
    margin: 0 auto;
  `;
  
  cards.forEach((icon, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.style.cssText = `
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
      user-select: none;
    `;
    
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
  
  function flipCard(card) {
    if (gameState.isPaused || gameState.isGameOver || 
        card.classList.contains('flipped') || flippedCards.length >= 2) return;
    
    card.textContent = card.dataset.icon;
    card.classList.add('flipped');
    card.style.background = 'linear-gradient(135deg, var(--skin-color), hsl(202, 94%, 45%))';
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
      moves++;
      document.getElementById('memoryMoves').textContent = moves;
      
      setTimeout(() => {
        if (flippedCards[0].dataset.icon === flippedCards[1].dataset.icon) {
          matchedPairs++;
          document.getElementById('pairsCount').textContent = matchedPairs;
          flippedCards.forEach(c => c.style.opacity = '0.6');
          
          if (matchedPairs === icons.length) {
            gameState.isGameOver = true;
            setTimeout(() => {
              alert(`Congratulations! You completed the game in ${moves} moves!`);
            }, 500);
          }
        } else {
          flippedCards.forEach(c => {
            c.textContent = '';
            c.classList.remove('flipped');
            c.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
          });
        }
        flippedCards = [];
      }, 1000);
    }
  }
}

// Tic Tac Toe Game
function initTicTacToe() {
  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = true;
  
  gameArea.innerHTML = `
    <div class="tictactoe-game">
      <div class="tictactoe-grid" id="tictactoeGrid"></div>
      <div class="game-info">
        <div class="current-player">Current Player: <span id="currentPlayer">X</span></div>
        <button class="reset-btn" id="resetTicTacToe">Reset Game</button>
      </div>
    </div>
  `;
  
  const grid = document.getElementById('tictactoeGrid');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    width: 300px;
    height: 300px;
    margin: 0 auto;
  `;
  
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'tictactoe-cell';
    cell.dataset.index = i;
    cell.style.cssText = `
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--skin-color);
      width: 95px;
      height: 95px;
      min-width: 95px;
      min-height: 95px;
      box-sizing: border-box;
    `;
    
    cell.addEventListener('click', () => makeMove(i));
    grid.appendChild(cell);
  }
  
  document.getElementById('resetTicTacToe').addEventListener('click', initTicTacToe);
  
  function makeMove(index) {
    if (gameState.isPaused || !gameActive || board[index]) return;
    
    board[index] = currentPlayer;
    const cell = grid.children[index];
    cell.textContent = currentPlayer;
    cell.style.background = 'linear-gradient(135deg, var(--skin-color), hsl(202, 94%, 45%))';
    
    if (checkWinner()) {
      gameActive = false;
      setTimeout(() => {
        alert(`Player ${currentPlayer} wins!`);
      }, 300);
      return;
    }
    
    if (board.every(cell => cell)) {
      gameActive = false;
      setTimeout(() => {
        alert("It's a tie!");
      }, 300);
      return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('currentPlayer').textContent = currentPlayer;
  }
  
  function checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  }
}

// Color Rush Game
function initColorRush() {
  let score = 0;
  let timeLeft = 30;
  let targetColor = '';
  let gameInterval;
  let timerInterval;
  
  gameArea.innerHTML = `
    <div class="color-rush-game">
      <div class="game-header" style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 1.2rem; color: var(--title-color);">
        <div class="score">Score: <span id="colorScore">0</span></div>
        <div class="timer">Time: <span id="colorTimer">30</span>s</div>
      </div>
      <div class="target-color" style="text-align: center; margin-bottom: 20px;">
        <div style="color: var(--text-color); margin-bottom: 10px; font-size: 1.1rem;">Match this color:</div>
        <div class="target-display" id="targetDisplay" style="width: 100px; height: 100px; margin: 0 auto; border-radius: 12px; border: 3px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);"></div>
      </div>
      <div class="color-options" id="colorOptions"></div>
    </div>
  `;
  
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
    '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894',
    '#e17055', '#74b9ff', '#55a3ff', '#fdcb6e'
  ];
  
  function generateRound() {
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('targetDisplay').style.background = targetColor;
    
    const options = [targetColor];
    while (options.length < 4) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      if (!options.includes(randomColor)) {
        options.push(randomColor);
      }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    const optionsContainer = document.getElementById('colorOptions');
    optionsContainer.innerHTML = '';
    optionsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
      width: 300px;
      margin-left: auto;
      margin-right: auto;
    `;
    
    options.forEach(color => {
      const option = document.createElement('div');
      option.className = 'color-option';
      option.style.cssText = `
        width: 100%;
        height: 80px;
        background: ${color};
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 3px solid transparent;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      `;
      
      option.addEventListener('click', () => selectColor(color));
      option.addEventListener('mouseenter', () => {
        option.style.transform = 'scale(1.05)';
        option.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      });
      option.addEventListener('mouseleave', () => {
        option.style.transform = 'scale(1)';
        option.style.borderColor = 'transparent';
      });
      
      optionsContainer.appendChild(option);
    });
  }
  
  function selectColor(selectedColor) {
    if (gameState.isPaused) return;
    
    if (selectedColor === targetColor) {
      score += 10;
      document.getElementById('colorScore').textContent = score;
      generateRound();
    } else {
      score = Math.max(0, score - 5);
      document.getElementById('colorScore').textContent = score;
    }
  }
  
  function startTimer() {
    timerInterval = setInterval(() => {
      if (!gameState.isPaused) {
        timeLeft--;
        document.getElementById('colorTimer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
          endGame();
        }
      }
    }, 1000);
  }
  
  function endGame() {
    clearInterval(timerInterval);
    gameState.isGameOver = true;
    setTimeout(() => {
      alert(`Game Over! Your final score: ${score}`);
    }, 300);
  }
  
  generateRound();
  startTimer();
}

// Pong Game
function initPongGame() {
  let canvas, ctx;
  let ball, leftPaddle, rightPaddle;
  let gameRunning = false;
  let animationFrame;
  let leftScore = 0, rightScore = 0;
  
  gameArea.innerHTML = `
    <div class="pong-game">
      <div class="game-info" style="display: flex; justify-content: space-between; margin-bottom: 15px; color: var(--title-color);">
        <div class="score-left">Player: <span id="leftScore">0</span></div>
        <div class="controls" style="font-size: 0.9rem; color: var(--text-color);">W/S - Left Paddle | ↑/↓ - Right Paddle</div>
        <div class="score-right">AI: <span id="rightScore">0</span></div>
      </div>
      <canvas id="pongCanvas" width="600" height="400"></canvas>
      <button id="startPong" class="start-btn" style="margin-top: 15px; background: linear-gradient(135deg, var(--skin-color), hsl(202, 94%, 45%)); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500;">Start Game</button>
    </div>
  `;
  
  canvas = document.getElementById('pongCanvas');
  ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startPong');
  
  canvas.style.cssText = `
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.7);
    display: block;
    margin: 0 auto;
  `;
  
  // Game objects
  ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 3,
    radius: 8,
    speed: 5
  };
  
  leftPaddle = {
    x: 20,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 0,
    speed: 8
  };
  
  rightPaddle = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 0,
    speed: 6
  };
  
  function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  
  function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  function drawNet() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  function update() {
    if (!gameRunning || gameState.isPaused) return;
    
    // Move paddles
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    
    // Keep paddles in bounds
    leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
    
    // Simple AI for right paddle
    const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (ball.y > paddleCenter + 20) {
      rightPaddle.dy = rightPaddle.speed;
    } else if (ball.y < paddleCenter - 20) {
      rightPaddle.dy = -rightPaddle.speed;
    } else {
      rightPaddle.dy = 0;
    }
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
      ball.dy = -ball.dy;
    }
    
    // Ball collision with paddles
    if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
        ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
      ball.dx = Math.abs(ball.dx);
      // Add some angle based on where it hits the paddle
      const hitPos = (ball.y - leftPaddle.y) / leftPaddle.height;
      ball.dy = (hitPos - 0.5) * 8;
    }
    
    if (ball.x + ball.radius >= rightPaddle.x &&
        ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
      ball.dx = -Math.abs(ball.dx);
      const hitPos = (ball.y - rightPaddle.y) / rightPaddle.height;
      ball.dy = (hitPos - 0.5) * 8;
    }
    
    // Score
    if (ball.x < 0) {
      rightScore++;
      document.getElementById('rightScore').textContent = rightScore;
      resetBall();
    } else if (ball.x > canvas.width) {
      leftScore++;
      document.getElementById('leftScore').textContent = leftScore;
      resetBall();
    }
    
    // Check for win condition
    if (leftScore >= 5 || rightScore >= 5) {
      gameRunning = false;
      const winner = leftScore >= 5 ? 'Player' : 'AI';
      setTimeout(() => {
        alert(`${winner} wins! Final Score: ${leftScore} - ${rightScore}`);
        startBtn.style.display = 'block';
        startBtn.textContent = 'Play Again';
      }, 500);
    }
  }
  
  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * 6;
  }
  
  function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.1)');
    
    // Draw net
    drawNet();
    
    // Draw paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, '#22c55e');
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, '#ef4444');
    
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#ffffff');
  }
  
  function gameLoop() {
    update();
    draw();
    
    if (gameRunning) {
      animationFrame = requestAnimationFrame(gameLoop);
    }
  }
  
  function startGame() {
    leftScore = 0;
    rightScore = 0;
    document.getElementById('leftScore').textContent = leftScore;
    document.getElementById('rightScore').textContent = rightScore;
    
    gameRunning = true;
    startBtn.style.display = 'none';
    resetBall();
    gameLoop();
  }
  
  // Controls
  const keys = {};
  
  function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
  }
  
  function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }
  
  function updatePaddleMovement() {
    leftPaddle.dy = 0;
    
    if (keys['w']) leftPaddle.dy = -leftPaddle.speed;
    if (keys['s']) leftPaddle.dy = leftPaddle.speed;
    if (keys['arrowup']) rightPaddle.dy = -rightPaddle.speed;
    if (keys['arrowdown']) rightPaddle.dy = rightPaddle.speed;
    
    if (gameRunning) {
      requestAnimationFrame(updatePaddleMovement);
    }
  }
  
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  startBtn.addEventListener('click', startGame);
  
  // Initial draw
  draw();
  
  // Start paddle movement updates
  updatePaddleMovement();
}

// Add smooth scrolling animation for game cards
document.querySelectorAll('.games__card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (!card.classList.contains('games__card--featured')) {
      card.style.transform = 'translateY(-5px) scale(1.02)';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('games__card--featured')) {
      card.style.transform = 'translateY(0) scale(1)';
    }
  });
});

// Add games section to navigation if needed
document.addEventListener('DOMContentLoaded', () => {
  // Add scroll reveal animations for game cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.games__card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
});
