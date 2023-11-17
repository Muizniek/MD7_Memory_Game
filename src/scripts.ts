import $ from 'jquery';
import sum from './utils/sum/sum';

console.log('Ready for coding');

console.log('Body jQuery node:', $('body'));
console.log('Body javascript node:', document.querySelector('body'));
console.log('2 + 3 =', sum(2, 3));

// Trigger code execution when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Variables to keep track of game state
    let cards: NodeListOf<Element>;
    let moves: number = 0;
    let flippedCards: Element[] = [];
    let matchedPairs: number = 0;
    let lostCount: number = 0;
    let wonCount: number = 0;
    let cardCount: number = 6;
    const maxMoves: number = 10;
    let playAgainButton: HTMLElement | null = document.getElementById('playAgainButton'); // Play Again button
    let moveCounterDisplay: HTMLElement | null = document.getElementById('moveCounter');
    let wonCounterDisplay: HTMLElement | null = document.getElementById('wonCounter');
    let lostCounterDisplay: HTMLElement | null = document.getElementById('lostCounter');
    let timerDisplay: HTMLElement | null = document.getElementById('timer');
    let startTime: number;
    let timerInterval: NodeJS.Timeout;

    const startButton = document.getElementById('startButton');
    const gameContainer = document.getElementById('memory-game');
    const resultDiv = document.getElementById('result');

    // Check if necessary elements exist before attaching event listeners
    if (startButton && gameContainer && resultDiv && playAgainButton && moveCounterDisplay && wonCounterDisplay && lostCounterDisplay && timerDisplay) {
        // Add click events for the start button and play again button
        startButton.addEventListener('click', startGame);
        playAgainButton.addEventListener('click', startGame);
    }

    // Function to start the game
    function startGame(): void {
        // Check if necessary elements exist
        if (startButton && gameContainer && resultDiv && playAgainButton && moveCounterDisplay && wonCounterDisplay && lostCounterDisplay && timerDisplay) {
            // Hide start button and display game elements
            startButton.style.display = 'none';
            gameContainer.style.display = 'grid';
            resultDiv.style.display = 'none';
            playAgainButton.style.display = 'none'; // Hide Play Again button
            moveCounterDisplay.style.display = 'block'; // Show move counter
            wonCounterDisplay.style.display = 'block'; // Show won counter
            lostCounterDisplay.style.display = 'block'; // Show lost counter
            timerDisplay.style.display = 'block'; // Show timer

            // Initialize the game
            initializeGame();
        }
    }

    // Function to initialize the game state
    function initializeGame(): void {
        // Reset game state and create cards
        resetGame();
        cards = createCards();
        startTime = Date.now();

        // Add click events to each card
        cards.forEach((card, index) => {
            card.addEventListener('click', () => handleCardClick(index));
        });

        // Update the timer every second
        timerInterval = setInterval(updateTimerDisplay, 1000);

        // Render the initial game state
        renderGame();
    }

    // Function to reset the game state
    function resetGame(): void {
        // Reset game variables
        moves = 0;
        flippedCards = [];
        matchedPairs = 0;

        // Clear any existing timer
        clearInterval(timerInterval);

        // Update move counter and timer displays
        updateMoveCounterDisplay();
        updateTimerDisplay();
    }

    // Function to create cards and shuffle them
    function createCards(): NodeListOf<Element> {
        const cardContainer = document.getElementById('memory-game');
        const uniqueLetters = ['A', 'B', 'C'];
        const letters = [...uniqueLetters, ...uniqueLetters].sort(() => Math.random() - 0.5);

        // Check if the card container exists
        if (cardContainer) {
            // Clear the container and create cards
            cardContainer.innerHTML = '';

            for (let i = 0; i < cardCount; i++) {
                const card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('data-index', i.toString());
                card.setAttribute('data-letter', letters[i]);
                cardContainer.appendChild(card);
            }

            // Return the list of cards
            return document.querySelectorAll('.card');
        }

        // Return an empty list if the card container is not found
        return document.querySelectorAll('.card');
    }

    // Function to handle card clicks
    function handleCardClick(index: number): void {
        const selectedCard = cards[index];

        // Check if the selected card is valid
        if (selectedCard && !flippedCards.includes(selectedCard) && flippedCards.length < 2) {
            const letter = selectedCard.getAttribute('data-letter');

            // Show the letter on the card
            selectedCard.textContent = letter;

            // Add the card to the flipped cards array
            flippedCards.push(selectedCard);

            // Check if two cards are flipped
            if (flippedCards.length === 2) {
                const [firstCard, secondCard] = flippedCards;
                const firstLetter = firstCard.getAttribute('data-letter');
                const secondLetter = secondCard.getAttribute('data-letter');

                // Check if the letters match
                if (firstLetter === secondLetter) {
                    // Matched pair, keep the cards flipped
                    matchedPairs++;
                } else {
                    // Not a match, hide the letters after a short delay
                    setTimeout(() => {
                        firstCard.textContent = '';
                        secondCard.textContent = '';
                    }, 100);
                }

                // Clear flipped cards array
                flippedCards = [];

                // Update move counter
                updateMoveCounter();

                // Check if all pairs are matched or if the maximum moves are reached
                if (matchedPairs === cardCount / 2) {
                    endGame(true); // Player won
                } else if (moves >= maxMoves) {
                    endGame(false); // Player lost
                }
            }
        }
    }

    // Function to render the game state
    function renderGame(): void {
        // Handle rendering logic here
        // You can update the visual appearance of cards or any other game elements
    }

    // Function to update the move counter
    function updateMoveCounter(): void {
        moves++;
        // Update move counter display
        updateMoveCounterDisplay();
    }

    // Function to update the move counter display
    function updateMoveCounterDisplay(): void {
        const moveCounterDisplay = document.getElementById('moveCounter');
        if (moveCounterDisplay) {
            moveCounterDisplay.textContent = `Moves: ${moves}`;
        }
    }

    // Function to update the timer display
    function updateTimerDisplay(): void {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        if (timerDisplay) {
            timerDisplay.textContent = `Time: ${elapsedSeconds} seconds`;
        }
    }

    // Function to end the game
    function endGame(isWin: boolean): void {
        // Stop the timer
        clearInterval(timerInterval);

        // Check if necessary elements exist
        if (resultDiv && gameContainer && playAgainButton && moveCounterDisplay && wonCounterDisplay && lostCounterDisplay && timerDisplay) {
            // Display the game result and show relevant elements
            resultDiv.textContent = isWin
                ? `Congratulations! You won in ${moves} moves and ${timerDisplay.textContent}!`
                : 'Game over. You lost.';
            resultDiv.style.display = 'block';
            gameContainer.style.display = 'none';
            playAgainButton.style.display = 'block'; // Show Play Again button
            moveCounterDisplay.style.display = 'none'; // Hide move counter
            wonCounterDisplay.style.display = 'block'; // Show won counter
            lostCounterDisplay.style.display = 'block'; // Show lost counter
            timerDisplay.style.display = 'none'; // Hide timer

            // Update won/lost counters
            if (isWin) {
                wonCount++;
            } else {
                lostCount++;
            }

            // Update won and lost counter displays
            wonCounterDisplay.textContent = `Won: ${wonCount}`;
            lostCounterDisplay.textContent = `Lost: ${lostCount}`;
        }
    }
});







