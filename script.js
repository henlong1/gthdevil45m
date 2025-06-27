// ==========================================================
// Gattahu System Variables and Functions (Prefixed with 'gattahu')
// ==========================================================
let gattahuCurrentLevel = 45; // 15 * 3
let gattahuCurrentStage = 1;
let gattahuCurrentBetUnit = 0;
let gattahuTotalUnits = 45; // 15 * 3 // Starting units set to 15 from level 15
let gattahuWinStreak = 0; // Consecutive win counter (0: first bet, 1: next bet after first win)
let gattahuBetHistory = []; // Array to store previous states for undo button

// Level and stage betting rules definition for Gattahu
const gattahuLevelMap = {
    9: { // 3 * 3
        3: { bet: 9, win: { type: 'goto', level: 18 }, lose: { type: 'gameOver' } } // bet: 3 * 3 = 9, level: 6 * 3 = 18
    },
    12: { // 4 * 3
        3: { bet: 12, win: { type: 'goto', level: 24 }, lose: { type: 'gameOver' } } // bet: 4 * 3 = 12, level: 8 * 3 = 24
    },
    15: { // 5 * 3
        3: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevel', units: [6, 12] }, lose: { type: 'goto', stage: 2 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12]
        6: { bet: 9, win: { type: 'calcLevelSubUnit', subtract: 6 }, lose: { type: 'gameOver' } } // bet: 3 * 3 = 9, subtract: 2 * 3 = 6
    },
    18: { // 6 * 3
        3: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevel', units: [6, 12] }, lose: { type: 'goto', stage: 2 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12]
        6: { bet: 12, win: { type: 'calcLevelSubUnit', subtract: 6 }, lose: { type: 'gameOver' } } // bet: 4 * 3 = 12, subtract: 2 * 3 = 6
    },
    21: { // 7 * 3
        3: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevel', units: [6, 12] }, lose: { type: 'goto', stage: 2 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12]
        6: { bet: 15, win: { type: 'calcLevelSubUnit', subtract: 6 }, lose: { type: 'gameOver' } } // bet: 5 * 3 = 15, subtract: 2 * 3 = 6
    },
    24: { // 8 * 3
        3: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevel', units: [6, 12] }, lose: { type: 'goto', stage: 2 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12]
        6: { bet: 18, win: { type: 'calcLevelSubUnit', subtract: 6 }, lose: { type: 'gameOver' } } // bet: 6 * 3 = 18, subtract: 2 * 3 = 6
    },
    27: { // 9 * 3
        3: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevel', units: [6, 12] }, lose: { type: 'goto', stage: 2 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12]
        6: { bet: 21, win: { type: 'calcLevelSubUnit', subtract: 6 }, lose: { type: 'gameOver' } } // bet: 7 * 3 = 21, subtract: 2 * 3 = 6
    },
    30: { // 10 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 21, win: { type: 'goto', level: 42 }, lose: { type: 'gameOver' } } // bet: 7 * 3 = 21, level: 14 * 3 = 42
    },
    33: { // 11 * 3
        3: { bet: 6, win: { type: 'calcLevelSumCurrentLevel', units: [6] }, lose: { type: 'goto', stage: 2 } }, // bet: 2 * 3 = 6, units: [2*3] = [6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 21, win: { type: 'goto', level: 42 }, lose: { type: 'gameOver' } } // bet: 7 * 3 = 21, level: 14 * 3 = 42
    },
    36: { // 12 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 3 * 3 = 9
        12: { bet: 21, win: { type: 'goto', level: 42 }, lose: { type: 'gameOver' } } // bet: 7 * 3 = 21, level: 14 * 3 = 42
    },
    39: { // 13 * 3
        3: { bet: 6, win: { type: 'calcLevelSumCurrentLevel', units: [6] }, lose: { type: 'goto', stage: 2 } }, // bet: 2 * 3 = 6, units: [2*3] = [6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 3 * 3 = 9
        12: { bet: 21, win: { type: 'goto', level: 42 }, lose: { type: 'gameOver' } } // bet: 7 * 3 = 21, level: 14 * 3 = 42
    },
    42: { // 14 * 3
        3: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevel', units: [6, 12] }, lose: { type: 'goto', stage: 2 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12]
        6: { bet: 9, win: { type: 'goto', level: 45 }, lose: { type: 'goto', stage: 3 } }, // bet: 3 * 3 = 9, level: 15 * 3 = 45
        9: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 15 }, lose: { type: 'gotoLevel', level: 18 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 5 * 3 = 15, level: 6 * 3 = 18
    },
    45: { // 15 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet: 3 * 3 = 9, units: [3*3] = [9], subtract: 3 * 3 = 9
        12: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 18 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 27 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 6 * 3 = 18, subtract: 9 * 3 = 27
    },
    48: { // 16 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet: 3 * 3 = 9, units: [3*3] = [9], subtract: 3 * 3 = 9
        12: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 18 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 27 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 6 * 3 = 18, subtract: 9 * 3 = 27
    },
    51: { // 17 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet: 3 * 3 = 9, units: [3*3] = [9], subtract: 3 * 3 = 9
        12: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 18 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 27 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 6 * 3 = 18, subtract: 9 * 3 = 27
    },
    54: { // 18 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet: 3 * 3 = 9, units: [3*3] = [9], subtract: 3 * 3 = 9
        12: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 18 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 27 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 6 * 3 = 18, subtract: 9 * 3 = 27
    },
    57: { // 19 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet: 3 * 3 = 9, units: [3*3] = [9], subtract: 3 * 3 = 9
        12: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 18 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 27 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 6 * 3 = 18, subtract: 9 * 3 = 27
    },
    60: { // 20 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet: 3 * 3 = 9, units: [3*3] = [9], subtract: 3 * 3 = 9
        12: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 18 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 27 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 6 * 3 = 18, subtract: 9 * 3 = 27
    },
    63: { // 21 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet: 3 * 3 = 9, units: [3*3] = [9], subtract: 3 * 3 = 9
        12: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 18 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 27 } } // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 6 * 3 = 18, subtract: 9 * 3 = 27
    },
    66: { // 22 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 3 * 3 = 9
        12: { // 4 * 3 = 12
            bet1: 27, bet2: 9, // bet1: 9 * 3 = 27, bet2: 3 * 3 = 9
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [27, 9], subtract: 18 }, // units: [9*3, 3*3] = [27, 9], subtract: 6 * 3 = 18
            lose: { type: 'specialLoseLevel22_4' } // Separate logic for 1st and 2nd loss
        }
    },
    69: { // 23 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 3 * 3 = 9
        12: { // 4 * 3 = 12
            bet1: 27, bet2: 9, // bet1: 9 * 3 = 27, bet2: 3 * 3 = 9
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [27, 9], subtract: 18 }, // units: [9*3, 3*3] = [27, 9], subtract: 6 * 3 = 18
            lose: { type: 'specialLoseLevel23_4' } // Separate logic for 1st and 2nd loss
        }
    },
    72: { // 24 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet1: 9, bet2: 18, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 18], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 6 * 3 = 18, units: [3*3, 6*3] = [9, 18], subtract: 3 * 3 = 9
        12: { // 4 * 3 = 12
            bet1: 27, bet2: 9, // bet1: 9 * 3 = 27, bet2: 3 * 3 = 9
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [27, 9], subtract: 18 }, // units: [9*3, 3*3] = [27, 9], subtract: 6 * 3 = 18
            lose: { type: 'specialLoseLevel24_4' } // Separate logic for 1st and 2nd loss
        }
    },
    75: { // 25 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 12], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 4 * 3 = 12, units: [2*3, 4*3] = [6, 12], subtract: 1 * 3 = 3
        9: { bet1: 9, bet2: 15, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 15], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 5 * 3 = 15, units: [3*3, 5*3] = [9, 15], subtract: 3 * 3 = 9
        12: { // 4 * 3 = 12
            bet1: 27, bet2: 6, // bet1: 9 * 3 = 27, bet2: 2 * 3 = 6
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [27, 6], subtract: 18 }, // units: [9*3, 2*3] = [27, 6], subtract: 6 * 3 = 18
            lose: { type: 'specialLoseLevel25_4' } // Separate logic for 1st and 2nd loss
        }
    },
    78: { // 26 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 9], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 3 * 3 = 9, units: [2*3, 3*3] = [6, 9], subtract: 1 * 3 = 3
        9: { bet1: 9, bet2: 12, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 12], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 4 * 3 = 12, units: [3*3, 4*3] = [9, 12], subtract: 3 * 3 = 9
        12: { // 4 * 3 = 12
            bet1: 27, bet2: 3, // bet1: 9 * 3 = 27, bet2: 1 * 3 = 3
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [27, 3], subtract: 18 }, // units: [9*3, 1*3] = [27, 3], subtract: 6 * 3 = 18
            lose: { type: 'specialLoseLevel26_4' } // Separate logic for 1st and 2nd loss
        }
    },
    81: { // 27 * 3
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevel', units: [3, 6] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 2 * 3 = 6, units: [1*3, 2*3] = [3, 6]
        6: { bet1: 6, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 6], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 2 * 3 = 6, units: [2*3, 2*3] = [6, 6], subtract: 1 * 3 = 3
        9: { bet1: 9, bet2: 9, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 9], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 3 * 3 = 9, units: [3*3, 3*3] = [9, 9], subtract: 3 * 3 = 9
        12: { bet: 27, win: { type: 'goto', level: 90 }, lose: { type: 'gotoLevel', level: 36 } } // bet: 9 * 3 = 27, level: 30 * 3 = 90, level: 12 * 3 = 36
    },
    84: { // 28 * 3
        3: { bet1: 3, bet2: 3, win: { type: 'calcLevelSumCurrentLevel', units: [3, 3] }, lose: { type: 'goto', stage: 2 } }, // bet1: 1 * 3 = 3, bet2: 1 * 3 = 3, units: [1*3, 1*3] = [3, 3]
        6: { bet1: 6, bet2: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [6, 3], subtract: 3 }, lose: { type: 'goto', stage: 3 } }, // bet1: 2 * 3 = 6, bet2: 1 * 3 = 3, units: [2*3, 1*3] = [6, 3], subtract: 1 * 3 = 3
        9: { bet1: 9, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 6], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 2 * 3 = 6, units: [3*3, 2*3] = [9, 6], subtract: 3 * 3 = 9
        12: { bet: 24, win: { type: 'goto', level: 90 }, lose: { type: 'gotoLevel', level: 42 } } // bet: 8 * 3 = 24, level: 30 * 3 = 90, level: 14 * 3 = 42
    },
    87: { // 29 * 3
        3: { bet: 3, win: { type: 'goto', level: 90 }, lose: { type: 'goto', stage: 2 } }, // bet: 1 * 3 = 3, level: 30 * 3 = 90
        6: { bet: 6, win: { type: 'goto', level: 90 }, lose: { type: 'goto', stage: 3 } }, // bet: 2 * 3 = 6, level: 30 * 3 = 90
        9: { bet1: 9, bet2: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 3], subtract: 9 }, lose: { type: 'goto', stage: 4 } }, // bet1: 3 * 3 = 9, bet2: 1 * 3 = 3, units: [3*3, 1*3] = [9, 3], subtract: 3 * 3 = 9
        12: { bet: 21, win: { type: 'goto', level: 90 }, lose: { type: 'gotoLevel', level: 48 } } // bet: 7 * 3 = 21, level: 30 * 3 = 90, level: 16 * 3 = 48
    },
    90: { // 30 * 3
        // Level 30 is the win target level, may not have special betting rules.
        // Or you can define betting rules for the final stage.
        3: { bet: 30, win: { type: 'gameWin' }, lose: { type: 'gameOver' } } // bet: 10 * 3 = 30
    }
};

