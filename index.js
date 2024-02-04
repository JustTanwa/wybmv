document.addEventListener('DOMContentLoaded', function() {
  const yesButton = document.querySelector('.yes');
  const noButton = document.querySelector('.no');

  let noClickCount = 0; // Counter for the number of times "No" button is clicked
  let yesButtonScale = 1.0; // Initial scale for the Yes button

  yesButton.addEventListener('click', function() {
      // Remove all elements from the page
      document.body.innerHTML = '';

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
  });

  noButton.addEventListener('click', function() {
      // Increase the size of the Yes button each time the No button is clicked
      yesButtonScale *= 1.2;
      yesButton.style.transform = `scale(${yesButtonScale})`;

      // Increment the count of "No" button clicks
      noClickCount++;

      // Change cat image
      const catImage = document.getElementById('cat-image');
      if (noClickCount === 1 ) {
        catImage.src = './assets/cat_surprised.png'
      } else if (noClickCount > 2 ) {
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
