export enum Team {
    NEUTRAL =  0,
    RED = 1,
    BLUE = 2,
    BLACK = 3
}

export enum Role {
    Spymaster = 'spymaster',
    Operative = 'operative'
}

export interface Clue {
    text: string;
    number: number;
}

export interface Board {
    gameId: number;
    boardKey: Team[];
    words: string[];
    startingTeam: Team;
    revealedCards: number[];
    currentGuessingTeam: Team;
    clue: Clue;
}