// DOM elements for Gattahu System
const gattahuCurrentLevelEl = document.getElementById('gattahuCurrentLevel');
const gattahuCurrentStageEl = document.getElementById('gattahuCurrentStage');
const gattahuCurrentBetUnitEl = document.getElementById('gattahuCurrentBetUnit');
const gattahuTotalUnitsEl = document.getElementById('gattahuTotalUnits');
const gattahuMessageEl = document.getElementById('gattahuMessage');
const gattahuWinButton = document.getElementById('gattahuWinButton');
const gattahuLoseButton = document.getElementById('gattahuLoseButton');
const gattahuResetButton = document.getElementById('gattahuResetButton');
const gattahuUndoButton = document.getElementById('gattahuUndoButton');

// Gattahu Game Initialization Function
function gattahuInitializeGame() {
    gattahuCurrentLevel = 45; // 15 * 3 // Starting level changed to 15
    gattahuCurrentStage = 1;
    gattahuTotalUnits = 45; // 15 * 3 // Starting units changed to 15
    gattahuWinStreak = 0; // Reset consecutive win counter
    gattahuBetHistory = []; // Clear history
    gattahuUpdateDisplay(); // Update screen
    gattahuMessageEl.textContent = `게임 시작! 레벨 ${gattahuCurrentLevel}, ${gattahuCurrentStage}단계.`; // "Game Start! Level {level}, Stage {stage}."
    gattahuMessageEl.classList.remove('win', 'lose'); // Reset message class
    gattahuEnableButtons(); // Enable buttons
}

