/*
author:	Crystal Giesbrecht
date:	03/27/2023
notes:	JSON array of words and Word Object javascript for final project
*/

const jsonWordArray = `[
    {
        "word" : ["m", "a", "y"],
        "hint" : "a month"
    },
    {
        "word" : ["a", "b", "y", "s", "s"],
        "hint" : "emptiness or nothingness"
    },
    {
        "word" : ["c", "a", "n", "a", "d", "a"],
        "hint" : "the best country"
    },
    {
        "word" : ["j", "a", "y"],
        "hint" : "a type of bird, also a baseball team"
    },
    {
        "word" : ["j", "q", "u", "e", "r", "y"],
        "hint" : "a fast, small, and feature-rich JavaScript library"
    },
    {
        "word" : ["f", "i", "z", "z"],
        "hint" : "the bubbles in a carbonated drink"
    },
    {
        "word" : ["j", "u", "n", "k"],
        "hint" : "a useless item"
    },
    {
        "word" : ["c", "o", "f", "f", "e", "e"],
        "hint" : "a caffeine fix"
    },
    {
        "word" : ["d", "o", "m"],
        "hint" : "the mechanism through which JavaScript can manipulate an HTML page"
    },
    {
        "word" : ["s", "h", "o", "r", "t"],
        "hint" : "opposite of tall"
    }
]`;

class Word{
    constructor(word, hint){
        if(Array.isArray(word)){
            this.word = word;
        }
        else{
            console.log("Word::constructor - Invalid word " + word);
            this.word = [];
        }

        if(typeof hint == "string"){
            this.hint = hint;
        } 
        else{
            console.log("Word::constructor - Invalid hint " + word);
            hint = "N/A";
        }

        this.guessed = [];
        for(let i = 0; i < this.word.length; i++){
            this.guessed.push(false);
        };
    }

    getWord(){
        let word = "";

        this.word.forEach(function(letter){
            word += letter;
        });

        return word;
    }

    getHint(){
        return this.hint;
    }

    guessLetter(letter){
        let found = false;

        for(let i = 0; i < this.word.length; i++){
            if(letter == this.word[i]){
                this.guessed[i] = true;
                found = true;
            }
        }

        return found;
    }

    reset(){
        for(let i = 0; i < this.guessed.length; i++){
            this.guessed[i] = false;
        }
    }

    isWordDone(){
        let done = true;

        for(let i = 0; i < this.word.length; i++){
            if(!this.guessed[i]){
                done = false;
            }
        }

        return done;
    }

    buildHTMLObject(){
        const parentUL = document.createElement("ul");
        parentUL.classList.add("word");  

        let childLI;
        for(let i = 0; i < this.word.length; i++){
            childLI = document.createElement("li");
            childLI.classList.add("letter");  
            if(this.guessed[i]){
                childLI.innerHTML = this.word[i];
            }
            else{
                childLI.innerHTML = "_";
            }
            parentUL.appendChild(childLI);
        }

        return parentUL;
    }
}