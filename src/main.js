import './style.css';

document.querySelector('#app').innerHTML = `
  <div class ="container">
    <div class="main">
      <img src = "e.png" alt = "Tessera"  class="sideImage">
      <div class="center">
        <div class ="header">
          <h1>Mechinadle</h1>
          <h2 id="modeTitle">Daily Challenge</h2>
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
            <p id="guesses" class="guesses">Your guesses:</p>
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
            <div id="guessCount" class="guesses">Guesses remaining: 5</div>
            <div id="messageBox" class="message-box"></div>
            <button id="nextSong" style="display:none;">Next Song</button>
            <button id="modeToggle">Switch to Random Mode</button>
          </div>
          <p id="dailyStreakDisplay" class = "score" >Daily Streak: 0</p>
          <p id="streakDisplay" class = "score" >Current Random Streak: 0</p>
        </div>
      </div>
      <img src = "Tessera_32.png" alt = "Tessea" class="sideImage">
    </div>
  </div>
`;

let currentSong = null;
let currentGuesses = 0;
const MAX_GUESSES = 5;
let lines = [];
let randomLineIndex;
let songsList = [];
let isRandomMode = false;

let randomGameNumber = getCookie('randomGameNumber') ? parseInt(getCookie('randomGameNumber')) : 0;
let playerStreak = getCookie('playerStreak') ? parseInt(getCookie('playerStreak')) : 0;
let dailyStreak = getCookie('dailyStreak') ? parseInt(getCookie('dailyStreak')) : 0;
let lastDailyDate = getCookie('lastDailyDate') || '';

