export const defaultTournament = {
  tournamentName: "Torneio Padel Pós Venda",

  settings: {
    useQuarterFinals: true,

    groupPoints: 6,
    quarterPoints: 4,
    semiPoints: 6,
    finalPoints: 9,
  },

  pools: {
    pool1: [],
    pool2: [],
  },

  teams: [],

  groups: {
    A: [],
    B: [],
  },

  groupMatches: {
    A: [],
    B: [],
  },

  knockout: {
    quarterFinals: [],
    semiFinals: [],
    final: [],
  },

  ranking: {
    A: [],
    B: [],
  },

  champion: null,

  currentMatch: {
    group: null,
    match: null,
  },
};