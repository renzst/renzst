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

const createPlayer = (xo, order, interactiveFlag = true) => {
    const selectedCells = [];
    const marker = xo;
    const interactive = interactiveFlag;

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
        order,
        interactive,
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
    return {currentPlayer, turnCount, grid};
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

    const declareWinner = (winningPlayer) => {
        disableAllButtons();
        winnerDiv.textContent = `Player ${winningPlayer.marker} wins!`

        return winningPlayer.marker;
    }

    return {target, declareTie, declareWinner}
}

const game = (n) => {
    let player1 = createPlayer("🍆", 1, true);
    let player2 = createPlayer("🍑", 2, true);

    let result;
    let gameboard = createGameboard(n);

    gameboard.currentPlayer = player1;

    const display = createDisplay(gameboard);

    // game logic
    console.log(display.target)
    display.target.addEventListener("click", () => {
        console.log(gameboard.currentPlayer.selectedCells);
        if (gameboard.currentPlayer.checkForWin(n)) {
            result = display.declareWinner(gameboard.currentPlayer);
            gameboard.currentPlayer = undefined;
        }
        else if (gameboard.turnCount >= Math.pow(n, 2)) {
            result = display.declareTie();
            gameboard.currentPlayer = undefined;
        }
        else {
            gameboard.currentPlayer = gameboard.turnCount % 2 == 0 ? player1 : player2;
        }
    })

    return {players: [player1, player2], gameboard, display, result};
}

function initialize() {
    const playButton = document.querySelector("#reset");
    const nInput = document.querySelector("#n");

    let g;
    playButton.addEventListener("click", () => {
        if (nInput.value) {
            playButton.textContent = "Reset";
            g = game(nInput.value);
            console.log(g);
        }
    })
}

initialize();

/* 
Workflow for tictactoe gameboard
  - user selects options (play as o or x)
  - user hits start game
  - game object initializes
    - instantiates gameboard, display, and player objects
    - find player o/x and prompt them
    - player marks button
    - calls display object to pass down value of cell to player o and to mark cell in gameboard
    - checks to see if either player has:
        - at least n objects claimed
        - whether items claimed are divisible by a single prime
        - if so, claim win and stop game
        - otherwise: call for player x
  - gameboard object initializes (the logical one)
    - logical array/etc is created to store results
        - array consists of cell objects
        - each cell contains:
            - an id
            - its membership in rows, cols, and diag
            - maybe a succinct way to do it that's extensible:
                - row-1 has those divisible by 2
                - row-2 divisible by 3
                - row-3 divisible by 5
                - col-1 divisible by 7
                - col-2 divisible by 11
                - col-3 divisible by 13
                - diag-1 divisible by 17
                - diag-2 divisible by 19
            - for bigger gameboards, primes needed are 2n+2, where
            - n is the width of the gameboarddsds
            - 2*7*17    2*11    2*13*19
            - 3*7    3*11*17*19 3*13
            - 5*19      5*11    5*13*19
            - and then lastly a "mark" indicating what player took it
            - generate that loop:
            - create row primes, col primes, and diag primes
                - for i of n
                    - for j of n
                        cell.value = row[i]*col[j]
                        if i==j:
                            multiply by diag prime 1
                        if i+j==n+1
                            multiple by diag prime 2
                        push to tempArray to loop over
- player objects initialize 
    - tagged with user-type (interactive or computer) - let's do interactive first
    - X/O, and array of results
- display object initializes
    - basically tie cells created in gameboard to display objects
    - creates cells using properties of cell
    - puts event listeners
    
        */