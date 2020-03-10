//initial deck
const card = document.getElementsByClassName("card");
const cards = [...card];

//constants from html
const restart = document.querySelector(".restart");
const moves = document.querySelector(".moves");
const deck = document.querySelector(".deck");
const stars = document.querySelectorAll(".fa-star");
const button = document.querySelector(".play-again");
const timer = document.querySelector("#timer");

//variables
let counting = 0;
let openList = [];
let matchList = [];
let gameWon = false;

//timer
let min = 0;
let sec = 0;

function myTimer() {
  if (counting) {
    timer.innerHTML = min + " minutes " + sec + " seconds";
    sec++;
    if (sec >= 60) {
      sec = 0;
      min++;
    }
  }
}

//start timer
let startTimer = setInterval(function() {
  myTimer();
}, 1000);

//create the modal
let modalAppear = function() {
    if (gameWon === true) {
        clearInterval(startTimer);

        let timing = timer.innerHTML;
        let starNumber = document.querySelector(".stars").innerHTML;
        $('#modal-popup').modal('show');

        document.querySelector(".total-moves").innerHTML = counting;
        document.querySelector(".total-time").innerHTML = timing;
        document.querySelector(".total-stars").innerHTML = starNumber;

        closeModal();
    }
  };

//close modal
function closeModal() {
    button.addEventListener("click", function() {
      $('#modal-popup').modal('hide');
      startGame();
      for (let i = 0; i < stars.length; i++) {
        stars[i].style.visibility = "visible";
      }

      min = 0;
      sec = 0;
      setInterval(function() {
        myTimer();
      }, 1000);
    });
  }

//non matching cards
function noMatch() {
    openList[0].classList.replace("open", "no_match");
    openList[1].classList.replace("open", "no_match");
    setTimeout(function() {
      openList[0].classList.remove("show", "no_match");
      openList[1].classList.remove("show", "no_match");
    }, 1000);
    setTimeout(function() {
      openList.splice(0, 2);
    }, 1000);
  }

//matching cards
function match() {
    openList[0].classList.add("match");
    openList[1].classList.add("match");
    matchList.push(openList[0]);
    matchList.push(openList[1]);
    openList.splice(0, 2);
  }

//enable click event on cards
function startClick() {
    for (let x = 0; x < cards.length; x++) {
      cards[x].classList.remove("stop-event");
    }
  }

//disable click event on cards
function stopClick() {
    for (let x = 0; x < cards.length; x++) {
      cards[x].classList.add("stop-event");
    }
  }

//count players moves and starts timer
function countMoves() {
    counting++;
    moves.innerHTML = counting;

    //remove stars after a number of moves
    if (counting > 5 && counting < 10) {
      for (let i = 0; i < 3; i++) {
        if (i > 1) {
          stars[i].style.visibility = "collapse";
        }
      }
    } else if (counting > 10) {
      for (let i = 0; i < 3; i++) {
        if (i > 0) {
          stars[i].style.visibility = "collapse";
        }
      }
    }
  }

//flip card when clicked
let openedCard = function() {
    this.classList.add("open", "show");
    openList.push(this);
    console.log(openList)
    if (openList.length === 2) {
      countMoves();
      stopClick();
      setTimeout(function() {
        startClick();
      }, 500);
      if (openList[0].innerHTML === openList[1].innerHTML) {
        gameWon = true;
        match();
      } else if (openList[0].innerHTML != openList[1].innerHTML) {
        gameWon = false;
        noMatch();
      }
    }
  };

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

//flip card
for (let x = 0; x < cards.length; x++) {
    cards[x].addEventListener("click", openedCard);
    cards[x].addEventListener("click", modalAppear);
  }

//restart game
restart.addEventListener("click", function() {
    startGame();
    for (let i = 0; i < stars.length; i++) {
      stars[i].style.visibility = "visible";
    }
    gameWon = false;
    min = 0;
    sec = 0;
  });

//start game
function startGame() {
    gameWon = false;
    document.getElementById("modal-popup").style.display = "none";
    let shuffled = shuffle(cards);
    let appending = function(item) {
      deck.appendChild(item);
    };

    for (let i = 0; i < shuffled.length; i++) {
      deck.innerHTML = "";
      [].forEach.call(shuffled, appending);
      shuffled[i].classList.remove("open", "show", "match", "no_match");
    }

    matchList.splice(0, 10);
    matchList[1].classList.remove("open", "show");
    matchList[0].classList.remove("open", "show");
    counting = 0;
    moves.innerHTML = counting;
  }

//main function
//****************************************
document.onload = startGame();