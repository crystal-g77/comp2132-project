/*
author:	Crystal Giesbrecht
date:	03/27/2023
notes:	main javascript for final project
*/

const $popup                    = $("#popup");
const popupMessage              = document.getElementById("popup-message");
const playAgainBtn              = document.getElementById("play-again");
const wordDiv                   = document.getElementById("word");
const hintSpan                  = document.getElementById("hint-message");
const guessesSpan               = document.getElementById("guesses-tally");
const newGameBtn                = document.getElementById("new-game");
const newGameTooltip            = document.getElementById("new-game-tooltip");
const keyboardDiv               = document.getElementById("keyboard");

const popupFadeTime             = 700;
let popupAnimating              = false;

let arrayOfLetterBtns           = [];

let arrayOfWordObj              = [];

const allowedNumberOfGuesses    = 7;
let currentWordObj;
let currentNumberOfGuesses;


// Extract word data          
const jsonWordObject = JSON.parse(jsonWordArray); 
const arrayOfWords = jsonWordObject.map(x => x.word);
const arrayOfHints = jsonWordObject.map(x => x.hint);
// Populate Word Object Array
for(let i = 0; i < arrayOfWords.length; i++){
    const word = new Word(arrayOfWords[i], arrayOfHints[i]);
    arrayOfWordObj.push(word);
}

playAgainBtn.addEventListener("click", function(e){
    newGame();

    hideGameOverPopup();
});

newGameBtn.addEventListener("click", function(e){
    if($popup.css("opacity") > 0){
        //if the popup is showing don't do anything
        return;
    }

    newGame();
});
newGameBtn.addEventListener("mouseenter", function(e){
    if($popup.css("opacity") > 0){
        //if the popup is showing don't do anything
        return;
    }

    newGameTooltip.style.display = "block";
});
newGameBtn.addEventListener("mouseleave", function(e){
    newGameTooltip.style.display = "none";
});

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", 
                    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", 
                    "u", "v", "w", "x", "y", "z"];
alphabet.forEach(function(letter){
    const letterBtn = document.createElement("button");
    letterBtn.innerHTML = letter;
    letterBtn.addEventListener("click", letterGuessed);
    arrayOfLetterBtns.push(letterBtn);
    keyboardDiv.appendChild(letterBtn);
});

// Automatically start a game
newGame();

function showGameOverPopup(won){
    if(!popupAnimating){
        $popup.css("display", "flex");
        if(won){
            popupMessage.innerHTML = "You won!"
        }
        else{
            popupMessage.innerHTML = `You lost...<br>The word was "${currentWordObj.getWord()}"`;
        }
        popupAnimating = true;
        $popup.animate( {opacity : 1}, popupFadeTime, popupAnimationFinished);
    }
}

function hideGameOverPopup(){
    if(!popupAnimating){
        popupAnimating = true;
        $popup.animate( {opacity : 0}, popupFadeTime, popupAnimationFinished);
    }
}

function popupAnimationFinished(){
    popupAnimating = false;
    if($popup.css("opacity") == 0){
        $popup.css("display", "none");
    }
}

function newGame(){
    if(currentWordObj){
        currentWordObj.reset();
    }

    // Pick a new word
    const wordIndex = Math.floor(Math.random() * (arrayOfWordObj.length));
    currentWordObj = arrayOfWordObj[wordIndex];
    console.log("newGame - Current word is " + currentWordObj.getWord());

    wordDiv.innerHTML = "";
    wordDiv.appendChild(currentWordObj.buildHTMLObject());

    hintSpan.innerHTML = "Hint: " + currentWordObj.getHint();

    currentNumberOfGuesses = 0;
    guessesSpan.innerHTML = `Incorrect Guesses: ${currentNumberOfGuesses}/${allowedNumberOfGuesses}`;

    // Reset all the letter buttons
    arrayOfLetterBtns.forEach(function(letterBtn){
        letterBtn.disabled = false;
        letterBtn.classList.remove("disabled");
    });
}

function letterGuessed(){
    if($popup.css("opacity") > 0){
        //if the popup is showing don't do anything
        return;
    }

    this.disabled = true;
    this.classList.add("disabled");
    
    const guessedLetter = this.innerHTML;
    const found = currentWordObj.guessLetter(guessedLetter);

    if(found){
        wordDiv.innerHTML = "";
        wordDiv.appendChild(currentWordObj.buildHTMLObject());

        const done = currentWordObj.isWordDone();
        if(done){
            showGameOverPopup(true);
        }
    }
    else{
        currentNumberOfGuesses++;
        guessesSpan.innerHTML = `Incorrect Guesses: ${currentNumberOfGuesses}/${allowedNumberOfGuesses}`;
        if(currentNumberOfGuesses >= allowedNumberOfGuesses){
            showGameOverPopup(false);
        }
    }
}