// Gattahu Display Update Function
function gattahuUpdateDisplay() {
    const levelData = gattahuLevelMap[gattahuCurrentLevel];
    if (levelData && levelData[gattahuCurrentStage]) {
        const stageData = levelData[gattahuCurrentStage];
        // Use bet1 or bet2 depending on winStreak value
        if (stageData.bet) { // If single bet is defined
            gattahuCurrentBetUnit = stageData.bet;
        } else if (stageData.bet1 && stageData.bet2) { // If 2-stage bet is defined
            gattahuCurrentBetUnit = gattahuWinStreak === 0 ? stageData.bet1 : stageData.bet2;
        } else {
            gattahuCurrentBetUnit = 0; // Undefined case
        }
    } else {
        gattahuCurrentBetUnit = 0; // Undefined level/stage (can happen when new levels need to be added)
    }

    gattahuCurrentLevelEl.textContent = gattahuCurrentLevel;
    gattahuCurrentStageEl.textContent = gattahuCurrentStage;
    gattahuCurrentBetUnitEl.textContent = gattahuCurrentBetUnit;
    gattahuTotalUnitsEl.textContent = gattahuTotalUnits;

    // Check game win condition
    if (gattahuTotalUnits >= 90) { // 30 * 3 = 90
        gattahuGameWin("축하합니다! 총 유닛이 90에 도달하여 게임에 승리했습니다!"); // "Congratulations! Total units reached 30, you won the game!"
        return; // Prevent further logic execution on win
    }
    // Check game over condition (excluding initialization)
    // If totalUnits are 0 or less, game over. Except when initial totalUnits is 15.
    if (gattahuTotalUnits <= 0 && !(gattahuCurrentLevel === 45 && gattahuCurrentStage === 1 && gattahuTotalUnits === 45)) { // current level: 15 * 3 = 45, totalUnits: 15 * 3 = 45
        gattahuGameOver("총 유닛이 0이거나 0 미만이 되어 게임에 패배했습니다."); // "Total units became 0 or less, you lost the game."
        return; // Prevent further logic execution on loss
    }

    // Update undo button active/inactive state
    gattahuUndoButton.disabled = gattahuBetHistory.length === 0;
}

