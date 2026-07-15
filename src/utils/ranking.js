export function calculateRanking(teams, matches) {
  const ranking = {};

  teams.forEach((team) => {
    ranking[team.id] = {
      id: team.id,
      players: team.player1 + " / " + team.player2,
      games: 0,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      balance: 0,
    };
  });

  matches
    .filter((match) => match.finished)
    .forEach((match) => {
      const home = ranking[match.home];
      const away = ranking[match.away];

      if (!home || !away) {
        return;
      }

      home.games += 1;
      away.games += 1;

      home.pointsFor += Number(match.scoreHome);
      home.pointsAgainst += Number(match.scoreAway);

      away.pointsFor += Number(match.scoreAway);
      away.pointsAgainst += Number(match.scoreHome);

      if (Number(match.scoreHome) > Number(match.scoreAway)) {
        home.wins += 1;
        away.losses += 1;
      } else {
        away.wins += 1;
        home.losses += 1;
      }

      home.balance =
        home.pointsFor - home.pointsAgainst;

      away.balance =
        away.pointsFor - away.pointsAgainst;
    });

  return Object.values(ranking).sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    if (b.balance !== a.balance) {
      return b.balance - a.balance;
    }

    if (b.pointsFor !== a.pointsFor) {
      return b.pointsFor - a.pointsFor;
    }

    return a.pointsAgainst - b.pointsAgainst;
  });
}