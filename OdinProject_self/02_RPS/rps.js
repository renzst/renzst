const choices = {
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
    let outcome = computerSel - playerSel;
    outcome = outcome < 0 ? outcome + 3 : outcome;
    switch (outcome) {
        case 0: 
            console.log("It's a tie!");
            break;
        case 1: 
            console.log("The computer won this round!");
            break;
        case 2: 
            console.log("You won this round!");
            break;
        default:
            console.log("Uh oh, something went wrong.")
            return null;
    }
    return outcome;
}

function declareWinner(results) {
    let computerWins = 0;
    let playerWins = 0;
    for (let result of results) {
        switch (result) {
            case 1: 
                computerWins++;
                break;
            case 2:
                playerWins++;
                break;
            default:
                break;
        }
    }
    return(
        playerWins > computerWins ? 2 :
            computerWins > playerWins ? 1 : 0
    )
}

function game(n) {
    results = []
    for (let i = 0; i < n; i++) {
        console.log("ROUND "+ (i+1))
        let playerSel;
        while (!((playerSel === 0) | playerSel)) {
            let playerInput = prompt("Enter one of 'rock', 'paper', or 'scissors'");
            playerSel = validatePlayerInput(playerInput);
        }

        let computerSel = computerSelect();
        console.log("The computer chose "+displayChoice(computerSel));

        results.push(playRound(computerSel, playerSel));
        
    }
    const winner = declareWinner(results);
    winner == 2 ?
        console.log("You win!") :
        winner == 1 ?
            console.log("Computer wins!") :
            console.log("It's a tie!");
}

game(3);


/*
rock 2
scissors 1
paper 0

A - B == 1 mod 3 > A won B lost
A - B == 0 mod 3 > tie
A - B == 2 mod 3 > B won A lost

*/