// Gattahu Game Win Handling Function
function gattahuGameWin(msg) {
    gattahuMessageEl.textContent = msg;
    gattahuMessageEl.classList.remove('lose');
    gattahuMessageEl.classList.add('win'); // Apply win message style
    gattahuDisableButtons();
    gattahuCurrentLevelEl.textContent = "승리"; // "Win"
    gattahuCurrentStageEl.textContent = "승리"; // "Win"
    gattahuCurrentBetUnitEl.textContent = "0";
}

// Gattahu Game Over Handling Function
function gattahuGameOver(msg) {
    gattahuMessageEl.textContent = msg;
    gattahuMessageEl.classList.remove('win');
    gattahuMessageEl.classList.add('lose'); // Apply loss message style
    gattahuDisableButtons();
    gattahuCurrentLevelEl.textContent = "패배"; // "Loss"
    gattahuCurrentStageEl.textContent = "패배"; // "Loss"
    gattahuCurrentBetUnitEl.textContent = "0";
}

// Gattahu Button Disable Function
function gattahuDisableButtons() {
    gattahuWinButton.disabled = true;
    gattahuLoseButton.disabled = true;
    gattahuUndoButton.disabled = true;
}

// Gattahu Button Enable Function
function gattahuEnableButtons() {
    gattahuWinButton.disabled = false;
    gattahuLoseButton.disabled = false;
    // Undo button enabled only if history exists
    gattahuUndoButton.disabled = gattahuBetHistory.length === 0;
}

// Save current Gattahu game state (for undo button)
function gattahuSaveState() {
    gattahuBetHistory.push({
        level: gattahuCurrentLevel,
        stage: gattahuCurrentStage,
        totalUnits: gattahuTotalUnits,
        winStreak: gattahuWinStreak
    });
}

