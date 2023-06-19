// tah.js

const spaces = 79;

const sims = 1000000;

const flySpeed = 2;

var isOdd = function (x) {
    return x & 1;
};
var isEven = function (x) {
    return !(x & 1);
};

function roll(n) {
    var n = n || 1;
    var total = 0;
    for (var i = 0; i < n; i++) {
        var x = Math.floor(Math.random() * 6) + 1;
        total += x;
    }
    return total;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function roundPerc(n) {
    return Math.floor(n * 100);
}

function makeBoard(n) {
    let board = new Array(spaces);
    cursor = 0;
    board.addTo = (item, number) => {
        board.fill(item, cursor, number + cursor);
        cursor += number;
    };
    board.fill("empty");

    board.addTo("f3", 5); // forward 3 spaces
    board.addTo("b3", 5); // back 3 spaces

    board.addTo("mt", 3); // miss a turn
    board.addTo("ra", 3); // roll again

    board.addTo("cr", 2); // tortoise crashes!
    board.addTo("zz", 3); // hare stops to eat and has a snooze

    shuffle(board);

    return board;
}

function handleBoardSquare(board, animal) {
    let square = board[animal.space];

    switch (square) {
        case "empty":
            return false;
        case "f3":
            animal.space += 3;
            return false;
        case "b3":
            animal.space -= 3;
            if (animal.space < 0) animal.space = 0;
            return false;
        case "mt":
            if (animal.lastMissed != animal.space) animal.missATurn = true;
        case "ra":
            return true;
        case "cr":
            if (animal.is == "tortoise") {
                animal.isFlying = false;
                // animal.isBrokenDown = true;
            }
            return false;
        case "zz":
            if (animal.is == "hare") animal.isSleeping = true;
            return false;
    }

    return;
}

function makeDrawBoardsArray() {
    return new Array();
}

function addBoardToDrawBoardsArray(drawBoards, board) {
    return drawBoards.push([...board]);
}

function hasWon(spaces, animal) {
    return animal.space >= spaces;
}

function updateHare(hare) {
    if (hare.missATurn) {
        hare.missATurn = false;
        hare.lastMissed = hare.space;
        return;
    }
    if (hare.isSleeping) {
        let r1 = roll(1);
        let r2 = roll(1);
        if (isEven(r1)) {
            hare.isSleeping = false;
            hare.space += r1 + r2;
        }
    } else {
        let r1 = roll(1);
        let r2 = roll(1);
        if (r1 == r2) {
            hare.isSleeping = true;
            hare.sleeps += 1;
        } else {
            hare.space += r1 + r2;
        }
    }
}

function updateTortoise(tortoise) {
    if (tortoise.missATurn) {
        tortoise.missATurn = false;
        tortoise.lastMissed = tortoise.space;
        return;
    }
    let r1 = roll(1);
    if (tortoise.isBrokenDown) {
        if (r1 == 6) tortoise.isBrokenDown = false;
        return;
    } else if (tortoise.isFlying) {
        if (r1 == 1) {
            tortoise.isFlying = false;
            tortoise.space += 1;
            return;
        }
        // Tortoise breaks down
        //
        // else if (r1 == 6) {
        // 	tortoise.isFlying = false;
        // 	tortoise.isBrokenDown = true;
        // }
        tortoise.space += r1 * flySpeed;
    } else {
        if (r1 == 6) {
            tortoise.isFlying = true;
            tortoise.space += r1 * flySpeed;
            tortoise.flights += 1;
            return;
        }
        tortoise.space += r1;
    }
}

function simulateGame(board) {
    let turns = 0;

    let hare = {
        is: "hare",
        space: 0,
        lastMissed: 0,
        isSleeping: false,
        sleeps: 0,
    };
    let tortoise = {
        is: "tortoise",
        space: 0,
        lastMissed: 0,
        isFlying: false,
        isBrokenDown: false,
        flights: 0,
    };

    while (!hasWon(spaces, hare) && !hasWon(spaces, tortoise)) {
        let rollAgain = false;
        do {
            updateHare(hare);
            rollAgain = handleBoardSquare(board, hare);
        } while (rollAgain);
        do {
            updateTortoise(tortoise);
            rollAgain = handleBoardSquare(board, tortoise);
        } while (rollAgain);
        turns += 1;
    }

    return [hasWon(spaces, tortoise) ? 1 : 0, hasWon(spaces, hare) ? 1 : 0, turns, hare.sleeps, tortoise.flights];
}

let i;
let tortoiseWins = 0;
let hareWins = 0;
let totTurns = 0;
let totSleeps = 0;
let totFlights = 0;
let totDraws = 0;

let drawBoards = makeDrawBoardsArray();

for (i = 0; i < sims; i++) {
    const board = makeBoard(spaces);
    const [t, h, turns, sleeps, flights] = simulateGame(board);

    totTurns += turns;
    totSleeps += sleeps;
    totFlights += flights;

    if (t === h) {
        totDraws += 1;
        addBoardToDrawBoardsArray(drawBoards, board);
    } else {
        tortoiseWins += t;
        hareWins += h;
    }
}

console.log("\n");
console.log("spaces:", spaces, "fly-speed:", flySpeed);
console.log("sims:", sims);
console.log("t:", tortoiseWins, "h:", hareWins, "d:", totDraws);
console.log("hare wins:", roundPerc(hareWins / sims) + "%");
console.log("tortoise wins:", roundPerc(tortoiseWins / sims) + "%");
console.log("draws:", roundPerc(totDraws / sims) + "%");
console.log("ave turns:", (totTurns / sims).toFixed(2));
console.log("ave sleeps:", (totSleeps / sims).toFixed(2));
console.log("ave flights:", (totFlights / sims).toFixed(2));
console.log("\n");
// console.log(drawBoards);

let numBoardTests = 1000;

let drawBoardsScore = new Array(drawBoards.length).fill({ d: 0, t: 0, h: 0 });
let highestScore = 0;
let highestScoreIndex = 0;

drawBoards.forEach((b, bi) => {
    for (i = 0; i < numBoardTests; i++) {
        const [t, h, turns, sleeps, flights] = simulateGame(b);

        // console.log("t:", t, "h:", h);
        // console.log("turns:", turns, "sleeps:", sleeps);

        if (t === h) {
            drawBoardsScore[bi].d += 1;
            // console.log("draw",drawBoardsScore[bi])
        }
        drawBoardsScore[bi].t += t;
        drawBoardsScore[bi].h += h;
    }
    if (drawBoardsScore[bi].d > highestScore) {
        highestScoreIndex = bi;
        highestScore = drawBoardsScore[bi].d;
    }
});

console.log(highestScoreIndex);
console.log(highestScore);
console.log(drawBoardsScore[highestScoreIndex]);
console.log(drawBoards[highestScoreIndex]);
