(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const d of e)if(d.type==="childList")for(const B of d.addedNodes)B.tagName==="LINK"&&B.rel==="modulepreload"&&s(B)}).observe(document,{childList:!0,subtree:!0});function l(e){const d={};return e.integrity&&(d.integrity=e.integrity),e.referrerPolicy&&(d.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?d.credentials="include":e.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function s(e){if(e.ep)return;e.ep=!0;const d=l(e);fetch(e.href,d)}})();document.querySelector("#app").innerHTML=`
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
`;let r=null,i=0;const S=5;let a=[],p,x=[],o=!1,E=y("randomGameNumber")?parseInt(y("randomGameNumber")):0,c=y("playerStreak")?parseInt(y("playerStreak")):0,u=y("dailyStreak")?parseInt(y("dailyStreak")):0,f=y("lastDailyDate")||"";function m(t,n,l=365){document.cookie=`${t}=${n}; path=/; max-age=${l*24*60*60}`}function y(t){const n=document.cookie.match("(^|;)\\s*"+t+"\\s*=\\s*([^;]+)");return n?n.pop():""}const T=new Date().toISOString().slice(0,10),k=parseInt(T.replace(/-/g,""),10);function h(){fetch("./songs.json").then(t=>t.json()).then(t=>{x=t.map(s=>({name:s.name,album:s.album}));let n;o?(Math.seedrandom(E),n=Math.floor(Math.random()*t.length)%t.length):(Math.seedrandom(k),n=Math.floor(Math.random()*t.length)),r=t[n],a=[];let l=0;for(;r[`line${l}`]!==void 0;)a.push(r[`line${l}`]),l++;i=0,document.getElementById("send").disabled=!1,document.getElementById("nextSong").style.display="none",document.getElementById("guesses").style.display="none",document.getElementById("messageBox").style.display="none",document.getElementById("guessCount").style.display="none";for(let s=0;s<6;s++){const e=document.getElementById(`lyrics${s}`);e&&(e.innerText="")}for(let s=0;s<5;s++){const e=document.getElementById(`guess${s}`);e&&(e.innerText="")}p=a.length>12?Math.floor(Math.random()*(a.length-12)):0,document.getElementById("lyrics0").innerText=a[p]+`
`+a[p+1],f==T&&!o&&(I(),document.getElementById("guess"+i).innerHTML+=' You already guessed this song today. It was "'+r.name+'"',g("Correct!"),document.getElementById("messageBox").style.backgroundColor="green",document.getElementById("send").disabled=!0,I(),o?document.getElementById("nextSong").style.display="inline-block":(document.getElementById("modeToggle").innerText="Switch to Random Mode",document.getElementById("nextSong").style.display="none"))}).catch(t=>{document.getElementById("lyrics0").innerText="Error loading song",console.error(t)})}function v(){const t=document.getElementById("songInput"),n=t.value.trim().toLowerCase(),l=t.value.trim(),s=x.find(e=>e.name.toLowerCase()===n);if(s){if(document.getElementById("messageBox").style.display="block",document.getElementById("guesses").style.display="block",document.getElementById("guessCount").style.display="block",!r){g("Please wait for the song to load");return}if(document.getElementById("guess"+i).innerHTML=`${i+1}. ${l}`,s.album===r.album&&(document.getElementById("guess"+i).innerHTML+=" (correct album)"),n===r.name.toLowerCase()){if(document.getElementById("guess"+i).innerHTML+=" (correct song)",g("Correct!"),document.getElementById("messageBox").style.backgroundColor="green",document.getElementById("send").disabled=!0,o)E++,m("randomGameNumber",E),c++,m("playerStreak",c);else{const e=new Date().toISOString().slice(0,10);f!==e&&(u++,f=e,m("dailyStreak",u),m("lastDailyDate",e))}I(),o?document.getElementById("nextSong").style.display="inline-block":(document.getElementById("modeToggle").innerText="Switch to Random Mode",document.getElementById("nextSong").style.display="none")}else{if(i++,document.getElementById("guessCount").innerText=`Guesses remaining: ${S-i}`,i>=S){g(`Game Over! The song was "${r.name}"`),I(),o?(c=0,m("playerStreak",c)):(u=0,m("dailyStreak",0)),document.getElementById("nextSong").style.display="inline-block",document.getElementById("streakDisplay").innerText=`Current Random Streak: ${c}`,document.getElementById("dailyStreakDisplay").innerText=`Daily Streak: ${u}`,t.value="";return}try{const e=a[p+i*2]||"",d=a[p+i*2+1]||"";document.getElementById(`lyrics${i}`).innerText=`${e}
${d}`}catch(e){alert("Error: "+e)}g("Wrong! Try again")}document.getElementById("streakDisplay").innerText=`Current Random Streak: ${c}`,document.getElementById("dailyStreakDisplay").innerText=`Daily Streak: ${u}`,t.value=""}}function I(){let t=0;for(document.getElementById("lyrics0").innerText="",document.getElementById("lyrics1").innerText="",document.getElementById("lyrics2").innerText="",document.getElementById("lyrics3").innerText="",document.getElementById("lyrics4").innerText="",document.getElementById("lyrics5").innerText="";r[`line${t}`]!==void 0;){const n=document.getElementById("lyrics0");n&&(n.innerText+=`
`+r[`line${t}`]),t++}}function g(t){document.getElementById("messageBox").innerText=t,document.getElementById("streakDisplay").innerText=`Current Random Streak: ${c}`,document.getElementById("dailyStreakDisplay").innerText=`Daily Streak: ${u}`}document.getElementById("send").addEventListener("click",v);document.getElementById("songInput").addEventListener("input",()=>{const t=document.getElementById("songInput").value.trim().toLowerCase(),n=document.getElementById("suggestions"),l=x.filter(s=>s.name.toLowerCase().includes(t));n.innerHTML="",t&&l.length?(l.forEach(s=>{const e=document.createElement("div");e.className="suggestion-item",e.innerText=s.name,e.onclick=()=>{document.getElementById("songInput").value=s.name,n.innerHTML=""},n.appendChild(e)}),n.style.display="block"):n.style.display="none"});document.addEventListener("click",t=>{t.target.closest(".card")||(document.getElementById("suggestions").style.display="none")});document.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),v())});document.getElementById("modeToggle").addEventListener("click",()=>{o=!o,document.getElementById("lyrics0").innerText="Shuffling...",document.getElementById("lyrics1").innerText="",document.getElementById("lyrics2").innerText="",document.getElementById("lyrics3").innerText="",document.getElementById("lyrics4").innerText="",document.getElementById("lyrics5").innerText="",document.getElementById("modeToggle").innerText=o?"Switch to Daily Mode":"Switch to Random Mode",document.getElementById("modeTitle").innerText=o?"Random Mode":"Daily Challenge",h()});document.getElementById("nextSong").addEventListener("click",()=>{o?document.getElementById("nextSong").style.display="none":(o=!0,document.getElementById("modeToggle").innerText="Switch to Daily Mode",document.getElementById("modeTitle").innerText="Random Mode"),E++,m("randomGameNumber",E),h()});document.getElementById("streakDisplay").innerText=`Current Random Streak: ${c}`;document.getElementById("dailyStreakDisplay").innerText=`Daily Streak: ${u}`;h();