// Gattahu Win Button Click Handler
function handleGattahuWin() {
    gattahuSaveState(); // Save current state

    const levelData = gattahuLevelMap[gattahuCurrentLevel];
    if (!levelData || !levelData[gattahuCurrentStage]) {
        gattahuMessageEl.textContent = "오류: 현재 레벨/단계 데이터가 정의되지 않았습니다."; // "Error: Current level/stage data is undefined."
        gattahuGameOver("시스템 오류로 게임 종료."); // "Game over due to system error."
        return;
    }

    const stageData = levelData[gattahuCurrentStage];
    let unitsWon = gattahuCurrentBetUnit; // By default, units gained equal current bet unit

    // Increase total units
    gattahuTotalUnits += unitsWon;

    // Process win logic
    if (stageData.win.type === 'goto') {
        gattahuCurrentLevel = stageData.win.level;
        gattahuCurrentStage = 1;
        gattahuWinStreak = 0; // Reset consecutive wins when moving levels
        gattahuMessageEl.textContent = `승리! 레벨 ${gattahuCurrentLevel}로 이동합니다.`; // "Win! Moving to Level {level}."
    } else if (stageData.win.type === 'calcLevelSumCurrentLevel') {
        gattahuWinStreak++;
        if (gattahuWinStreak === 2) { // 2 consecutive wins
            const sumOfBetUnits = stageData.win.units.reduce((sum, u) => sum + u, 0);
            gattahuCurrentLevel += sumOfBetUnits;
            gattahuCurrentStage = 1;
            gattahuWinStreak = 0; // Reset consecutive wins after 2 consecutive wins
            gattahuMessageEl.textContent = `2연승! 레벨 ${gattahuCurrentLevel}로 이동합니다.`; // "2 consecutive wins! Moving to Level {level}."
        } else { // 1 consecutive win
            gattahuMessageEl.textContent = `승리! 2번째 베팅(${stageData.bet2}유닛)을 시도합니다.`; // "Win! Attempting 2nd bet ({units} units)."
        }
    } else if (stageData.win.type === 'calcLevelSumCurrentLevelSubtract') {
        gattahuWinStreak++;
        if (gattahuWinStreak === 2 || !stageData.bet1 || !stageData.bet2) { // 2 consecutive wins or single bet of this type
            const sumOfBetUnits = stageData.win.units.reduce((sum, u) => sum + u, 0);
            gattahuCurrentLevel += sumOfBetUnits - stageData.win.subtract;
            gattahuCurrentStage = 1;
            gattahuWinStreak = 0;
            gattahuMessageEl.textContent = `승리! 레벨 ${gattahuCurrentLevel}로 이동합니다.`; // "Win! Moving to Level {level}."
        } else { // 1 consecutive win
            gattahuMessageEl.textContent = `승리! 2번째 베팅(${stageData.bet2}유닛)을 시도합니다.`; // "Win! Attempting 2nd bet ({units} units)."
        }
    } else if (stageData.win.type === 'gameWin') {
        gattahuGameWin("최종 목표 달성! 게임에 승리했습니다!"); // "Final goal achieved! You won the game!"
        return;
    } else {
        gattahuMessageEl.textContent = "오류: 알 수 없는 승리 규칙입니다."; // "Error: Unknown win rule."
        gattahuGameOver("시스템 오류로 게임 종료."); // "Game over due to system error."
        return;
    }

    gattahuUpdateDisplay();
}

