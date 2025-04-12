import './style.css';

document.querySelector('#app').innerHTML = `
  <div class ="container">
    <div class="main">
      <img src = "e.png" alt = "Tessera"  class="sideImage">
      <div class="center">
        <div class ="header">
          <h1>Mechinadle</h1>
        </div>
      <div class="center2">
        <br>
        <div class="lyrics">
          <p>Lyrics:</p>
            <p id="lyrics0"></p>
            <p id="lyrics1"></p>
            <p id="lyrics2"></p>
            <p id="lyrics3"></p>
            <p id="lyrics4"></p>
            <p id="lyrics5"></p>
          </div>
          <div class="hints">
            <p id = "guesses", class="guesses">Your guesses:</p>
            <div id="guess0"></div>
            <div id="guess1"></div>
            <div id="guess2"></div>
            <div id="guess3"></div>
            <div id="guess4"></div>
          </div>
          <div class="card">
            <p>Guess the song:</p>
            <input type="text" id="songInput" placeholder="Enter song name">
            <button id="send" type="button">Send</button>
            <div id="suggestions" class="suggestions-box"></div>
            <div id="guessCount" class = "guesses">Guesses remaining: 5</div>
            <div id="messageBox" class="message-box"></div>
        </div>
      </div>
      </div>
      <img src = "Tessera_32.png" alt = "Tessea" class="sideImage">
    </div>

  </div>
`;

let currentSong = null;
let currentGuesses = 0;
const MAX_GUESSES = 5;
let availableLines = [];
let randomLineIndex;
let lines = [];
window.addEventListener('DOMContentLoaded', () => {
  
  const today = new Date().toISOString().slice(0, 10);
  const seed = parseInt(today.replace(/-/g, ''), 10); // Use date as seed
  Math.seedrandom(seed);

  // Fetch the songs JSON file from the src directory
  fetch('./songs.json')
    .then((response) => response.json())
    .then((songs) => {
      const randomIndex = Math.floor(Math.random() * songs.length * 1.0) % songs.length; // Random index based on seed
      currentSong = songs[randomIndex]; // Store the random song
      
      // Get all lines from the song
      lines = [];
      let i = 0;
      while (currentSong[`line${i}`] !== undefined) {
        lines.push(currentSong[`line${i}`]);
        i++;
      }
      
      availableLines = lines;
      // Remove the last 12 lines from consideration
      if(lines.length > 12) {
        availableLines = lines.slice(0, -12);
        randomLineIndex = Math.floor((Math.random() * availableLines.length) % availableLines.length);
      }else{
        availableLines = lines;
        randomLineIndex = 0;
      }      
      
      document.getElementById('lyrics0').innerText = lines[randomLineIndex ] + "\n" + lines[randomLineIndex + 1];
      console.log('Current song:', currentSong);
    })
    .catch((error) => {
      console.error('Error loading the JSON:', error);
      document.getElementById('lyrics0').innerText = 'Error loading song';
    });

  // Button click event listener
  document.getElementById('send').addEventListener('click', sendGuess);
});

let songsList = [];

window.addEventListener('DOMContentLoaded', () => {
  // Fetch the songs JSON file from the src directory
  fetch('./songs.json')
    .then((response) => response.json())
    .then((songs) => {
      songsList = songs.map(song => ({
        name: song.name,
        album: song.album
      }));
      // Handle the input field typing for suggestions
      const songInput = document.getElementById('songInput');
      const suggestionsBox = document.getElementById('suggestions');
      songInput.addEventListener('input', () => {
        const query = songInput.value.trim().toLowerCase();
        
        // Filter songs based on input
        const filteredSongs = songsList.filter(song =>
          song.name.toLowerCase().includes(query)
        );
        // Clear previous suggestions
        suggestionsBox.innerHTML = '';

        if (query.length > 0 && filteredSongs.length > 0) {
          // Show filtered suggestions
          filteredSongs.forEach(song => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.innerText = song.name;
            suggestionItem.addEventListener('click', () => {
              songInput.value = song.name;
              suggestionsBox.innerHTML = '';
            });
            suggestionsBox.appendChild(suggestionItem);
          });

          suggestionsBox.style.display = 'block'; // Show suggestion box
        } else {
          suggestionsBox.style.display = 'none'; // Hide suggestion box if no match
        }
      });
      // Hide suggestions when clicking outside
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.card')) {
          suggestionsBox.style.display = 'none';
        }
      });
    })
    .catch((error) => {
      console.error('Error loading the JSON:', error);
    });
});


document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('send').click();
  }
});
function sendGuess() {
  const userGuess = document.getElementById('songInput').value.trim().toLowerCase();
  const userGuessOriginal = document.getElementById('songInput').value.trim();
  const guessedSong = songsList.find(song => song.name.toLowerCase() === userGuess);
  
  if (!guessedSong) {
    return;  // If guessed song is not in the list, do nothing
  } else {
    document.getElementById("messageBox").style.display = "block";
    document.getElementById("guesses").style.display = "block";
    document.getElementById("guessCount").style.display = "block";
    
    if (!currentSong) {
      showMessage('Please wait for the song to load');
      return;
    }
    
    // Display the current guess
    document.getElementById("guess" + currentGuesses.toString()).innerHTML = (currentGuesses + 1).toString() + '. ' + userGuessOriginal + ' ';

    // Check if the album is correct
    if (guessedSong.album === currentSong.album) {
      document.getElementById("guess" + currentGuesses.toString()).innerHTML += ' (correct album)';
    }

    // Check if the guess is correct
    if (userGuess === currentSong.name.toLowerCase()) {
      document.getElementById("guess" + currentGuesses.toString()).innerHTML += ' (correct song)';
      showMessage('Correct!');
      document.getElementById('messageBox').style.backgroundColor = 'green'; 
      document.getElementById('send').disabled = true;
    } else {
      currentGuesses++;
      document.getElementById('guessCount').innerText = `Guesses remaining: ${MAX_GUESSES - currentGuesses}`;
      
      // If the maximum guesses are reached, game over
      if (currentGuesses >= MAX_GUESSES) {
        showMessage(`Game Over! The song was "${currentSong.name}"`);
        return;
      }
      try{
        let line1 = lines[randomLineIndex + currentGuesses * 2];
        let line2 = lines[randomLineIndex + currentGuesses * 2 + 1];
        document.getElementById(`lyrics${currentGuesses}`).innerText = (line1 || '') + "\n" + (line2 || '');
      }catch(e){
        alert("Error: " + e);
      }

      showMessage('Wrong! Try again');
    }
  }
  
  // Clear input field
  document.getElementById('songInput').value = '';
}

function showMessage(message) {
  const messageBox = document.getElementById('messageBox');
  messageBox.innerText = message;
}
