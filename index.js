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
    setTimeout(()=>{
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
    playButton.textContent = 'Play';
    playButton.classList.add('play-button');
    playButton.classList.add('yes');
    container.appendChild(playButton);

    // Add event listener to the "Play" button
    playButton.addEventListener('click', function () {
      // Remove all elements from the page
      document.body.removeChild(container)
      const matchingGameGrid = document.getElementById('memory-game')
      matchingGameGrid.style.display = 'block'
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
});
