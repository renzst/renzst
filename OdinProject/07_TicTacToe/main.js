function generatePrimes(n) {
    const primeArray = [];

    let lim = 2;
    let isPrime;
    while (primeArray.length < n) {
        isPrime = true;
        if (primeArray.length < 3) {
            for (i = 2; i <= lim/2; i++) {
                if (lim % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        else {
            for (prime of primeArray) {
                if (prime > lim/2) {
                    break;
                }
                if (lim % prime == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        if (isPrime) {primeArray.push(lim);};
        lim++;
    }
    return primeArray;
}

const createPlayer = (marker, interactiveFlag = true) => {
    const selectedCells = [];

    const addToSelected = value => selectedCells.push(value);
    const checkForWin = (n) => {
        let primeCount;
        for (prime of generatePrimes(2*n+2)) {
            primeCount = 0;
            for (cell of selectedCells) {
                if (cell % prime == 0) {
                    primeCount++;
                }
            }
            if (primeCount == n) {
                return true;
            }
        }
        return false;
    }

    return ({
        selectedCells,
        marker,
        interactive: interactiveFlag,
        addToSelected,
        checkForWin,
    })
}

const cellIDGenerator = (() => {
    let id = 0;
    return () => id++;
})();

const createCell = (value) => {
    const id = cellIDGenerator();
    let claimedBy;
    let domRef;

    const claimCell = (marker) => {
        if (!claimedBy) {
            claimedBy = marker;
        }
    }

    const getClaim = () => {
        return claimedBy;
    }

    const linkToDOM = (obj) => {
        if (!domRef) {
            domRef = obj;
        }
    }

    const getDOM = () => {
        return domRef;
    }
    return {id, value, claimCell, getClaim, linkToDOM, getDOM}
}

const createGameboard = (n) => {
    const grid = [];
    let currentPlayer;
    let turnCount = 0;

    // workflow: each grid cell has an id and value attached. each value is divisible by 2 or 3
    // unique primes depending on position. winner is calculated by having n values divisible by primes

    // generate primes and allocate to rows, cols, and diagonals
    const primes = generatePrimes(2*n + 2);
    const rowFactors = primes.slice(-n);
    const colFactors = primes.slice(-2*n, -n);
    const diaFactors = primes.slice(0, 2); // done in this order to minimize difference in values

    // give each cell a value
    let value;
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            value = 1;
            value *= rowFactors[row] * colFactors[col];
            if (row == col) {value *= diaFactors[0]};
            if (row + col == n - 1) {value *= diaFactors[1]}
            grid.push(createCell(value));
        }
    }
    return {currentPlayer, turnCount, grid, n};
}

function factorize(n, primes) {
    const factorArray = [];
    for (let prime of primes) {
        if (n % prime == 0) {
            factorArray.push(prime);
        }
    }
    return factorArray;
}

const createBreakout = (gameboard) => {
    const primes = generatePrimes(gameboard.n * 2 + 2)
    const breakoutGrid = {};
    for (let prime of primes) {
        breakoutGrid[prime] = gameboard.grid.
        filter(cell => cell.value % prime == 0).
        map(cell => {
            return {id: cell.id, value: cell.value, marker: cell.getClaim()}
        });
    }
    return breakoutGrid;
}

const checkEarlyStale = (gameboard) => {
    const breakoutGrid = createBreakout(gameboard);
    for (breakout in breakoutGrid) {
        let simplified = breakoutGrid[breakout].map(cell => cell.marker);
        let onePlayer = simplified.filter(mark => mark == "🍆").length;
        let twoPlayer = simplified.filter(mark => mark != "🍆" && mark !== undefined).length;
        if (twoPlayer * onePlayer == 0) {
            return false;
        }
    }
    return true;
}

const createAI = (player) => {
    const marker = player.marker;

    const getBestOption = (gameboard) => {
        const breakoutGrid = createBreakout(gameboard);
        const primes = generatePrimes(2 * gameboard.n + 2);

        const optionsLeft = gameboard.grid.filter(cell => !cell.getClaim()).map(cell => cell.value);
        const optionsEvaluated = [];
    
        for (let option of optionsLeft) {
            let factors = factorize(option, primes);
            let eval = 0;
    
            for (let breakout in breakoutGrid) {
                for (let factor of factors) {
                    if (factor == breakout) {
                        let simplified = breakoutGrid[breakout].map(cell => cell.marker);
                        let thisPlayer = simplified.filter(mark => mark == marker).length;
                        let otherPlayer = simplified.filter(mark => mark != marker && mark !== undefined).length;
    
                        if (otherPlayer == gameboard.n - 1) {eval += 16}
                        if (thisPlayer == gameboard.n - 1) {eval += 8}
                        if (thisPlayer == 0 && otherPlayer > 0 && otherPlayer < gameboard.n - 1) {eval += 1}
                        if (thisPlayer > 0 && thisPlayer < gameboard.n - 1 && otherPlayer == 0) {eval += 2}
                        if (thisPlayer == 0 && otherPlayer == 0) {eval += 1}
    
                    }
                }
            }
    
            optionsEvaluated.push({option, eval})
        }
    
        let best = optionsEvaluated[0];
        
        for (option of optionsEvaluated) {
            if (best.eval < option.eval) {best = option}
        }
        return best.option
    }

    const markBoard = (gameboard, value) => {
        for (cell of gameboard.grid) {
            if (cell.value == value) {
                cell.getDOM().click();
                break;
            }
        }
    }

    return {getBestOption, markBoard}
}

const createDisplay = (gameboard) => {
    document.querySelector(":root").style.setProperty("--n", Math.sqrt(gameboard.grid.length));

    const target = document.querySelector("#gameboard");
    const winnerDiv = document.querySelector("#winner");

    while (target.firstChild) {target.lastChild.remove()};

    winnerDiv.textContent = "";


    for (let cell of gameboard.grid) {
        let cellButton = document.createElement("button");
        cellButton.id = cell.id;
        cellButton.dataset.indexNumber = cell.value;

        cellButton.addEventListener("click", () => {
            cell.claimCell(gameboard.currentPlayer.marker);
            gameboard.currentPlayer.addToSelected(cell.value);
            cellButton.disabled = true;
            cellButton.textContent = gameboard.currentPlayer.marker;
            gameboard.turnCount++;
        })
        cell.linkToDOM(cellButton);
        target.append(cellButton);
    }

    const disableAllButtons = () => {
        const buttons = target.querySelectorAll("button");
        for (let button of buttons) {
            button.disabled = true;
        }
    }

    const declareTie = () => {
        disableAllButtons();
        winnerDiv.textContent = "It's a tie. WhOmp whomp.";
        return "Tie";
    }

    const declareEarlyStale = () => {
        disableAllButtons();
        winnerDiv.textContent = "It's an early tie, no chance of win"
        return "Tie";
    }

    const declareWinner = (winningPlayer) => {
        disableAllButtons();
        winnerDiv.textContent = `Player ${winningPlayer.marker} wins!`

        return winningPlayer.marker;
    }

    return {target, declareTie, declareEarlyStale, declareWinner}
}

const game = (n, gameType) => {
    let player1;
    let player2;
    if (gameType == '2') {
        player1 = createPlayer("🍆", true);
        player2 = createPlayer("🍑", false);
    }
    else if (gameType == '3') {
        player1 = createPlayer("🍆", false);
        player2 = createPlayer("🍑", true);
    }
    else {
        player1 = createPlayer("🍆", true);
        player2 = createPlayer("🍑", true);
    }

    for (let player of [player1, player2]) {
        player.ai = player.interactive ? undefined : createAI(player);
    }

    let result;
    let gameboard = createGameboard(n);

    gameboard.currentPlayer = player1;

    const display = createDisplay(gameboard);

    if (player1.ai && gameboard.turnCount == 0) {
        gameboard.currentPlayer.ai.markBoard(gameboard, gameboard.currentPlayer.ai.getBestOption(gameboard));
        gameboard.currentPlayer = player2;
    }

    // game logic
    display.target.addEventListener("click", () => {
        if (gameboard.currentPlayer.checkForWin(n)) {
            result = display.declareWinner(gameboard.currentPlayer);
            gameboard.currentPlayer = undefined;
        }
        else if (gameboard.turnCount >= Math.pow(n, 2)) {
            result = display.declareTie();
            gameboard.currentPlayer = undefined;
        }
        else if (checkEarlyStale(gameboard)) {
            result = display.declareEarlyStale();
            gameboard.currentPlayer = undefined;
        }
        else {
            gameboard.currentPlayer = gameboard.turnCount % 2 == 0 ? player1 : player2;
            if (gameboard.currentPlayer.ai !== undefined) {
                gameboard.currentPlayer.ai.markBoard(gameboard, gameboard.currentPlayer.ai.getBestOption(gameboard));
            }
        }
    })

    return {players: [player1, player2], gameboard, display, result};
}

function initialize() {
    const playButton = document.querySelector("#reset");
    const nInput = document.querySelector("#n");
    const gameType = document.querySelector("#player");

    let g;
    playButton.addEventListener("click", () => {
        if (g) {
            g = undefined;
        }
        if (nInput.value >= 3 && nInput.value <= 5) {
            playButton.textContent = "Reset";
            gameTypeSelected = gameType.options[gameType.selectedIndex].value;
            g = game(nInput.value, gameTypeSelected);
        }
    })
}

initialize();