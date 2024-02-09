document.addEventListener('DOMContentLoaded', function () {
  const gridContainer = document.querySelector('.grid-container');
  const resetButton = document.querySelector('.reset-button');

  const emojis = ['😘', '🐱', '👀', '🤏🏼', '🥰', '🤣', '🍉', '😈'];
  const shuffledEmojis = emojis.concat(emojis).sort(() => 0.5 - Math.random());
  let firstCard = null;
  let secondCard = null;
  let cardsMatched = 0;
  let isRevealing = false;

  // Create grid of cards
  shuffledEmojis.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('grid-item');
    card.dataset.index = index;
    card.textContent = '';
    card.addEventListener('click', () => revealCard(card));
    gridContainer.appendChild(card);
  });

  function revealCard(card) {
    if (isRevealing || card === firstCard || card === secondCard || card.textContent !== '') return;

    card.textContent = shuffledEmojis[card.dataset.index];

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      checkMatch();
    }
  }

  function checkMatch() {
    // Set isRevealing to true to prevent clicking another card
    isRevealing = true;
    // Show card a few milli second before dispear when matched
    setTimeout(() => {
      if (firstCard.textContent === secondCard.textContent) {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
        cardsMatched += 2;
        if (cardsMatched === shuffledEmojis.length) {
          gridContainer.style.backgroundImage = 'url("./assets/game_complete.png")';
          gridContainer.style.backgroundSize = 'cover';
          gridContainer.style.backgroundRepeat = 'no-repeat';
        }
        resetCards();
      } else {
        setTimeout(resetCards, 300);
      }
    }, 300)
  }

  function resetCards() {
    firstCard.textContent = '';
    secondCard.textContent = '';
    firstCard = null;
    secondCard = null;
    // Reset isRevealing to false to allow clicking another card
    isRevealing = false;
  }

  resetButton.addEventListener('click', () => {
    shuffledEmojis.sort(() => 0.5 - Math.random());
    document.querySelectorAll('.grid-item').forEach((card, index) => {
      card.textContent = '';
      card.dataset.index = index;
      card.style.visibility = 'visible'
    });
    firstCard = null;
    secondCard = null;
    cardsMatched = 0;
    // Reset isRevealing 
    isRevealing = false;
    gridContainer.style.backgroundImage = '';
    gridContainer.style.backgroundSize = '';
    gridContainer.style.backgroundRepeat = '';
  });

  const yesButton = document.querySelector('.yes');
  const noButton = document.querySelector('.no');

  let noClickCount = 0; // Counter for the number of times "No" button is clicked
  let yesButtonScale = 1.0; // Initial scale for the Yes button

  yesButton.addEventListener('click', function () {
    // Remove all elements from the page
    const introContainer = document.getElementById('intro')
    document.body.removeChild(introContainer)

    // Create a new container for the message and image
    const container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    // Create an image element for the happy cat
    const catImage = document.createElement('img');
    catImage.classList.add('cat-image');
    catImage.src = './assets/cat1_no_background.png'; // You can replace this with any other happy cat image
    catImage.alt = 'Happy Cat';
    container.appendChild(catImage);

    // Create a paragraph element for the lovely message
    const message = document.createElement('p');
    message.classList.add('message')
    message.textContent = 'You make me the happiest person in the world! 😘';
    container.appendChild(message);

    // Create a "Play" button
    const playButton = document.createElement('button');
    playButton.textContent = 'Play Memory Game';
    playButton.classList.add('play-button');
    playButton.classList.add('yes');
    container.appendChild(playButton);

    const journeyButton = document.createElement('button');
    journeyButton.textContent = 'Start Journey';
    journeyButton.classList.add('journey-button');
    journeyButton.classList.add('yes');
    container.appendChild(journeyButton);

    // Add event listener to the "Play" button
    playButton.addEventListener('click', function () {
      // Remove all elements from the page
      document.body.removeChild(container)
      const matchingGameGrid = document.getElementById('memory-game')
      matchingGameGrid.style.display = 'block'
    });
    // Add event listener to the "start journey" button
    journeyButton.addEventListener('click', function () {
      // Remove all elements from the page
      document.body.removeChild(container)
      const canvasContainer = document.getElementById('skee-game')
      canvasContainer.style.display = 'block'
    });
  });

  noButton.addEventListener('click', function () {
    // Increase the size of the Yes button each time the No button is clicked
    yesButtonScale *= 1.2;
    yesButton.style.transform = `scale(${yesButtonScale})`;

    // Increment the count of "No" button clicks
    noClickCount++;

    // Change cat image
    const catImage = document.getElementById('cat-image');
    if (noClickCount === 1) {
      catImage.src = './assets/cat_surprised.png'
    } else if (noClickCount > 2) {
      catImage.src = './assets/cat_cry.png'
    }

    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate random position for the No button
    const randomX = Math.random() * (windowWidth - noButton.offsetWidth);
    const randomY = Math.random() * (windowHeight - noButton.offsetHeight);

    // Apply random position to No button
    noButton.style.position = 'absolute';
    noButton.style.left = randomX + 'px';
    noButton.style.top = randomY + 'px';

    // If the "No" button is clicked 5 times, hide the "No" button and expand the "Yes" button
    if (noClickCount >= 5) {
      noButton.style.display = 'none'; // Hide the "No" button
      yesButton.style.position = 'fixed'; // Position the "Yes" button
      yesButton.style.width = '100%'; // Set width to full screen
      yesButton.style.height = '100%'; // Set height to full screen
      yesButton.style.top = '0'; // Align to the top
      yesButton.style.left = '0'; // Align to the left
      yesButton.style.fontSize = '24px'; // Increase font size for better visibility
    }
  });

  window.addEventListener('resize', main)
  main()

  function main() {
    // Skee-ball game
    const canvas = document.getElementById('gameCanvas');
    const canvasW = document.documentElement.clientWidth - (0.2 * document.documentElement.clientWidth)
    const canvasH = document.documentElement.clientHeight - (0.1 * document.documentElement.clientHeight)
    canvas.width = canvasW > 400 ? 400 : canvasW
    canvas.height = canvasH

    const ctx = canvas.getContext('2d');

    let score = 0;

    const ball = new Ball(canvas.width / 2, canvas.height - (0.1 * canvas.height))


    function gameLoop() {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = document.getElementById('egg')
      ctx.drawImage(img, canvas.width / 2 - 50, 10, 100, 100);

      // Draw skee point board
      ctx.fillStyle = '#99BC85';
      ctx.lineWidth = 2;
      const boardW = 250
      const boardH = 250
      ctx.beginPath();
      ctx.rect((canvas.width - boardW) / 2, (canvas.height - boardH) / 4, boardW, boardH);
      ctx.stroke();
      ctx.fill();

      // Runway
      ctx.beginPath();
      ctx.moveTo((canvas.width - boardW) / 2, (canvas.height - boardH) / 4 + boardH);
      ctx.lineTo((canvas.width - boardW) / 2 - 40, (canvas.height - boardH) / 4 + boardH + (1.8 * boardH));
      ctx.lineTo((canvas.width - boardW) / 2 + boardW + 40, (canvas.height - boardH) / 4 + boardH + (1.8 * boardH));
      ctx.lineTo((canvas.width - boardW) / 2 + boardW, (canvas.height - boardH) / 4 + boardH);
      ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo((canvas.width - boardW) / 2 + boardW, (canvas.height - boardH) / 4 + boardH);
      ctx.lineWidth = 5;
      ctx.lineTo((canvas.width - boardW) / 2 , (canvas.height - boardH) / 4 + boardH);
      ctx.stroke();

      // Point lines
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo((canvas.width - boardW) / 2 + 40, (canvas.height - boardH) / 4 );
      ctx.lineTo((canvas.width - boardW) / 2 + 40, (canvas.height - boardH) / 4 + (0.5 * boardH));
      ctx.moveTo((canvas.width - boardW) / 2 + boardW - 40, (canvas.height - boardH) / 4 + (0.5 * boardH));
      ctx.arc((canvas.width - boardW) / 2 + 40 + (boardW - 80) /2, (canvas.height - boardH) / 4 + (0.5 * boardH), (boardW - 80) /2, 0, Math.PI);
      ctx.moveTo((canvas.width - boardW) / 2 + boardW - 40, (canvas.height - boardH) / 4 + (0.5 * boardH));
      ctx.lineTo((canvas.width - boardW) / 2 + boardW - 40, (canvas.height - boardH) / 4 );
      ctx.stroke();

      // Point circle 1
      ctx.beginPath();
      ctx.arc((canvas.width) / 2 , (canvas.height - boardH) / 4 + (0.5 * boardH), (boardW - 80) / 3, 0, 2 * Math.PI);
      ctx.stroke();

      // Point circle 2
      ctx.beginPath();
      ctx.arc((canvas.width) / 2 , (canvas.height - boardH) / 4 + (0.6 * boardH), (boardW - 80) / 8, 0, 2 * Math.PI);
      ctx.stroke();

      // Point circle 3
      ctx.beginPath();
      ctx.arc((canvas.width) / 2 , (canvas.height - boardH) / 4 + (0.4 * boardH), (boardW - 80) / 8, 0, 2 * Math.PI);
      ctx.stroke();

      // Point circle 4
      ctx.beginPath();
      ctx.arc((canvas.width) / 2 , (canvas.height - boardH) / 4 + (0.15 * boardH), (boardW - 80) / 8, 0, 2 * Math.PI);
      ctx.stroke();

      ball.draw(ctx)

      // POint 1 Text
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText("10", (canvas.width) / 2 , (canvas.height - boardH) / 4 + (0.81 * boardH));
      // POint Text
      ctx.fillStyle = '#000';
      ctx.fillText("20", (canvas.width) / 2 + 25 , (canvas.height - boardH) / 4 + (0.52 * boardH));
      // POint Text
      ctx.fillStyle = '#000';
      ctx.fillText("30", (canvas.width) / 2 - 10, (canvas.height - boardH) / 4 + (0.6 * boardH));
      // POint Text
      ctx.fillStyle = '#000';
      ctx.fillText("40", (canvas.width) / 2 - 10, (canvas.height - boardH) / 4 + (0.4 * boardH));
      // POint Text
      ctx.fillStyle = '#000';
      ctx.fillText("50", (canvas.width) / 2 - 10 , (canvas.height - boardH) / 4 + (0.2 * boardH));
    }



    // Listen for mouse click to roll the ball
    //canvas.addEventListener('click', rollBall);

    // Initial draw
    gameLoop();
  }
});

// Define Ball for Game
class Ball {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.r = 20
    this.speed = 5
  }


  draw(ctx) {
    ctx.strokeStyle = '#B2533E'
    ctx.lineWidth = 3;
    ctx.fillStyle = '#B99470'
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill()
  }

  pull(ctx) {

  }
}

function mouseDown(event) {
  event.preventDefault();
  console.log(event)

  let startX = +event.clientX
  let startY = +event.clientY

}
