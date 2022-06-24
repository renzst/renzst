// rock paper scissors, v2
// renz torres

/* {
    'rock': 2,
    'scissors': 1,
    'paper': 0
} */

const Player = (isComputer) => {
    let choice;

    const computerChoice = () => {
        return Math.floor(Math.random()*3);
    }

    const playerChoice = () => {
        return choice;
    }

    const listenForChoice = (ch) => {
        choice = ch;
    }

    return isComputer ?
        {makeChoice: computerChoice} :
        {makeChoice: playerChoice,
        listenForChoice}
}

const Game = () => {
    const pA = Player(false);
    const pB = Player(true);

    const rounds = [];

    const addRound = round => {
        rounds.push(round);
    }

    const getAwins = () => {
        return rounds.filter(x => x.result == 1).length;
    }

    const getBwins = () => {
        return rounds.filter(x => x.result == 2).length;
    }

    return {
        pA,
        pB,
        addRound,
        getAwins,
        getBwins
    }
}

const Round = (playerAChoice, playerBChoice) => {
    let result = playerAChoice - playerBChoice;
    if (result < 0) {result += 3};

    return {result, playerAChoice, playerBChoice}
}

const Display = (to_n) => {
    const rock = document.querySelector("#rock");
    const paper = document.querySelector("#paper");
    const scissors = document.querySelector("#scissors");
    const buttons = [paper, scissors, rock];

    const root = document.querySelector(":root");
    root.style.setProperty("--n", to_n);

    const p1pts = document.querySelector("#playerPoints");
    const p2pts = document.querySelector("#computerPoints");

    const addPoint = (result) => {
        let point = document.createElement("div");
        point.classList.add("point");
        if (result == 1) {
            p1pts.appendChild(point);
        }
        if (result == 2) {
            p2pts.appendChild(point);
        }
    }

    const markButton = (player, choice) => {
        let b = buttons[choice]; // value matched but not hard-coded to button
        b.classList.add(player);
    }

    const clearButtons = () => {
        for (let b of buttons) {
            for (let p of ["player", "computer"]) {
                if (b.classList.contains(p)) {
                    b.classList.remove(p);
                }
            }
        }
    }

    const winner = document.querySelector("#winner");

    const declareWinner = (string) => {
        winner.classList.add("won");
        winner.textContent = string;
        for (let b of buttons) {
            b.disabled = true;
        }
    }

    return {
        buttons,
        addPoint,
        markButton,
        clearButtons,
        declareWinner
    }
}

function isValid(n) {
    n = Math.floor(+n);
    return n > 0 & n < 50;
}

const play = () => {
    let to_n;
    do {to_n = prompt("Play to how many points?");}
    while (!isValid(to_n));

    const game = Game();
    const display = Display(to_n);

    // Round logic that's triggered upon clicking a button

    const playRound = (value) => {
        display.clearButtons();

        let r = Round(value, game.pB.makeChoice());
        game.addRound(r);

        display.markButton("player", r.playerAChoice);
        display.markButton("computer", r.playerBChoice);

        display.addPoint(r.result);

        if (game.getAwins() == to_n) {
            display.declareWinner("You won!");
        }
        if (game.getBwins() == to_n) {
            display.declareWinner("You lost! fucker");
        }
    }

    for (let b of display.buttons) {
        b.addEventListener("click", () => playRound(b.value));
    }

};

play();