// Gattahu Lose Button Click Handler
function handleGattahuLose() {
    gattahuSaveState(); // Save current state

    const levelData = gattahuLevelMap[gattahuCurrentLevel];
    if (!levelData || !levelData[gattahuCurrentStage]) {
        gattahuMessageEl.textContent = "오류: 현재 레벨/단계 데이터가 정의되지 않았습니다."; // "Error: Current level/stage data is undefined."
        gattahuGameOver("시스템 오류로 게임 종료."); // "Game over due to system error."
        return;
    }

    const stageData = levelData[gattahuCurrentStage];
    let unitsLost = gattahuCurrentBetUnit; // Units lost equal current bet unit

    // Decrease total units
    gattahuTotalUnits -= unitsLost;

    // Reset consecutive win counter
    gattahuWinStreak = 0;

    // Process lose logic
    if (stageData.lose.type === 'gameOver') {
        gattahuGameOver("베팅 패배로 유닛이 소진되었습니다."); // "Units depleted due to bet loss."
    } else if (stageData.lose.type === 'goto') {
        gattahuCurrentStage = stageData.lose.stage;
        gattahuMessageEl.textContent = `패배! ${gattahuCurrentStage}단계로 이동합니다.`; // "Loss! Moving to Stage {stage}."
    } else if (stageData.lose.type === 'gotoLevel') {
        gattahuCurrentLevel = stageData.lose.level;
        gattahuCurrentStage = 1; // Reset to stage 1 when moving levels
        gattahuMessageEl.textContent = `패배! 레벨 ${gattahuCurrentLevel}로 이동합니다.`; // "Loss! Moving to Level {level}."
    } else if (stageData.lose.type === 'calcLevelSubCurrentLevel') {
        gattahuCurrentLevel -= stageData.lose.subtract;
        gattahuCurrentStage = 1; // Reset to stage 1 when moving levels
        gattahuMessageEl.textContent = `패배! 레벨 ${gattahuCurrentLevel}로 이동합니다.`; // "Loss! Moving to Level {level}."
    }
    // Special loss logic for Level 22-26, Stage 4
    else if (stageData.lose.type && stageData.lose.type.startsWith('specialLoseLevel')) {
        let nextLevel = gattahuCurrentLevel;
        // If lost bet unit matches first bet unit (bet1), consider it 1st loss
        // Otherwise (mostly if lost on 2nd bet unit bet2), consider it 2nd loss
        if (unitsLost === stageData.bet1) {
            nextLevel = gattahuCurrentLevel - 45; // 15 * 3 = 45
            gattahuMessageEl.textContent = `패배! (1번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`; // "Loss! (1st bet failed) Moving to Level {level}."
        } else if (unitsLost === stageData.bet2) {
            if (stageData.lose.type === 'specialLoseLevel25_4') {
                nextLevel = gattahuCurrentLevel + 3; // 1 * 3 = 3
                gattahuMessageEl.textContent = `패배! (2번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`; // "Loss! (2nd bet failed) Moving to Level {level}."
            } else if (stageData.lose.type === 'specialLoseLevel26_4') {
                nextLevel = gattahuCurrentLevel + 6; // 2 * 3 = 6
                gattahuMessageEl.textContent = `패배! (2번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`; // "Loss! (2nd bet failed) Moving to Level {level}."
            } else { // For Level 22, 23, 24 Stage 4, 2nd bet loss
                nextLevel = gattahuCurrentLevel; // Maintain current level
                gattahuMessageEl.textContent = `패배! (2번째 베팅 실패) 현재 레벨 ${nextLevel}을 유지합니다.`; // "Loss! (2nd bet failed) Maintaining current Level {level}."
            }
        } else {
            gattahuMessageEl.textContent = "오류: 알 수 없는 4단계 패배 규칙입니다."; // "Error: Unknown Stage 4 loss rule."
            gattahuGameOver("시스템 오류로 게임 종료."); // "Game over due to system error."
            return;
        }
        gattahuCurrentLevel = nextLevel;
        gattahuCurrentStage = 1; // Move to Stage 1 of the next level after special loss
    }
    else {
        gattahuMessageEl.textContent = "알 수 없는 패배 규칙입니다."; // "Unknown loss rule."
        gattahuGameOver("시스템 오류로 게임 종료."); // "Game over due to system error."
        return;
    }

    gattahuUpdateDisplay();
}

// Gattahu Reset Button Click Handler
function handleGattahuReset() {
    // Replaced confirm() with a custom modal/message box in a real app
    if (window.confirm("정말로 게임을 리셋하시겠습니까?")) { // "Are you sure you want to reset the game?"
        gattahuInitializeGame();
    }
}

// Gattahu Undo Button Click Handler
function handleGattahuUndo() {
    if (gattahuBetHistory.length > 0) {
        const prevState = gattahuBetHistory.pop(); // Get the most recent state
        gattahuCurrentLevel = prevState.level;
        gattahuCurrentStage = prevState.stage;
        gattahuTotalUnits = prevState.totalUnits;
        gattahuWinStreak = prevState.winStreak;
        gattahuMessageEl.textContent = "이전 상태로 돌아갑니다."; // "Returning to previous state."
        gattahuMessageEl.classList.remove('win', 'lose'); // Reset message class
        gattahuUpdateDisplay();
        gattahuEnableButtons(); // Enable buttons after undo
    } else {
        gattahuMessageEl.textContent = "더 이상 돌아갈 이전 상태가 없습니다."; // "No previous state to return to."
        gattahuUndoButton.disabled = true; // Disable if no history
    }
}

