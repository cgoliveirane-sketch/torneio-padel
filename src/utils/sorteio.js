export function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function createBalancedTeams(pool1, pool2) {
  if (!Array.isArray(pool1) || !Array.isArray(pool2)) {
    throw new Error("As listas de jogadores precisam ser válidas.");
  }

  if (pool1.length !== pool2.length) {
    throw new Error(
      "As duas listas precisam ter a mesma quantidade de jogadores."
    );
  }

  if (pool1.length === 0) {
    throw new Error("As listas de jogadores estão vazias.");
  }

  const shuffledPool1 = shuffleArray(pool1);
  const shuffledPool2 = shuffleArray(pool2);

  return shuffledPool1.map((player1, index) => ({
    id: "D" + (index + 1),
    player1,
    player2: shuffledPool2[index],
  }));
}

export function distributeTeamsIntoGroups(teams) {
  if (!Array.isArray(teams) || teams.length === 0) {
    throw new Error("Nenhuma dupla disponível para sortear os grupos.");
  }

  const shuffledTeams = shuffleArray(teams);
  const middle = Math.ceil(shuffledTeams.length / 2);

  const groupA = shuffledTeams.slice(0, middle).map((team, index) => ({
    ...team,
    id: "A" + (index + 1),
    group: "A",
  }));

  const groupB = shuffledTeams.slice(middle).map((team, index) => ({
    ...team,
    id: "B" + (index + 1),
    group: "B",
  }));

  return {
    A: groupA,
    B: groupB,
  };
}

export function replacePlayerInTeam(teams, teamId, field, newPlayer) {
  if (!["player1", "player2"].includes(field)) {
    throw new Error("Campo de jogador inválido.");
  }

  return teams.map((team) =>
    team.id === teamId
      ? {
          ...team,
          [field]: newPlayer,
        }
      : team
  );
}