import '/css/app.css';
import { Storage, createNode, formatTime } from '@jamesrock/rockjs';
import { KeyBoard } from './KeyBoard';
import { isApp } from './utils';
import { getWord } from './words';

const limit = 10;
const storage = new Storage('me.jamesrock.jumble');
let best = storage.get('best') || 0;
// console.log('best', best);

let word = null;
let input = '';
let count = 0;
let time = 0;
let display = null;
let keyboard = null;
let gameOver = false;

const check = () => {
  return input === word;
};

const render = () => {

  if(!gameOver) {
    const splitInput = input.split('');
    display.innerHTML = `<div class="word">${word.split('').map((char, index) => {
      return splitInput[index]===char ? `<span class="letter complete">${char}</span>` : `<span class="letter incomplete">${char}</span>`;
    }).join('')}</div>`;
    requestAnimationFrame(render);
  };

  if(count===limit) {
    setTimeout(() => {
      showGameOverScreen();
    }, 250);
  };
  
};

const type = (key) => {

  if(key[1]===-1) {
    word = getWord();
    input = '';
  }
  else if(word.split('')[input.length]===key[0]) {
    input += key[0];
  };

  // console.log(input);
  
  if(check()) {
    count ++;
    setTimeout(() => {
      word = getWord();
      input = '';
    }, 500);
  };
  
};

const start = () => {

  if(display && keyboard) {
    document.body.removeChild(display);
    keyboard.removeFrom(document.body);
  };

  gameOverScreen.setAttribute('data-show', false);

  gameOver = false;
  display = createNode('div', 'display');
  keyboard = new KeyBoard(type);
  time = Date.now();
  count = 0;
  input = '';
  word = getWord();

  document.body.append(display);
  keyboard.renderTo(document.body);
  
  render();

  // console.log(keyboard);

};

const showGameOverScreen = () => {
  gameOver = true;
  const now = Date.now();
  const duration = (now - time);
  if(best===0 || duration<best) {
    best = duration;
    storage.set('best', best);
  };
  gameOverScreen.innerHTML = `<div class="game-over-body">\
    <h2>Game over!</h2>\
    <p class="time">Time: ${formatTime(duration)}</p>\
    <p class="best">Best: ${formatTime(best)}</p>\
    <p class="retry">Tap to try again.</p>\
  </div>`;
  gameOverScreen.setAttribute('data-show', true);
};

const root = document.querySelector(':root');
const maxKeySize = 60;
let keySize = Math.floor((window.innerWidth - 20) / 10);
keySize = keySize > maxKeySize ? maxKeySize : keySize;

const gameOverScreen = createNode('div', 'game-over');
gameOverScreen.addEventListener('click', () => {
  start();
});

document.body.appendChild(gameOverScreen);

root.style.setProperty('--key-size', `${keySize}px`);
root.style.setProperty('--key-size-height', `${keySize*1.25}px`);
root.style.setProperty('--key-font-size', `${keySize-10}px`);
root.style.setProperty('--key-active-font-size', `${keySize-14}px`);
root.style.setProperty('--keyboard-bottom', `${isApp ? 70 : 10}px`);
root.style.setProperty('--body-padding', `${(keySize * 3) + 100}px`);
root.style.setProperty('--time-top', `${isApp ? 100 : 50}px`);

start();

document.addEventListener('touchstart', () => {}, false);
