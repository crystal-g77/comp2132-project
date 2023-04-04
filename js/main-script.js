/*
author:	Crystal Giesbrecht
date:	03/27/2023
notes:	main javascript for final project
*/

// const $popup                    = $("#popup");
const popup                     = document.getElementById("popup");
const $popupImg                 = $("#popup > img");
const popupMessage              = document.getElementById("popup-message");
const playAgainBtn              = document.getElementById("play-again");
const $guessesImg               = $("#guesses-image > img");
const wordDiv                   = document.getElementById("word");
const hintSpan                  = document.getElementById("hint-message");
const guessesSpan               = document.getElementById("guesses-tally");
const newGameBtn                = document.getElementById("new-game");
const newGameTooltip            = document.getElementById("new-game-tooltip");
const keyboardDiv               = document.getElementById("keyboard");

// const popupFadeTime             = 700;
const popupFadeInterval         = 0.05;
const popupFadeIntervalTime     = 40;
let popupAnimating              = false;
let popupHandlerId;

const guessesImgPath            = "images/garfield-eating";
const guessesImgExt             = "png";

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
    // if($popup.css("opacity") != 1){
    if(parseFloat(getComputedStyle(popup).getPropertyValue("opacity")) != 1){
        // if the popup isn't fully showing don't do anything
        return;
    }

    hideGameOverPopup();
});

// this button was just for testing 
newGameBtn.style.display = "none";
newGameBtn.addEventListener("click", function(e){
    // if($popup.css("opacity") > 0){
    if(parseFloat(getComputedStyle(popup).getPropertyValue("opacity")) > 0){
        // if the popup is showing don't do anything
        return;
    }

    newGame();
});

// newGameBtn.addEventListener("mouseenter", function(e){
//     if($popup.css("opacity") > 0){
//         // if the popup is showing don't do anything
//         return;
//     }

//     newGameTooltip.style.display = "block";
// });
// newGameBtn.addEventListener("mouseleave", function(e){
//     newGameTooltip.style.display = "none";
// });

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
        
        if(won){
            $popupImg.attr("src", "images/odie.png")
            $popupImg.attr("alt", "Odie")
            popupMessage.innerHTML = "You won!"
        }
        else{
            $popupImg.attr("src", "images/jon.png")
            $popupImg.attr("alt", "Jon")
            popupMessage.innerHTML = `You lost...<br>The word was "${currentWordObj.getWord()}"`;
        }

        // Need to remember to change display away from none so that
        // the popup actually shows
        // $popup.css("display", "flex");
        popup.style.display = "flex";

        popupAnimating = true;
        // $popup.animate( {opacity : 1}, popupFadeTime, popupAnimationFinished);
        popupHandlerId = setInterval(function(){
            let opacity = parseFloat(getComputedStyle(popup).getPropertyValue("opacity"));
            opacity += popupFadeInterval;
            popup.style.opacity = opacity;
            if(opacity >= 1){
                clearInterval(popupHandlerId);
                popupAnimating = false;
            }
        }, popupFadeIntervalTime);
    }
}

function hideGameOverPopup(){
    if(!popupAnimating){
        popupAnimating = true;
        // $popup.animate( {opacity : 0}, popupFadeTime, popupAnimationFinished);
        popupHandlerId = setInterval(function(){
            let opacity = parseFloat(getComputedStyle(popup).getPropertyValue("opacity"));
            opacity -= popupFadeInterval;
            popup.style.opacity = opacity;
            if(opacity <= 0){
                clearInterval(popupHandlerId);
                popupAnimating = false;
                popup.style.display = "none";

                newGame();
            }
        }, popupFadeIntervalTime);
    }
}

// function popupAnimationFinished(){
//     popupAnimating = false;

//     if($popup.css("opacity") == 0){
//         // Need to change display to none when the animation is done so that 
//         // the "Play Again" button on the popup doesn't hijack clicks
//         $popup.css("display", "none");

//         newGame();
//     }
// }

function newGame(){
    if(currentWordObj){
        currentWordObj.reset();
    }

    // Pick a new word
    const wordIndex = Math.floor(Math.random() * (arrayOfWordObj.length));
    currentWordObj = arrayOfWordObj[wordIndex];
    console.log("newGame() - Current word is " + currentWordObj.getWord());

    wordDiv.innerHTML = "";
    wordDiv.appendChild(currentWordObj.buildHTMLObject());

    hintSpan.innerHTML = "Hint: " + currentWordObj.getHint();

    currentNumberOfGuesses = 0;
    $guessesImg.attr("src", `${guessesImgPath}-${currentNumberOfGuesses}.${guessesImgExt}`);
    guessesSpan.innerHTML = `Incorrect Guesses: ${currentNumberOfGuesses}/${allowedNumberOfGuesses}`;

    // Reset all the letter buttons
    arrayOfLetterBtns.forEach(function(letterBtn){
        letterBtn.disabled = false;
    });
}

function letterGuessed(){
    // if($popup.css("opacity") > 0){
    if(parseFloat(getComputedStyle(popup).getPropertyValue("opacity")) > 0){
        return;
    }

    this.disabled = true;
    
    const guessedLetter = this.innerHTML;
    const found = currentWordObj.guessLetter(guessedLetter);

    console.log(`letterGuessed() - Letter is ${guessedLetter}`)

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
            $guessesImg.attr("src", `${guessesImgPath}-final.${guessesImgExt}`);
            showGameOverPopup(false);
        }
        else{
            $guessesImg.attr("src", `${guessesImgPath}-${currentNumberOfGuesses}.${guessesImgExt}`);
        }
    }
}