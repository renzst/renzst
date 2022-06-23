// rock paper scissors, v2
// renz torres

/* {
    'rock': 2,
    'scissors': 1,
    'paper': 0
} */

const Player = (isComputer) => {
    const computerChoice = () => {
        return Math.floor(Math.random()*3);
    }

    const playerChoice = () => {
        let choice = prompt("What choice");
        console.log(choice);
        return choice;
    }

    return isComputer ?
        {makeChoice: computerChoice} :
        {makeChoice: playerChoice}
}


const Game = () => {
    const pA = Player(false);
    const pB = Player(true);

    const rounds = [];

    const doRound = () => {
        let result = pA.makeChoice() - pB.makeChoice();
        if (result < 0) {result += 3;};

        rounds.push(result);
        return result;
    }

    const getAwins = () => {
        return rounds.filter(x => x == 1).length;
    }

    const getBwins = () => {
        return rounds.filter(x => x == 2).length;
    }

    return {
        doRound,
        getAwins,
        getBwins
    }
}

const play = (to_n) => {
    let game = Game();
    let r;
    while (game.getAwins() < to_n & game.getBwins() < to_n) {
        r = game.doRound();
    }
    if (game.playerWins == to_n) {
        console.log("Player won");
    }
    else {
        console.log("Computer won");
    }
};

const gameDisplay = () => {
    
}

play(3);

/* const choices = {
    'rock': 2,
    'scissors': 1,
    'paper': 0
}

function displayChoice(value) {
    for (let choice in choices) {
        if (value == choices[choice]) {
            return choice;
        }
    }
    return null;
}

function computerSelect() {
    return Math.floor(Math.random()*3);
}

function validatePlayerInput(playerInput) {
    playerInput = playerInput.toLowerCase();

    for (let choice in choices) {
        if (playerInput == choice) {
            return choices[choice]; // return the number representation of the choice
        }
    }
    console.log("Error, your choice wasn't one of 'rock', 'paper', or 'scissors'")
    return undefined;
}

function playRound(computerSel, playerSel) {
    const tieString = "It's a tie!";
    const compWin = "The computer won this round!";
    const playerWin = "You won this round!";

    const resultList = document.querySelector("#results");

    let outcome = computerSel - playerSel;
    outcome = outcome < 0 ? outcome + 3 : outcome;

    let strToLog;
    switch (outcome) {
        case 0:
            strToLog = tieString;
            break;
        case 1: 
            strToLog = compWin;
            break;
        case 2: 
            strToLog = playerWin;
            break;
        default:
            console.log("Uh oh, something went wrong.")
            return null;
    }
    let resultItem = document.createElement("li");
    resultItem.textContent = strToLog;

    console.log(strToLog);
    resultList.appendChild(resultItem);

    return outcome;
}

function updateWins(playerWins, computerWins) {
    const player = document.querySelector("#player");
    const computer = document.querySelector("#computer");

    player.textContent = "Player wins: " + playerWins;
    computer.textContent = "Computer wins: " + computerWins;

}


const game() {
    let playerWins = 0;
    let computerWins = 0;

    let userRock = document.querySelector("#rock");
    let userScis = document.querySelector("#scissors");
    let userPape = document.querySelector("#paper");

    let winner;

    let updateWinCount = (outcome) => {
        if (outcome == 1) {computerWins++};
        if (outcome == 2) {playerWins++};
    };

    let updateEvent = choice => {
        let outcome = playRound(choice, computerSelect());
        updateWinCount(outcome);
        updateWins(playerWins, computerWins);
        if (!winner & playerWins == 5) {
            winner = "Player";
        };
        if (!winner & computerWins == 5) {
            winner = "Computer";
        };
        if (winner) {
            const winDiv = document.querySelector("#hasWon");
            winDiv.textContent = winner + " has won!";
        };
    }

    userRock.addEventListener('click', () => {
        let outcome = playRound(2, computerSelect());
        updateWinCount(outcome);
        updateWins(playerWins, computerWins);
        if (!winner & playerWins == 5) {
            winner = "Player";
        };
        if (!winner & computerWins == 5) {
            winner = "Computer";
        };
        if (winner) {
            const winDiv = document.querySelector("#hasWon");
            winDiv.textContent = winner + " has won!";
        };
    }); 
    userScis.addEventListener('click', () => {
        let outcome = playRound(1, computerSelect());
        updateWinCount(outcome);
        updateWins(playerWins, computerWins);
        if (!winner & playerWins == 5) {
            winner = "Player";
        };
        if (!winner & computerWins == 5) {
            winner = "Computer";
        };
        if (winner) {
            const winDiv = document.querySelector("#hasWon");
            winDiv.textContent = winner + " has won!";
        };
    }); 
    userPape.addEventListener('click', () => {
        let outcome = playRound(0, computerSelect());
        updateWinCount(outcome);
        updateWins(playerWins, computerWins);
        if (!winner & playerWins == 5) {
            winner = "Player";
        };
        if (!winner & computerWins == 5) {
            winner = "Computer";
        };
        if (winner) {
            const winDiv = document.querySelector("#hasWon");
            winDiv.textContent = winner + " has won!";
        };
    }); 
} 

game()

*/

/*
rock 2
scissors 1
paper 0

A - B == 1 mod 3 > A won B lost
A - B == 0 mod 3 > tie
A - B == 2 mod 3 > B won A lost

*/