function setCookie(name, value, days = 365) {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 24 * 60 * 60}`;
}
function getCookie(name) {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return match ? match.pop() : '';
}

const today = new Date().toISOString().slice(0, 10);
const seed = parseInt(today.replace(/-/g, ''), 10);


function loadSong() {
  fetch('./songs.json')
    .then((res) => res.json())
    .then((songs) => {
      songsList = songs.map(song => ({ name: song.name, album: song.album }));
      let index;
      if (isRandomMode) {
        Math.seedrandom(randomGameNumber);
        index = Math.floor(Math.random() * songs.length) % songs.length;
      } else {
        Math.seedrandom(seed);
        index = Math.floor(Math.random() * songs.length);
      }
      

      currentSong = songs[index];
      lines = [];
      let i = 0;
      while (currentSong[`line${i}`] !== undefined) {
        lines.push(currentSong[`line${i}`]);
        i++;
      }
      currentGuesses = 0;
      document.getElementById('send').disabled = false;
      document.getElementById('nextSong').style.display = 'none';
      document.getElementById('guesses').style.display = 'none';
      document.getElementById('messageBox').style.display = 'none';
      document.getElementById('guessCount').style.display = 'none';
      for (let j = 0; j < 6; j++) {
        const lyr = document.getElementById(`lyrics${j}`);
        if (lyr) lyr.innerText = '';
      }
      for (let j = 0; j < 5; j++) {
        const g = document.getElementById(`guess${j}`);
        if (g) g.innerText = '';
      }

      randomLineIndex = lines.length > 12 ? Math.floor(Math.random() * (lines.length - 12)) : 0;
      document.getElementById('lyrics0').innerText = lines[randomLineIndex] + "\n" + lines[randomLineIndex + 1];
      
      if(lastDailyDate == today && !isRandomMode){
        showFullLyrics();            
        document.getElementById("guess" + currentGuesses).innerHTML += ' You already guessed this song today. It was "' + currentSong.name + '"';
        showMessage('Correct!');
        document.getElementById('messageBox').style.backgroundColor = 'green';
        document.getElementById('send').disabled = true;

        showFullLyrics();

        if (!isRandomMode) {
          document.getElementById('modeToggle').innerText = "Switch to Random Mode";
          document.getElementById('nextSong').style.display = 'none';
        } else {
          document.getElementById('nextSong').style.display = 'inline-block';
        }    
      }
    })
    .catch((err) => {
      document.getElementById('lyrics0').innerText = 'Error loading song';
      console.error(err);
    });
}

function sendGuess() {
  const input = document.getElementById('songInput');
  const userGuess = input.value.trim().toLowerCase();
  const userGuessOriginal = input.value.trim();
  const guessedSong = songsList.find(song => song.name.toLowerCase() === userGuess);

  if (!guessedSong) return;

  document.getElementById("messageBox").style.display = "block";
  document.getElementById("guesses").style.display = "block";
  document.getElementById("guessCount").style.display = "block";

  if (!currentSong) {
    showMessage('Please wait for the song to load');
    return;
  }

  document.getElementById("guess" + currentGuesses).innerHTML = `${currentGuesses + 1}. ${userGuessOriginal}`;

  if (guessedSong.album === currentSong.album) {
    document.getElementById("guess" + currentGuesses).innerHTML += ' (correct album)';
  }

  if (userGuess === currentSong.name.toLowerCase()) {
    document.getElementById("guess" + currentGuesses).innerHTML += ' (correct song)';
    showMessage('Correct!');
    document.getElementById('messageBox').style.backgroundColor = 'green';
    document.getElementById('send').disabled = true;

    if (!isRandomMode) {
      const todayStr = new Date().toISOString().slice(0, 10);
      if (lastDailyDate !== todayStr) {
        dailyStreak++;
        lastDailyDate = todayStr;
        setCookie('dailyStreak', dailyStreak);
        setCookie('lastDailyDate', todayStr);
      }
    }else{
      randomGameNumber++;
      setCookie('randomGameNumber', randomGameNumber);
      playerStreak++;
      setCookie('playerStreak', playerStreak);
    }

    // Show full lyrics when correct answer is given
    showFullLyrics();

    if (!isRandomMode) {
      document.getElementById('modeToggle').innerText = "Switch to Random Mode";
      document.getElementById('nextSong').style.display = 'none';
    } else {
      document.getElementById('nextSong').style.display = 'inline-block';
    }
  } else {
    currentGuesses++;
    document.getElementById('guessCount').innerText = `Guesses remaining: ${MAX_GUESSES - currentGuesses}`;
    if (currentGuesses >= MAX_GUESSES) {
      showMessage(`Game Over! The song was "${currentSong.name}"`);
      showFullLyrics(); // Show full lyrics when the game ends

      if (!isRandomMode) {
        dailyStreak = 0;
        setCookie('dailyStreak', 0);
      }else{
        playerStreak = 0;
        setCookie('playerStreak', playerStreak);
      }

      document.getElementById('nextSong').style.display = 'inline-block';
      document.getElementById('streakDisplay').innerText = `Current Random Streak: ${playerStreak}`;
      document.getElementById('dailyStreakDisplay').innerText = `Daily Streak: ${dailyStreak}`;
      input.value = '';
      return;
    }
    try {
      const l1 = lines[randomLineIndex + currentGuesses * 2] || '';
      const l2 = lines[randomLineIndex + currentGuesses * 2 + 1] || '';
      document.getElementById(`lyrics${currentGuesses}`).innerText = `${l1}\n${l2}`;
    } catch (e) {
      alert("Error: " + e);
    }
    showMessage('Wrong! Try again');
  }

  document.getElementById('streakDisplay').innerText = `Current Random Streak: ${playerStreak}`;
  document.getElementById('dailyStreakDisplay').innerText = `Daily Streak: ${dailyStreak}`;
  input.value = '';
}

function showFullLyrics() {
  // Display all the lyrics starting from line0 until the last defined line
  let i = 0;
  document.getElementById(`lyrics0`).innerText = '';
  document.getElementById(`lyrics1`).innerText = '';
  document.getElementById(`lyrics2`).innerText = '';
  document.getElementById(`lyrics3`).innerText = '';
  document.getElementById(`lyrics4`).innerText = '';
  document.getElementById(`lyrics5`).innerText = '';
  while (currentSong[`line${i}`] !== undefined) {
    const lyricElement = document.getElementById(`lyrics0`);
    if (lyricElement) {
      lyricElement.innerText +=  '\n' + currentSong[`line${i}`];
    }
    i++;
  }
}



function showMessage(msg) {
  document.getElementById('messageBox').innerText = msg;
  document.getElementById('streakDisplay').innerText = `Current Random Streak: ${playerStreak}`;
  document.getElementById('dailyStreakDisplay').innerText = `Daily Streak: ${dailyStreak}`;
}

document.getElementById('send').addEventListener('click', sendGuess);
document.getElementById('songInput').addEventListener('input', () => {
  const query = document.getElementById('songInput').value.trim().toLowerCase();
  const suggestionsBox = document.getElementById('suggestions');
  const filtered = songsList.filter(song => song.name.toLowerCase().includes(query));

  suggestionsBox.innerHTML = '';
  if (query && filtered.length) {
    filtered.forEach(song => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.innerText = song.name;
      div.onclick = () => {
        document.getElementById('songInput').value = song.name;
        suggestionsBox.innerHTML = '';
      };
      suggestionsBox.appendChild(div);
    });
    suggestionsBox.style.display = 'block';
  } else {
    suggestionsBox.style.display = 'none';
  }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.card')) document.getElementById('suggestions').style.display = 'none';
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendGuess();
  }
});

document.getElementById('modeToggle').addEventListener('click', () => {
  isRandomMode = !isRandomMode;
  document.getElementById(`lyrics0`).innerText = 'Shuffling...';
  document.getElementById(`lyrics1`).innerText = '';
  document.getElementById(`lyrics2`).innerText = '';
  document.getElementById(`lyrics3`).innerText = '';
  document.getElementById(`lyrics4`).innerText = '';
  document.getElementById(`lyrics5`).innerText = '';
  document.getElementById('modeToggle').innerText = isRandomMode ? "Switch to Daily Mode" : "Switch to Random Mode";
  document.getElementById('modeTitle').innerText = isRandomMode ? "Random Mode" : "Daily Challenge";
  loadSong();
});

document.getElementById('nextSong').addEventListener('click', () => {
  if (!isRandomMode) {
    isRandomMode = true;
    document.getElementById('modeToggle').innerText = "Switch to Daily Mode";
    document.getElementById('modeTitle').innerText = "Random Mode";
  }else{
    document.getElementById('nextSong').style.display = 'none';
  }
  randomGameNumber++;
  setCookie('randomGameNumber', randomGameNumber);
  loadSong();
});

document.getElementById('streakDisplay').innerText = `Current Random Streak: ${playerStreak}`;
document.getElementById('dailyStreakDisplay').innerText = `Daily Streak: ${dailyStreak}`;
loadSong();