// Event Listeners for Gattahu System
gattahuWinButton.addEventListener('click', handleGattahuWin);
gattahuLoseButton.addEventListener('click', handleGattahuLose);
gattahuResetButton.addEventListener('click', handleGattahuReset);
gattahuUndoButton.addEventListener('click', handleGattahuUndo);

// ==========================================================
// Baccarat Prophet Variables and Functions (Prefixed with 'baccarat')
// ==========================================================
let baccaratDice = [];
let baccaratResult = '';
let baccaratCount = 0;
let baccaratBankerCount = 0;
let baccaratPlayerCount = 0;
let baccaratTieCount = 0;
let baccaratConsecutiveBanker = 0;
let baccaratConsecutivePlayer = 0;
let baccaratConsecutiveTie = 0;
let baccaratLastResult = null;
let baccaratBankerBeforeTie = 0;
let baccaratPlayerBeforeTie = 0;
let baccaratHistory = [];

// DOM elements for Baccarat Prophet
const baccaratDiceDisplay = document.getElementById('baccaratDiceDisplay');
const baccaratResultDisplay = document.getElementById('baccaratResultDisplay');
const baccaratTotalCountEl = document.getElementById('baccaratTotalCount');
const baccaratBankerCountEl = document.getElementById('baccaratBankerCount');
const baccaratPlayerCountEl = document.getElementById('baccaratPlayerCount');
const baccaratTieCountEl = document.getElementById('baccaratTieCount');
const baccaratConsecutiveBankerEl = document.getElementById('baccaratConsecutiveBanker');
const baccaratConsecutivePlayerEl = document.getElementById('baccaratConsecutivePlayer');
const baccaratConsecutiveTieEl = document.getElementById('baccaratConsecutiveTie');
const baccaratRollButton = document.getElementById('baccaratRollButton');
const baccaratUndoButton = document.getElementById('baccaratUndoButton');
const baccaratResetButton = document.getElementById('baccaratResetButton');

// Helper function to check if a number is odd
const baccaratIsOdd = (num) => num % 2 === 1;
// Helper function to check if a number is even
const baccaratIsEven = (num) => num % 2 === 0;

// Update Baccarat Prophet UI
function baccaratUpdateDisplay() {
    baccaratDiceDisplay.textContent = baccaratDice.length ? baccaratDice.join(', ') : '아직 예언되지 않음'; // "Not yet prophesied"
    baccaratResultDisplay.innerHTML = `<span class="baccarat-arrow">👉</span> ${baccaratResult}`;
    baccaratTotalCountEl.textContent = baccaratCount;
    baccaratBankerCountEl.textContent = baccaratBankerCount;
    baccaratPlayerCountEl.textContent = baccaratPlayerCount;
    baccaratTieCountEl.textContent = baccaratTieCount;
    baccaratConsecutiveBankerEl.textContent = baccaratConsecutiveBanker;
    baccaratConsecutivePlayerEl.textContent = baccaratConsecutivePlayer;
    baccaratConsecutiveTieEl.textContent = baccaratConsecutiveTie;

    // Update button states
    baccaratUndoButton.disabled = baccaratHistory.length === 0;
}

// Save current Baccarat Prophet state to history
function baccaratSaveStateToHistory() {
    baccaratHistory.push({
        dice: [...baccaratDice], // Deep copy array
        result: baccaratResult,
        count: baccaratCount,
        bankerCount: baccaratBankerCount,
        playerCount: baccaratPlayerCount,
        tieCount: baccaratTieCount,
        consecutiveBanker: baccaratConsecutiveBanker,
        consecutivePlayer: baccaratConsecutivePlayer,
        consecutiveTie: baccaratConsecutiveTie,
        lastResult: baccaratLastResult,
        bankerBeforeTie: baccaratBankerBeforeTie,
        playerBeforeTie: baccaratPlayerBeforeTie,
    });
}

