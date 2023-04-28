const PlayerRoles = {
    Operative: 'Operative',
    Spymaster: 'Spymaster'
};

const Teams = {
    NEUTRAL: 0,
    RED: 1,
    BLUE: 2,
    BLACK: 3
};

const TeamNames = {
    [Teams.NEUTRAL]: 'NEUTRAL',
    [Teams.RED]: 'RED',
    [Teams.BLUE]: 'BLUE',
    [Teams.BLACK]: 'BLACK',
};

const TeamStyleTags = {
    0: 'neutral',
    1: 'teamA',
    2: 'teamB',
    3: 'assassin'
}

export { PlayerRoles, Teams, TeamNames, TeamStyleTags };