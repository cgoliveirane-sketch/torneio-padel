import { useState, useEffect } from "react";

import { playerPool1, playerPool2 } from "../data/players";
import KnockoutMatch from "../components/KnockoutMatch";
import {
  generateQuarterFinals,
  generateSemifinals,
  generateSemifinalsFromQuarterFinals,
  generateFinal,
} from "../utils/playoffs";
import RankingTable from "../components/RankingTable";

import {
  createBalancedTeams,
  distributeTeamsIntoGroups,
  replacePlayerInTeam,
} from "../utils/sorteio";

import {
  generateTournamentGroupMatches,
  finishMatch,
} from "../utils/scheduler";

import { calculateRanking } from "../utils/ranking";
import {
  saveTournament,
  loadTournament,
  clearTournament,
} from "../utils/storage";
import ChampionCard from "../components/ChampionCard";
import Bracket from "../components/Bracket";
import PodiumCard from "../components/PodiumCard";

export default function Sorteio({settings}) {
  const [teams, setTeams] = useState([]);

  const [groups, setGroups] = useState({
    A: [],
    B: [],
  });

  const [matches, setMatches] = useState({
    A: [],
    B: [],
  });
  const [quarterFinals, setQuarterFinals] = useState([]);
  const [semifinals, setSemifinals] = useState([]);
  const [finalMatch, setFinalMatch] = useState([]);
  const [champion, setChampion] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [storageLoaded, setStorageLoaded] = useState(false);
useEffect(() => {
  const saved = loadTournament();

  if (!saved) {
    return;
  }

  setTeams(saved.teams || []);

  setGroups(
    saved.groups || {
      A: [],
      B: [],
    }
  );

  setMatches(
    saved.matches || {
      A: [],
      B: [],
    }
  );

  setQuarterFinals(saved.quarterFinals || []);
  setSemifinals(saved.semifinals || []);
  setFinalMatch(saved.finalMatch || []);
  setChampion(saved.champion || null);
  setConfirmed(saved.confirmed || false);
  setStorageLoaded(true);
}, []);
useEffect(() => {
    if (!storageLoaded) {
      return;
    }
  saveTournament({
    teams,
    groups,
    matches,
    quarterFinals,
    semifinals,
    finalMatch,
    champion,
    confirmed,
  });
}, [
  teams,
  groups,
  matches,
  quarterFinals,
  semifinals,
  finalMatch,
  champion,
  confirmed,
]);
  const groupPointOptions = Array.from(
  { length: settings.groupPoints + 1 },
  (_, index) => index
);

const quarterPointOptions = Array.from(
  { length: settings.quarterPoints + 1 },
  (_, index) => index
);

const semiPointOptions = Array.from(
  { length: settings.semiPoints + 1 },
  (_, index) => index
);

const finalPointOptions = Array.from(
  { length: settings.finalPoints + 1 },
  (_, index) => index
);

  const rankingA = calculateRanking(groups.A, matches.A);
  const rankingB = calculateRanking(groups.B, matches.B);
const nextMatchA =
  matches.A.find((match) => !match.finished) || null;

const nextMatchB =
  matches.B.find((match) => !match.finished) || null;

const finishedMatchesA = matches.A.filter(
  (match) => match.finished
).length;

const finishedMatchesB = matches.B.filter(
  (match) => match.finished
).length;

const groupStageFinished =
  matches.A.length === 10 &&
  matches.B.length === 10 &&
  finishedMatchesA === 10 &&
  finishedMatchesB === 10;

const semifinalMatches = groupStageFinished
  ? [
      {
        id: "SF1",
        home: rankingA[0]?.id,
        away: rankingB[1]?.id,
      },
      {
        id: "SF2",
        home: rankingB[0]?.id,
        away: rankingA[1]?.id,
      },
    ]
  : [];
  function clearMatches() {
    setMatches({
      A: [],
      B: [],
    });
  }

  function handleGenerateTeams() {
    try {
      const generatedTeams = createBalancedTeams(
        playerPool1,
        playerPool2
      );

      setTeams(generatedTeams);

      setGroups({
        A: [],
        B: [],
      });

      clearMatches();
      setConfirmed(false);
      setMessage("As 10 duplas foram sorteadas.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleChangePlayer(teamId, field, value) {
    setTeams((currentTeams) =>
      replacePlayerInTeam(
        currentTeams,
        teamId,
        field,
        value
      )
    );

    setGroups({
      A: [],
      B: [],
    });

    clearMatches();
    setConfirmed(false);

    setMessage(
      "Dupla alterada. Confirme novamente antes de sortear os grupos."
    );
  }

  function handleConfirmTeams() {
    if (teams.length !== 10) {
      setMessage("Primeiro gere as 10 duplas.");
      return;
    }

    const players = teams.flatMap((team) => [
      team.player1.trim(),
      team.player2.trim(),
    ]);

    const hasEmptyPlayer = players.some(
      (player) => player === ""
    );

    if (hasEmptyPlayer) {
      setMessage(
        "Existe algum jogador sem nome. Revise as duplas."
      );
      return;
    }

    const normalizedPlayers = players.map((player) =>
      player.toLocaleLowerCase("pt-BR")
    );

    const hasDuplicatePlayer =
      new Set(normalizedPlayers).size !==
      normalizedPlayers.length;

    if (hasDuplicatePlayer) {
      setMessage(
        "Existe algum jogador repetido em mais de uma dupla."
      );
      return;
    }

    setConfirmed(true);

    setMessage(
      "Duplas confirmadas. Agora sorteie os grupos."
    );
  }

  function handleDrawGroups() {
    if (!confirmed) {
      setMessage(
        "Confirme as duplas antes de sortear os grupos."
      );
      return;
    }

    try {
      const generatedGroups =
        distributeTeamsIntoGroups(teams);

      setGroups(generatedGroups);
      clearMatches();

      setMessage(
        "Grupos A e B sorteados com sucesso."
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleGenerateMatches() {
    try {
      const generatedMatches =
        generateTournamentGroupMatches(groups);

      setMatches(generatedMatches);

      setMessage(
        "Os 20 jogos da fase de grupos foram gerados."
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleScoreChange(
    groupName,
    matchId,
    field,
    value
  ) {
    if (value !== "" && Number(value) < 0) {
      return;
    }

    setMatches((currentMatches) => ({
      ...currentMatches,

      [groupName]: currentMatches[groupName].map(
        (match) =>
          match.id === matchId
            ? {
                ...match,
                [field]: value,
                finished: false,
                winner: null,
              }
            : match
      ),
    }));
  }

  function handleFinishMatch(groupName, match) {
    try {
      const updatedGroupMatches = finishMatch(
        matches[groupName],
        match.id,
        match.scoreHome,
        match.scoreAway,
        settings.groupPoints
      );

    setMatches((currentMatches) => ({
  ...currentMatches,
  [groupName]: updatedGroupMatches,
}));

const allMatches = {
  ...matches,
  [groupName]: updatedGroupMatches,
};

const totalFinished =
  allMatches.A.filter((item) => item.finished).length +
  allMatches.B.filter((item) => item.finished).length;

if (totalFinished === 20 ) {
  const updatedRankingA = calculateRanking(
    groups.A,
    allMatches.A
  );

  const updatedRankingB = calculateRanking(
    groups.B,
    allMatches.B
  );
  if (settings.useQuarterFinals) {
 setQuarterFinals(
    generateQuarterFinals(
        updatedRankingA,
        updatedRankingB
    )
);

setMessage(
    "Fase de grupos encerrada. Quartas de final geradas."
);

return;
}

if (semifinals.length === 0) {
  setSemifinals(
    generateSemifinals(updatedRankingA, updatedRankingB)
  );

  setMessage(
    "Fase de grupos encerrada. Semifinais geradas."
  );

  return;
}

  setSemifinals(
    generateSemifinals(
      updatedRankingA,
      updatedRankingB
    )
  );

  setMessage(
    "Fase de grupos encerrada. Semifinais geradas."
  );

  return;
}

setMessage(
  "Resultado salvo e classificação atualizada."
);

      setMessage(
        "Resultado salvo e classificação atualizada."
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleReset() {
    const confirmedReset = window.confirm(
      "Deseja apagar as duplas, os grupos, os jogos e os resultados?"
    );

    if (!confirmedReset) {
      return;
    }

    setTeams([]);

    setGroups({
      A: [],
      B: [],
    });

    setMatches({
      A: [],
      B: [],
    });

    setConfirmed(false);
    setMessage("Sorteio reiniciado.");
  }

  function getTeamLabel(groupName, teamId) {
    const team = groups[groupName].find(
      (item) => item.id === teamId
    );

    if (!team) {
      return teamId;
    }

    return team.player1 + " / " + team.player2;
  }

  function getWinnerLabel(groupName, winnerId) {
    if (!winnerId) {
      return "";
    }

    return getTeamLabel(groupName, winnerId);
  }

  function renderRanking(groupName, ranking) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b bg-slate-50 px-5 py-4">
          <h2 className="text-2xl font-bold">
            Classificação - Grupo {groupName}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-3">
                  Pos.
                </th>

                <th className="px-4 py-3">
                  Dupla
                </th>

                <th className="px-4 py-3 text-center">
                  J
                </th>

                <th className="px-4 py-3 text-center">
                  V
                </th>

                <th className="px-4 py-3 text-center">
                  D
                </th>

                <th className="px-4 py-3 text-center">
                  PF
                </th>

                <th className="px-4 py-3 text-center">
                  PC
                </th>

                <th className="px-4 py-3 text-center">
                  Saldo
                </th>
              </tr>
            </thead>

            <tbody>
              {ranking.map((team, index) => (
                <tr
                  key={team.id}
                  className={
  index === 0
    ? "border-t bg-green-200"
    : index === 1
    ? "border-t bg-green-100"
    : "border-t"
}
                >
                  <td className="px-4 py-3 font-bold">
  {index === 0
    ? "🥇"
    : index === 1
    ? "🥈"
    : index === 2
    ? "🥉"
    : index + 1 + "º"}
</td>

                  <td className="px-4 py-3 font-medium">
                    <div>{team.id}</div>

                    <div className="text-xs font-normal text-slate-500">
                      {team.players}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {team.games}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold">
                    {team.wins}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {team.losses}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {team.pointsFor}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {team.pointsAgainst}
                  </td>

                  <td className="px-4 py-3 text-center font-bold">
                    {team.balance > 0
                      ? "+" + team.balance
                      : team.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t bg-slate-50 px-5 py-3 text-xs text-slate-500">
          As quatro primeiras duplas estão destacadas como
          classificadas.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Sorteio das duplas
        </h1>

        <p className="mt-2 text-slate-600">
          Cada dupla será formada por um jogador da Lista
          1 e um jogador da Lista 2.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
          {message}
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Lista 1
            </h2>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
              {playerPool1.length} jogadores
            </span>
          </div>

          <div className="space-y-2">
            {playerPool1.map((player, index) => (
              <div
                key={player}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {index + 1}
                </span>

                <span className="font-medium">
                  {player}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Lista 2
            </h2>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
              {playerPool2.length} jogadores
            </span>
          </div>

          <div className="space-y-2">
            {playerPool2.map((player, index) => (
              <div
                key={player}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {index + 1}
                </span>

                <span className="font-medium">
                  {player}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerateTeams}
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
          >
            🎲 Gerar duplas
          </button>

          <button
            type="button"
            onClick={handleConfirmTeams}
            disabled={teams.length === 0}
            className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✅ Confirmar duplas
          </button>

          <button
            type="button"
            onClick={handleDrawGroups}
            disabled={!confirmed}
            className="rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            🏅 Sortear grupos
          </button>

          <button
            type="button"
            onClick={handleGenerateMatches}
            disabled={
              groups.A.length !== 5 ||
              groups.B.length !== 5
            }
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            🎯 Gerar jogos
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-700 hover:bg-red-50"
          >
            ↻ Reiniciar
          </button>
        </div>
      </section>

      {teams.length > 0 && (
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">
                Duplas sorteadas
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Você pode alterar qualquer jogador antes
                de confirmar as duplas.
              </p>
            </div>

            <span
              className={
                confirmed
                  ? "rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800"
                  : "rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800"
              }
            >
              {confirmed
                ? "Duplas confirmadas"
                : "Aguardando confirmação"}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className="rounded-2xl border bg-slate-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold">
                    Dupla {index + 1}
                  </h3>

                  <span className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-500">
                    {team.id}
                  </span>
                </div>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Jogador da Lista 1
                  </span>

                  <input
                    type="text"
                    value={team.player1}
                    onChange={(event) =>
                      handleChangePlayer(
                        team.id,
                        "player1",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </label>

                <label className="mt-3 block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Jogador da Lista 2
                  </span>

                  <input
                    type="text"
                    value={team.player2}
                    onChange={(event) =>
                      handleChangePlayer(
                        team.id,
                        "player2",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
      )}

      {(groups.A.length > 0 ||
        groups.B.length > 0) && (
        <section className="grid gap-5 lg:grid-cols-2">
          {["A", "B"].map((groupName) => (
            <div
              key={groupName}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Grupo {groupName}
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
                  {groups[groupName].length} duplas
                </span>
              </div>

              <div className="space-y-3">
                {groups[groupName].map((team) => (
                  <div
                    key={team.id}
                    className="rounded-xl border bg-slate-50 p-4"
                  >
                    <div className="font-bold">
                      {team.id}
                    </div>

                    <div className="mt-1 text-sm text-slate-700">
                      {team.player1} / {team.player2}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {(matches.A.length > 0 ||
        matches.B.length > 0) && (
        <section className="grid gap-5 lg:grid-cols-2">
          {["A", "B"].map((groupName) => (
            <div
              key={groupName}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Jogos do Grupo {groupName}
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
                  {matches[groupName].length} jogos
                </span>
              </div>

              <div className="space-y-4">
                {matches[groupName].map((match) => (
                  <div
                    key={match.id}
             className={
  match.finished
    ? "rounded-xl border border-emerald-200 bg-emerald-50 p-4"
    : matches[groupName]
        .filter((m) => !m.finished)[0]?.id === match.id
    ? "rounded-xl border border-amber-300 bg-amber-50 p-4"
    : "rounded-xl border bg-slate-50 p-4"
}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500">
                        Jogo {match.order}
                      </span>

                      <span
                        className={
                          match.finished
                            ? "rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800"
                            : "rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-500"
                        }
                      >
                        {match.finished
                          ? "Finalizado"
                          : match.id}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                      <div className="text-center">
                        <div className="mb-2 min-h-10 text-sm font-semibold">
                          {getTeamLabel(
                            groupName,
                            match.home
                          )}
                        </div>

                       <select
  value={match.scoreHome}
  onChange={(event) =>
    handleScoreChange(
      groupName,
      match.id,
      "scoreHome",
      event.target.value
    )
  }
  className="mx-auto block w-24 rounded-xl border bg-white px-3 py-2 text-center text-xl font-bold"
>
  <option value="">-</option>

  {groupPointOptions.map((points) => (
    <option key={points} value={points}>
      {points}
    </option>
  ))}
</select>
                      </div>

                      <div className="flex items-center justify-center font-bold text-slate-400">
                        X
                      </div>

                      <div className="text-center">
                        <div className="mb-2 min-h-10 text-sm font-semibold">
                          {getTeamLabel(
                            groupName,
                            match.away
                          )}
                        </div>

                     <select
  value={match.scoreAway}
  onChange={(event) =>
    handleScoreChange(
      groupName,
      match.id,
      "scoreAway",
      event.target.value
    )
  }
  className="mx-auto block w-24 rounded-xl border bg-white px-3 py-2 text-center text-xl font-bold"
>
  <option value="">-</option>

  {groupPointOptions.map((points) => (
    <option key={points} value={points}>
      {points}
    </option>
  ))}
</select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleFinishMatch(
                          groupName,
                          match
                        )
                      }
                      className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700"
                    >
                      {match.finished
                        ? "Atualizar resultado"
                        : "Finalizar jogo"}
                    </button>

                    {match.finished && (
                      <div className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-center text-sm font-semibold text-emerald-900">
                        Vencedor:{" "}
                        {getWinnerLabel(
                          groupName,
                          match.winner
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

    {(rankingA.length > 0 || rankingB.length > 0) && (
 <section className="grid gap-5 lg:grid-cols-2">
  <RankingTable
    groupName="A"
    ranking={rankingA}
  />

  <RankingTable
    groupName="B"
    ranking={rankingB}
  />
</section>
)}
{quarterFinals.length > 0 && (
  <KnockoutMatch
    title="Quartas de Final"
    matches={quarterFinals}
    pointOptions={groupPointOptions}
    onScoreChange={(id, field, value) => {
      setQuarterFinals((current) =>
        current.map((match) =>
          match.id === id
            ? { ...match, [field]: value }
            : match
        )
      );
    }}
  onFinishMatch={(match) => {
  try {
    const updatedQuarterFinals = finishMatch(
      quarterFinals,
      match.id,
      match.scoreHome,
      match.scoreAway,
      settings.quarterPoints
    );

    setQuarterFinals(updatedQuarterFinals);
    const generatedSemifinals =
  generateSemifinalsFromQuarterFinals(
    updatedQuarterFinals
  );

if (generatedSemifinals.length === 2) {
  setSemifinals(generatedSemifinals);

  setMessage(
    "Quartas encerradas. Semifinais geradas."
  );
} else {
  setMessage(
    "Resultado das quartas salvo."
  );
}

    setMessage(
      "Resultado das quartas salvo."
    );
  } catch (error) {
    setMessage(error.message);
  }
}}
  />
)}
{semifinals.length > 0 && (
  <KnockoutMatch
    title="Semifinais"
    matches={semifinals}
    pointOptions={semiPointOptions}
    onScoreChange={(id, field, value) => {
      setSemifinals((current) =>
        current.map((match) =>
          match.id === id
            ? {
                ...match,
                [field]: value,
                finished: false,
              }
            : match
        )
      );

      setFinalMatch([]);
    }}
    onFinishMatch={(match) => {
      try {
        const updatedSemifinals = finishMatch(
          semifinals,
          match.id,
          match.scoreHome,
          match.scoreAway,
          settings.semiPoints
        );

        setSemifinals(updatedSemifinals);

        const generatedFinal = generateFinal(
          updatedSemifinals
        );

        if (generatedFinal.length === 1) {
          setFinalMatch(generatedFinal);

          setMessage(
            "Semifinais encerradas. Final gerada."
          );
        } else {
          setMessage(
            "Resultado da semifinal salvo."
          );
        }
      } catch (error) {
        setMessage(error.message);
      }
    }}
  />
)}
{finalMatch.length > 0 && (
  <KnockoutMatch
    title="Final"
    matches={finalMatch}
    pointOptions={finalPointOptions}
    onScoreChange={(id, field, value) => {
      setFinalMatch((current) =>
        current.map((match) =>
          match.id === id
            ? {
                ...match,
                [field]: value,
                finished: false,
              }
            : match
        )
      );

      setChampion(null);
    }}
    onFinishMatch={(match) => {
      try {
        const updatedFinal = finishMatch(
          finalMatch,
          match.id,
          match.scoreHome,
          match.scoreAway,
          settings.finalPoints
        );

        setFinalMatch(updatedFinal);

        const winner =
          Number(match.scoreHome) >
          Number(match.scoreAway)
            ? match.home
            : match.away;

        setChampion(winner);
        setMessage("Final encerrada. Campeão definido.");
      } catch (error) {
        setMessage(error.message);
      }
    }}
  />
)}
{(quarterFinals.length > 0 ||
  semifinals.length > 0 ||
  finalMatch.length > 0) && (
  <Bracket
    quarterFinals={quarterFinals}
    semifinals={semifinals}
    finalMatch={finalMatch}
  />
)}
<ChampionCard champion={champion} />
{finalMatch.length > 0 && (
  <PodiumCard
    finalMatch={finalMatch}
    semifinals={semifinals}
  />
)}
  </div>
);
}