// Function to roll the dice and determine the outcome for Baccarat Prophet
function baccaratRollDice() {
    baccaratSaveStateToHistory();

    const newDice = Array.from({ length: 30 }, () => Math.floor(Math.random() * 6) + 1);
    baccaratDice = newDice; // Update the global variable directly

    const oddCount = newDice.filter(baccaratIsOdd).length;
    const evenCount = newDice.filter(baccaratIsEven).length;

    let currentResult = '';
    if (oddCount > evenCount) {
        currentResult = 'BANKER';
    } else if (evenCount > oddCount) {
        currentResult = 'PLAYER';
    } else {
        currentResult = 'TIE';
    }
    baccaratResult = currentResult; // Update global variable

    if (currentResult === 'BANKER') {
        baccaratBankerCount++;
    } else if (currentResult === 'PLAYER') {
        baccaratPlayerCount++;
    } else {
        baccaratTieCount++;
    }
    baccaratCount++;

    // Logic for consecutive counts based on new requirements
    if (currentResult === 'TIE') {
        baccaratConsecutiveTie++;
        if (baccaratLastResult !== 'TIE') {
            baccaratBankerBeforeTie = baccaratConsecutiveBanker;
            baccaratPlayerBeforeTie = baccaratConsecutivePlayer;
        }
    } else if (currentResult === 'BANKER') {
        baccaratConsecutiveTie = 0;
        baccaratConsecutivePlayer = 0;

        if (baccaratLastResult === 'BANKER') {
            baccaratConsecutiveBanker++;
        } else if (baccaratLastResult === 'TIE') {
            baccaratConsecutiveBanker = baccaratBankerBeforeTie + 1;
        } else {
            baccaratConsecutiveBanker = 1;
        }
        baccaratBankerBeforeTie = 0;
        baccaratPlayerBeforeTie = 0;
    } else { // currentResult === 'PLAYER'
        baccaratConsecutiveTie = 0;
        baccaratConsecutiveBanker = 0;

        if (baccaratLastResult === 'PLAYER') {
            baccaratConsecutivePlayer++;
        } else if (baccaratLastResult === 'TIE') {
            baccaratConsecutivePlayer = baccaratPlayerBeforeTie + 1;
        } else {
            baccaratConsecutivePlayer = 1;
        }
        baccaratPlayerBeforeTie = 0;
        baccaratBankerBeforeTie = 0;
    }

    baccaratLastResult = currentResult;
    baccaratUpdateDisplay();
}

// Function to go back to the previous state for Baccarat Prophet
function baccaratGoBack() {
    if (baccaratHistory.length > 0) {
        const previousState = baccaratHistory.pop();

        baccaratDice = previousState.dice;
        baccaratResult = previousState.result;
        baccaratCount = previousState.count;
        baccaratBankerCount = previousState.bankerCount;
        baccaratPlayerCount = previousState.playerCount;
        baccaratTieCount = previousState.tieCount;
        baccaratConsecutiveBanker = previousState.consecutiveBanker;
        baccaratConsecutivePlayer = previousState.consecutivePlayer;
        baccaratConsecutiveTie = previousState.consecutiveTie;
        baccaratLastResult = previousState.lastResult;
        baccaratBankerBeforeTie = previousState.bankerBeforeTie;
        baccaratPlayerBeforeTie = previousState.playerBeforeTie;
        baccaratUpdateDisplay();
    }
}

// Function to reset all game states for Baccarat Prophet
function baccaratResetGame() {
    baccaratDice = [];
    baccaratResult = '';
    baccaratCount = 0;
    baccaratBankerCount = 0;
    baccaratPlayerCount = 0;
    baccaratTieCount = 0;
    baccaratConsecutiveBanker = 0;
    baccaratConsecutivePlayer = 0;
    baccaratConsecutiveTie = 0;
    baccaratLastResult = null;
    baccaratBankerBeforeTie = 0;
    baccaratPlayerBeforeTie = 0;
    baccaratHistory = [];
    baccaratUpdateDisplay();
}

// Event Listeners for Baccarat Prophet
baccaratRollButton.addEventListener('click', baccaratRollDice);
baccaratUndoButton.addEventListener('click', baccaratGoBack);
baccaratResetButton.addEventListener('click', baccaratResetGame);

// ==========================================================
// Global Initialization on DOM Content Loaded
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    gattahuInitializeGame();
    baccaratResetGame(); // Call baccaratResetGame to initialize its display properly
});