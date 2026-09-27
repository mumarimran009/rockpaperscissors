(function(){
  const EMOJI = {rock:'✊', paper:'✋', scissors:'✌️'};
  const BEATS = {rock:'scissors', paper:'rock', scissors:'paper'};

  const modeSelect = document.getElementById('mode-select');
  const game = document.getElementById('game');
  const nameA = document.getElementById('name-a');
  const nameB = document.getElementById('name-b');
  const scoreA = document.getElementById('score-a');
  const scoreB = document.getElementById('score-b');
  const roundEl = document.getElementById('round');
  const handA = document.getElementById('hand-a');
  const handB = document.getElementById('hand-b');
  const prompt = document.getElementById('prompt');
  const choicesWrap = document.getElementById('choices');
  const choiceBtns = Array.from(document.querySelectorAll('.choice'));
  const passScreen = document.getElementById('pass-screen');
  const passName = document.getElementById('pass-name');
  const passContinue = document.getElementById('pass-continue');
  const resultBox = document.getElementById('result');
  const resultText = document.getElementById('result-text');
  const nextRoundBtn = document.getElementById('next-round');
  const resetBtn = document.getElementById('reset');

  let mode = null;
  let scores = {a:0, b:0};
  let round = 1;
  let pickA = null, pickB = null;

  function showPanel(which){
    modeSelect.classList.toggle('hidden', which !== 'mode');
    game.classList.toggle('hidden', which !== 'game');
  }

  function startGame(m){
    mode = m;
    scores = {a:0, b:0};
    round = 1;
    nameA.textContent = 'You';
    nameB.textContent = mode === 'bot' ? 'Bot' : 'Player 2';
    if(mode === '2p') nameA.textContent = 'Player 1';
    updateScoreboard();
    showPanel('game');
    beginRound();
  }

  function updateScoreboard(){
    scoreA.textContent = scores.a;
    scoreB.textContent = scores.b;
    roundEl.textContent = round;
  }

  function resetHands(){
    handA.textContent = '❔';
    handB.textContent = '❔';
    handA.className = 'hand';
    handB.className = 'hand';
  }

  function beginRound(){
    pickA = null; pickB = null;
    resetHands();
    resultBox.classList.add('hidden');
    passScreen.classList.add('hidden');
    choicesWrap.classList.remove('hidden');
    choiceBtns.forEach(b => b.disabled = false);
    if(mode === 'bot'){
      prompt.textContent = 'Your move';
    } else {
      prompt.textContent = nameA.textContent + ', choose your move';
    }
  }

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      choiceBtns.forEach(b => b.disabled = true);

      if(mode === 'bot'){
        pickA = choice;
        handA.textContent = EMOJI[choice];
        prompt.textContent = 'Bot is thinking…';
        handB.classList.add('shake');
        setTimeout(() => {
          pickB = ['rock','paper','scissors'][Math.floor(Math.random()*3)];
          handB.classList.remove('shake');
          reveal();
        }, 700);
      } else {
        if(pickA === null){
          pickA = choice;
          choicesWrap.classList.add('hidden');
          passName.textContent = nameB.textContent;
          passScreen.classList.remove('hidden');
        } else {
          pickB = choice;
          reveal();
        }
      }
    });
  });

  passContinue.addEventListener('click', () => {
    passScreen.classList.add('hidden');
    choicesWrap.classList.remove('hidden');
    choiceBtns.forEach(b => b.disabled = false);
    prompt.textContent = nameB.textContent + ', choose your move';
  });

  function reveal(){
    handA.textContent = EMOJI[pickA];
    handB.textContent = EMOJI[pickB];
    choicesWrap.classList.add('hidden');

    let outcome; // 'a', 'b', or 'draw'
    if(pickA === pickB) outcome = 'draw';
    else if(BEATS[pickA] === pickB) outcome = 'a';
    else outcome = 'b';

    if(outcome === 'a'){
      scores.a++;
      handA.classList.add('win-glow');
      handB.classList.add('lose-dim');
    } else if(outcome === 'b'){
      scores.b++;
      handB.classList.add('win-glow');
      handA.classList.add('lose-dim');
    }
    updateScoreboard();

    resultText.className = '';
    if(outcome === 'draw'){
      resultText.textContent = "It's a draw — " + EMOJI[pickA] + ' meets ' + EMOJI[pickB];
      resultText.classList.add('draw');
    } else {
      const winnerName = outcome === 'a' ? nameA.textContent : nameB.textContent;
      resultText.textContent = winnerName + ' wins this round!';
      resultText.classList.add(outcome === 'a' ? 'win' : 'lose');
    }
    resultBox.classList.remove('hidden');
  }

  nextRoundBtn.addEventListener('click', () => {
    round++;
    beginRound();
  });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => startGame(btn.dataset.mode));
  });

  resetBtn.addEventListener('click', () => {
    showPanel('mode');
  });
})();
