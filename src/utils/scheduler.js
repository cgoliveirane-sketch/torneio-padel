export function generateRoundRobin(teams, groupName) {
  if (!Array.isArray(teams)) {
    throw new Error("A lista de duplas precisa ser válida.");
  }

  if (teams.length !== 5) {
    throw new Error(
      "O Grupo " +
        groupName +
        " precisa ter exatamente 5 duplas."
    );
  }

  // Sequência equilibrada:
  // nenhuma dupla aparece em dois jogos consecutivos.
  const fairSchedule = [
    [0, 1],
    [2, 3],
    [0, 4],
    [1, 2],
    [3, 4],
    [0, 2],
    [1, 3],
    [2, 4],
    [0, 3],
    [1, 4],
  ];

  return fairSchedule.map((pair, index) => {
    const homeTeam = teams[pair[0]];
    const awayTeam = teams[pair[1]];

    return {
      id: groupName + "-J" + (index + 1),
      group: groupName,
      order: index + 1,

      home: homeTeam.id,
      away: awayTeam.id,

      scoreHome: "",
      scoreAway: "",

      winner: null,
      finished: false,
    };
  });
}

export function generateTournamentGroupMatches(groups) {
  if (
    !groups ||
    !Array.isArray(groups.A) ||
    !Array.isArray(groups.B)
  ) {
    throw new Error(
      "Os grupos A e B ainda não foram definidos."
    );
  }

  return {
    A: generateRoundRobin(groups.A, "A"),
    B: generateRoundRobin(groups.B, "B"),
  };
}

export function getNextMatch(matches) {
  if (!Array.isArray(matches)) {
    return null;
  }

  return (
    matches.find((match) => !match.finished) || null
  );
}

export function finishMatch(
  matches,
  matchId,
  scoreHome,
  scoreAway,
  pointLimit
) {
  if (!Array.isArray(matches)) {
    throw new Error("A lista de jogos é inválida.");
  }

  const homeScore = Number(scoreHome);
  const awayScore = Number(scoreAway);

  if (
    !Number.isFinite(homeScore) ||
    !Number.isFinite(awayScore)
  ) {
    throw new Error("Informe placares válidos.");
  }

  if (homeScore < 0 || awayScore < 0) {
    throw new Error(
      "O placar não pode ser negativo."
    );
  }

  if (homeScore === awayScore) {
    throw new Error(
      "O jogo precisa ter um vencedor."
    );
  }
const limit = Number(pointLimit);

if (!Number.isFinite(limit) || limit <= 0) {
  throw new Error(
    "O limite de pontos da partida é inválido."
  );
}

if (homeScore > limit || awayScore > limit) {
  throw new Error(
    "O placar não pode ultrapassar " +
      limit +
      " pontos."
  );
}

if (homeScore !== limit && awayScore !== limit) {
  throw new Error(
    "Uma das duplas precisa atingir " +
      limit +
      " pontos para vencer."
  );
}

  return matches.map((match) => {
    if (match.id !== matchId) {
      return match;
    }

    return {
      ...match,
      scoreHome: homeScore,
      scoreAway: awayScore,
      winner:
        homeScore > awayScore
          ? match.home
          : match.away,
      finished: true,
    };
  });
}