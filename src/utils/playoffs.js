export function generateSemifinals(rankingA, rankingB) {
  return [
    {
      id: "SF1",
      home: rankingA[0].players,
      away: rankingB[1].players,
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
    {
      id: "SF2",
      home: rankingB[0].players,
      away: rankingA[1].players,
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
  ];
}
export function generateFinal(semifinals) {
  const winners = semifinals.filter(
    (match) => match.finished
  );

  if (winners.length !== 2) {
    return [];
  }

  return [
    {
      id: "FINAL",
      home:
        Number(winners[0].scoreHome) >
        Number(winners[0].scoreAway)
          ? winners[0].home
          : winners[0].away,

      away:
        Number(winners[1].scoreHome) >
        Number(winners[1].scoreAway)
          ? winners[1].home
          : winners[1].away,

      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
  ];
}
export function generateQuarterFinals(rankingA, rankingB) {
  if (
    !Array.isArray(rankingA) ||
    !Array.isArray(rankingB) ||
    rankingA.length < 4 ||
    rankingB.length < 4
  ) {
    throw new Error(
      "São necessárias quatro duplas classificadas em cada grupo."
    );
  }

  return [
    {
      id: "QF1",
      home: rankingA[0].players,
      away: rankingB[3].players,
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
    {
      id: "QF2",
      home: rankingA[1].players,
      away: rankingB[2].players,
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
    {
      id: "QF3",
      home: rankingB[0].players,
      away: rankingA[3].players,
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
    {
      id: "QF4",
      home: rankingB[1].players,
      away: rankingA[2].players,
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
  ];
}
export function generateSemifinalsFromQuarterFinals(quarterFinals) {
  if (
    !Array.isArray(quarterFinals) ||
    quarterFinals.length !== 4 ||
    !quarterFinals.every((match) => match.finished)
  ) {
    return [];
  }

  function getWinner(match) {
    return Number(match.scoreHome) >
      Number(match.scoreAway)
      ? match.home
      : match.away;
  }

  return [
    {
      id: "SF1",
      home: getWinner(quarterFinals[0]),
      away: getWinner(quarterFinals[1]),
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
    {
      id: "SF2",
      home: getWinner(quarterFinals[2]),
      away: getWinner(quarterFinals[3]),
      scoreHome: "",
      scoreAway: "",
      finished: false,
    },
  ];
}