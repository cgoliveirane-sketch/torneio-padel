import { useState, useEffect } from "react";

import {
  playerPool1 as defaultPlayerPool1,
  playerPool2 as defaultPlayerPool2,
} from "../data/players";
import KnockoutStage from "../components/KnockoutStage";
import {
  generateQuarterFinals,
  generateSemifinals,
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
  const [playerPool1, setPlayerPool1] = useState(
    defaultPlayerPool1
  );

  const [playerPool2, setPlayerPool2] = useState(
    defaultPlayerPool2
  );

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
  const [thirdPlaceMatch, setThirdPlaceMatch] = useState([]);
  const [champion, setChampion] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [storageLoaded, setStorageLoaded] = useState(false);
useEffect(() => {
  let isMounted = true;

  async function loadSavedTournament() {
    try {
      const saved = await loadTournament();

      if (!isMounted) {
        return;
      }

      if (saved) {
        setPlayerPool1(
  saved.playerPool1?.length
    ? saved.playerPool1
    : defaultPlayerPool1
);

setPlayerPool2(
  saved.playerPool2?.length
    ? saved.playerPool2
    : defaultPlayerPool2
);
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

        setQuarterFinals(
          saved.quarterFinals || []
        );

        setSemifinals(
          saved.semifinals || []
        );

        setFinalMatch(
          saved.finalMatch || []
        );

        setThirdPlaceMatch(
          saved.thirdPlaceMatch || []
        );

        setChampion(saved.champion || null);
        setConfirmed(saved.confirmed || false);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar o torneio:",
        error
      );

      if (isMounted) {
        setMessage(
          "Não foi possível carregar os dados do torneio."
        );
      }
    } finally {
      if (isMounted) {
        setStorageLoaded(true);
      }
    }
  }

  loadSavedTournament();

  return () => {
    isMounted = false;
  };
}, []);
useEffect(() => {
  if (!storageLoaded) {
    return;
  }

  const timeoutId = window.setTimeout(
    async () => {
      try {
        await saveTournament({
          playerPool1,
          playerPool2,
          teams,
          groups,
          matches,
          quarterFinals,
          semifinals,
          finalMatch,
          thirdPlaceMatch,
          champion,
          confirmed,
        });
      } catch (error) {
        console.error(
          "Erro ao sincronizar o torneio:",
          error
        );

        setMessage(
          "Os dados foram salvos localmente, mas houve erro na sincronização online."
        );
      }
    },
    500
  );

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [
  storageLoaded,
  playerPool1,
  playerPool2,
  teams,
  groups,
  matches,
  quarterFinals,
  semifinals,
  finalMatch,
  thirdPlaceMatch,
  champion,
  confirmed,
]);
function updatePlayer(
  poolNumber,
  playerIndex,
  newName
) {
  const updatePool = poolNumber === 1
    ? setPlayerPool1
    : setPlayerPool2;

  updatePool((currentPool) =>
    currentPool.map((player, index) =>
      index === playerIndex
        ? newName
        : player
    )
  );
}

function addPlayer(poolNumber) {
  const updatePool = poolNumber === 1
    ? setPlayerPool1
    : setPlayerPool2;

  updatePool((currentPool) => [
    ...currentPool,
    "",
  ]);
}

function removePlayer(
  poolNumber,
  playerIndex
) {
  const updatePool = poolNumber === 1
    ? setPlayerPool1
    : setPlayerPool2;

  updatePool((currentPool) =>
    currentPool.filter(
      (_, index) => index !== playerIndex
    )
  );
}
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
  const currentTournamentStage = champion
  ? "finished"
  : quarterFinals.length > 0 ||
    semifinals.length > 0 ||
    finalMatch.length > 0
  ? "knockout"
  : matches.A.length > 0 ||
    matches.B.length > 0
  ? "groupMatches"
  : groups.A.length > 0 ||
    groups.B.length > 0
  ? "groups"
  : confirmed
  ? "confirmed"
  : teams.length > 0
  ? "teams"
  : "start";
const showSetupDetails =
  currentTournamentStage === "start" ||
  currentTournamentStage === "teams" ||
  currentTournamentStage === "confirmed";

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
    const cleanPlayerPool1 = playerPool1
      .map((player) => player.trim())
      .filter(Boolean);

    const cleanPlayerPool2 = playerPool2
      .map((player) => player.trim())
      .filter(Boolean);

    if (
      cleanPlayerPool1.length !==
      cleanPlayerPool2.length
    ) {
      setMessage(
        "As duas listas precisam ter a mesma quantidade de jogadores."
      );

      return;
    }

    if (
  cleanPlayerPool1.length !== 10 ||
  cleanPlayerPool2.length !== 10
) {
  setMessage(
    "O torneio precisa ter exatamente 10 jogadores em cada lista."
  );

  return;
}

    const generatedTeams = createBalancedTeams(
      cleanPlayerPool1,
      cleanPlayerPool2
    );

    setTeams(generatedTeams);

    setGroups({
      A: [],
      B: [],
    });

    clearMatches();
    setConfirmed(false);
    setMessage(
      `${generatedTeams.length} duplas foram sorteadas.`
    );
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
      setMessage("Primeiro gere as duplas.");
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

  async function handleReset() {
  const confirmedReset = window.confirm(
    "Deseja iniciar um novo torneio? Todas as duplas, grupos, partidas, resultados e o campeão serão apagados."
  );

  if (!confirmedReset) {
    return;
  }

  try {
  await clearTournament();
} catch (error) {
  console.error(
    "Erro ao limpar o torneio online:",
    error
  );

  setMessage(
    "O torneio foi limpo neste aparelho, mas houve erro ao limpar os dados online."
  );
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

  setQuarterFinals([]);
  setSemifinals([]);
  setFinalMatch([]);
  setThirdPlaceMatch([]);
  setChampion(null);

  setConfirmed(false);

  setMessage(
    "Novo torneio iniciado. Gere novamente as duplas."
  );
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
  function updateSemifinalsFromQuarterFinals(
  updatedQuarterFinals,
  currentSemifinals
  
) {
  const qf1Winner = updatedQuarterFinals[0]?.finished
    ? updatedQuarterFinals[0]?.winner
    : null;

  const qf2Winner = updatedQuarterFinals[1]?.finished
    ? updatedQuarterFinals[1]?.winner
    : null;

  const qf3Winner = updatedQuarterFinals[2]?.finished
    ? updatedQuarterFinals[2]?.winner
    : null;

  const qf4Winner = updatedQuarterFinals[3]?.finished
    ? updatedQuarterFinals[3]?.winner
    : null;

  const existingSf1 = currentSemifinals[0] || {};
  const existingSf2 = currentSemifinals[1] || {};

  const sf1ParticipantsChanged =
    existingSf1.home !== qf1Winner ||
    existingSf1.away !== qf2Winner;

  const sf2ParticipantsChanged =
    existingSf2.home !== qf3Winner ||
    existingSf2.away !== qf4Winner;

  return [
    {
      ...existingSf1,
      id: existingSf1.id || "SF1",
      home: qf1Winner,
      away: qf2Winner,

      ...(sf1ParticipantsChanged
        ? {
            scoreHome: "",
            scoreAway: "",
            finished: false,
            winner: null,
          }
        : {}),
    },
    {
      ...existingSf2,
      id: existingSf2.id || "SF2",
      home: qf3Winner,
      away: qf4Winner,

      ...(sf2ParticipantsChanged
        ? {
            scoreHome: "",
            scoreAway: "",
            finished: false,
            winner: null,
          }
        : {}),
    },
  ];
}
function updateFinalFromSemifinals(
  updatedSemifinals,
  currentFinal
) {
  const sf1Winner = updatedSemifinals[0]?.finished
    ? updatedSemifinals[0]?.winner
    : null;

  const sf2Winner = updatedSemifinals[1]?.finished
    ? updatedSemifinals[1]?.winner
    : null;

  const existingFinal = currentFinal[0] || {};

  const participantsChanged =
    existingFinal.home !== sf1Winner ||
    existingFinal.away !== sf2Winner;

  return [
    {
      ...existingFinal,
      id: existingFinal.id || "FINAL",
      home: sf1Winner,
      away: sf2Winner,

      ...(participantsChanged
        ? {
            scoreHome: "",
            scoreAway: "",
            finished: false,
            winner: null,
          }
        : {}),
    },
  ];
}

function updateThirdPlaceFromSemifinals(
  updatedSemifinals,
  currentThirdPlace
) {
  const sf1Loser = updatedSemifinals[0]?.finished
    ? updatedSemifinals[0]?.winner ===
      updatedSemifinals[0]?.home
      ? updatedSemifinals[0]?.away
      : updatedSemifinals[0]?.home
    : null;

  const sf2Loser = updatedSemifinals[1]?.finished
    ? updatedSemifinals[1]?.winner ===
      updatedSemifinals[1]?.home
      ? updatedSemifinals[1]?.away
      : updatedSemifinals[1]?.home
    : null;

  const existingThirdPlace =
    currentThirdPlace[0] || {};

  const participantsChanged =
    existingThirdPlace.home !== sf1Loser ||
    existingThirdPlace.away !== sf2Loser;

  return [
    {
      ...existingThirdPlace,
      id: existingThirdPlace.id || "TERCEIRO LUGAR",
      home: sf1Loser,
      away: sf2Loser,

      ...(participantsChanged
        ? {
            scoreHome: "",
            scoreAway: "",
            finished: false,
            winner: null,
          }
        : {}),
    },
  ];
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
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
  <div className="mb-4 flex items-center justify-between gap-3">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
        Andamento do torneio
      </p>

      <h2 className="mt-1 text-lg font-black text-slate-900">
        {currentTournamentStage === "start" &&
          "Aguardando geração das duplas"}

        {currentTournamentStage === "teams" &&
          "Duplas geradas — aguardando confirmação"}

        {currentTournamentStage === "confirmed" &&
          "Duplas confirmadas — aguardando sorteio dos grupos"}

        {currentTournamentStage === "groups" &&
          "Grupos definidos — aguardando geração dos jogos"}

        {currentTournamentStage === "groupMatches" &&
          `Fase de grupos — ${
            finishedMatchesA + finishedMatchesB
          } de 20 jogos finalizados`}

        {currentTournamentStage === "knockout" &&
          "Fase eliminatória em andamento"}

        {currentTournamentStage === "finished" &&
          "Torneio encerrado"}
      </h2>
    </div>

    <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-black text-white">
      {currentTournamentStage === "start" && "Etapa 1"}
      {currentTournamentStage === "teams" && "Etapa 2"}
      {currentTournamentStage === "confirmed" && "Etapa 3"}
      {currentTournamentStage === "groups" && "Etapa 4"}
      {currentTournamentStage === "groupMatches" && "Etapa 5"}
      {currentTournamentStage === "knockout" && "Etapa 6"}
      {currentTournamentStage === "finished" && "Concluído"}
    </span>
  </div>

  <div className="grid grid-cols-6 gap-2">
    {[
      "start",
      "teams",
      "confirmed",
      "groups",
      "groupMatches",
      "knockout",
    ].map((stage, index, stages) => {
      const currentIndex = stages.indexOf(
        currentTournamentStage
      );

      const finished =
        currentTournamentStage === "finished" ||
        index < currentIndex;

      const active =
        stage === currentTournamentStage;

      return (
        <div
          key={stage}
          className={`h-2 rounded-full ${
            finished || active
              ? "bg-emerald-500"
              : "bg-slate-200"
          }`}
        />
      );
    })}
  </div>
</section>

      {message && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
          {message}
        </div>
      )}

      {showSetupDetails && (
  <section className="grid gap-5 lg:grid-cols-2">
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Lista 1
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jogadores do primeiro grupo do sorteio
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
          {playerPool1.length} jogadores
        </span>
      </div>

      <div className="space-y-2">
        {playerPool1.map((player, index) => (
          <div
            key={`pool-1-${index}`}
            className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {index + 1}
            </span>

            <input
              type="text"
              value={player}
              onChange={(event) =>
                updatePlayer(
                  1,
                  index,
                  event.target.value
                )
              }
              placeholder={`Jogador ${index + 1}`}
              className="min-w-0 flex-1 rounded-xl border bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <button
              type="button"
              onClick={() =>
                removePlayer(1, index)
              }
              className="rounded-xl border border-red-200 bg-white px-3 py-2 font-semibold text-red-700 hover:bg-red-50"
              title="Remover jogador"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => addPlayer(1)}
        className="mt-4 w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
      >
        ＋ Adicionar jogador
      </button>
    </div>

    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Lista 2
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jogadores do segundo grupo do sorteio
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
          {playerPool2.length} jogadores
        </span>
      </div>

      <div className="space-y-2">
        {playerPool2.map((player, index) => (
          <div
            key={`pool-2-${index}`}
            className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {index + 1}
            </span>

            <input
              type="text"
              value={player}
              onChange={(event) =>
                updatePlayer(
                  2,
                  index,
                  event.target.value
                )
              }
              placeholder={`Jogador ${index + 1}`}
              className="min-w-0 flex-1 rounded-xl border bg-white px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <button
              type="button"
              onClick={() =>
                removePlayer(2, index)
              }
              className="rounded-xl border border-red-200 bg-white px-3 py-2 font-semibold text-red-700 hover:bg-red-50"
              title="Remover jogador"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => addPlayer(2)}
        className="mt-4 w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
      >
        ＋ Adicionar jogador
      </button>
    </div>
  </section>
)}

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
  <div className="flex flex-wrap gap-3">
    {currentTournamentStage === "start" && (
      <button
        type="button"
        onClick={handleGenerateTeams}
        className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
      >
        🎲 Gerar duplas
      </button>
    )}

    {currentTournamentStage === "teams" && (
      <>
        <button
          type="button"
          onClick={handleGenerateTeams}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          🎲 Sortear novamente
        </button>

        <button
          type="button"
          onClick={handleConfirmTeams}
          className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-600"
        >
          ✅ Confirmar duplas
        </button>
      </>
    )}

    {currentTournamentStage === "confirmed" && (
      <button
        type="button"
        onClick={handleDrawGroups}
        className="rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-600"
      >
        🏅 Sortear grupos
      </button>
    )}

    {currentTournamentStage === "groups" && (
      <button
        type="button"
        onClick={handleGenerateMatches}
        className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-600"
      >
        🎯 Gerar jogos
      </button>
    )}

    {(currentTournamentStage === "groupMatches" ||
      currentTournamentStage === "knockout" ||
      currentTournamentStage === "finished") && (
      <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
        Continue lançando os resultados abaixo.
      </div>
    )}

    {currentTournamentStage !== "start" && (
      <button
        type="button"
        onClick={handleReset}
        className="rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-700 hover:bg-red-50"
      >
        🏆 Novo torneio
      </button>
    )}
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
<KnockoutStage
  quarterFinals={quarterFinals}
  semifinals={semifinals}
  finalMatch={finalMatch}
  thirdPlaceMatch={thirdPlaceMatch}
  settings={settings}
  quarterPointOptions={quarterPointOptions}
  semiPointOptions={semiPointOptions}
  finalPointOptions={finalPointOptions}
  setQuarterFinals={setQuarterFinals}
  setSemifinals={setSemifinals}
  setFinalMatch={setFinalMatch}
  setThirdPlaceMatch={setThirdPlaceMatch}
  setChampion={setChampion}
  setMessage={setMessage}
  finishMatch={finishMatch}
  updateSemifinalsFromQuarterFinals={updateSemifinalsFromQuarterFinals}
  updateFinalFromSemifinals={updateFinalFromSemifinals}
  updateThirdPlaceFromSemifinals={updateThirdPlaceFromSemifinals}
/>
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
    thirdPlaceMatch={thirdPlaceMatch}
  />
)}
  </div>
);
}