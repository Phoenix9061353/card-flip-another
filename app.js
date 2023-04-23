let cards = document.querySelectorAll('.card');
let cardsBackSide = document.querySelectorAll('.card__side-back');
const btnStart = document.querySelector('.btn--start');
const btnRetry = document.querySelector('.btn--retry');
const cardContainer = document.querySelector('.card-container');
const turnPlayer = document.querySelector('.turn__player');
const turnComputer = document.querySelector('.turn__computer');
const mask = document.querySelector('.mask');

const cardSet = [
  { name: 'card-1', id: 1 },
  { name: 'card-2', id: 2 },
  { name: 'card-3', id: 3 },
  { name: 'card-4', id: 4 },
  { name: 'card-5', id: 5 },
  { name: 'card-6', id: 6 },
];
let cardPlaySet = cardSet.concat(cardSet);
let cardComputerSet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let anotherSetForComp;

let firstCard, secondCard, previousSelect;
let targetC, targetCardC;
let turn = true;
let scoreP = 0,
  scoreC = 0,
  matched = 0,
  flipCounter = 0;

//////////////////////////////////////
//Function

//Shuffle Cards
const shuffleCards = function (cardSet) {
  for (let i = cardSet.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
};

//Set Card (Only Back side, after shuffle cards)
const setCards = function () {
  cardsBackSide.forEach((b, i) => {
    b.classList.add(`card__side-back-${cardPlaySet[i].id}`);
    cards[i].dataset.name = cardPlaySet[i].name;
    cards[i].id = i;
  });
};

//Reset card tool
const resetCardTool = function () {
  [firstCard, secondCard, previousSelect, targetC, targetCardC] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  flipCounter = 0;
  anotherSetForComp = [];
};

//Reset card(after wrong selected)
const resetCard = function () {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetCardTool();

    turnChange();
  }, 200);
};

//reStart Whole Game
const restart = function () {
  btnRetry.classList.remove('hide');
  cardContainer.classList.add('hide');
  cards.forEach((c, i) => {
    c.classList.remove('flip', 'matched');
    cardsBackSide[i].className = 'card__side card__side-back';
  });

  btnRetry.addEventListener('click', playGame);
};

//Deal with matched cards
const isMatched = function (turn) {
  setTimeout(() => {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    cardComputerSet = cardComputerSet.filter(
      (c) => c !== Number(firstCard.id) && c !== Number(secondCard.id)
    );
    resetCardTool();
    turn ? (scoreP += 1) : (scoreC += 1);
    matched += 1;
    if (turn === false && matched !== 6) {
      computerPlay();
    }
    if (matched === 6) {
      if (scoreP === scoreC) alert('平手！🤝');
      else {
        alert(
          (scoreC > scoreP ? 'You Lose!🥲' : 'You Win!🏅') +
            `(Computer: ${scoreC} - You: ${scoreP} )`
        );
      }
      restart();
    }
  }, 200);
};

//Matched Check
const matchCheck = function (turn) {
  firstCard.dataset.name === secondCard.dataset.name
    ? isMatched(turn)
    : resetCard();
};

//Flip Card
const flipCard = function (e) {
  let targetCard = e.target.closest('.card');
  if (!targetCard || previousSelect === targetCard) return;
  if (flipCounter !== 2) {
    flipCounter++;
    targetCard.classList.add('flip');
    flipCounter === 1 ? (firstCard = targetCard) : (secondCard = targetCard);
    previousSelect = targetCard;
    if (flipCounter === 2) {
      matchCheck(true);
    }
  }
};

//computer select
const computerSelect = function (flippedTimes) {
  if (flippedTimes === 0) {
    targetC =
      cardComputerSet[Math.floor(Math.random() * cardComputerSet.length)];
    anotherSetForComp = cardComputerSet.filter((c) => c !== targetC);
  }
  if (flippedTimes === 1) {
    targetC =
      anotherSetForComp[Math.floor(Math.random() * anotherSetForComp.length)];
  }
  targetCardC = document.getElementById(`${targetC}`);
  flipCounter++;
  return computerPlay();
};

//Computer Play Game
const computerPlay = function () {
  if (flipCounter === 1) {
    firstCard = targetCardC;
    targetCardC.classList.add('flip');
  }
  if (flipCounter === 2) {
    secondCard = targetCardC;
    setTimeout(() => {
      targetCardC.classList.add('flip');
    }, 1000);
    setTimeout(() => {
      matchCheck(false);
    }, 1500);
  }
  while (flipCounter < 2) {
    computerSelect(flipCounter);
  }
};

//Turn Change
const turnChange = function () {
  turn = !turn;
  cardContainer.classList.toggle('brown');
  mask.classList.toggle('hide');
  turnPlayer.classList.toggle('show');
  turnComputer.classList.toggle('show');
  if (turn === false) computerPlay();
};

//Play Game
const playGame = function () {
  //隱藏開始按鈕 -> 洗牌、發牌 -> 卡片加上可翻功能、顯示卡片
  btnStart.classList.add('hide');
  btnRetry.classList.add('hide');
  cardComputerSet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  shuffleCards(cardPlaySet);
  setCards(cardPlaySet);
  cards.forEach((c) =>
    c.addEventListener('click', (e) => {
      flipCard(e);
    })
  );

  //Turn顯示(從玩家開始)
  cardContainer.classList.remove('hide', 'brown');
  mask.classList.add('hide');
  turnPlayer.classList.add('show');
  turnComputer.classList.remove('show');
  matched = 0;
  turn = true;
  scoreC = 0;
  scoreP = 0;
};

//////////////////////////////////////
btnStart.addEventListener('click', playGame);
