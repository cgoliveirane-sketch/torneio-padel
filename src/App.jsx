import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabase";

const initialPlayers = [
  "Adriel Ribas F.",
  "Alexandro Follmer",
  "Altemar Brune",
  "Cícero de Oliveira",
  "Alexandro Barbosa",
  "Cristian Heller",
  "Eduardo Diel",
  "Edipo Correia S.",
  "Erick Fries",
  "Felipe Kaiser",
  "Fernando Simon",
  "Rafael Savadinscky",
  "Guilherme Míssio",
  "João Brum",
  "João Gatto",
  "Lucas Severo",
  "Maycon Carvalho",
  "Mateus Bartz",
  "Patrick da Silva",
  "Vitor Noro",
];

const initialTeams = [
  { id: "A1", group: "A", players: ["Alexandro Follmer", "Lucas Severo"] },
  { id: "A2", group: "A", players: ["Altemar Brune", "Alexandro Barbosa"] },
  { id: "A3", group: "A", players: ["Cristian Heller", "Erick Fries"] },
  { id: "A4", group: "A", players: ["Eduardo Diel", "João Brum"] },
  { id: "A5", group: "A", players: ["Edipo Correia S.", "Cícero de Oliveira"] },
  { id: "B1", group: "B", players: ["Rafael Savadinscky", "Felipe Kaiser"] },
  { id: "B2", group: "B", players: ["Guilherme Míssio", "Maycon Carvalho"] },
  { id: "B3", group: "B", players: ["João Gatto", "Adriel Ribas F."] },
  { id: "B4", group: "B", players: ["Mateus Bartz", "Fernando Simon"] },
  { id: "B5", group: "B", players: ["Patrick da Silva", "Vitor Noro"] },
];

const groupSchedule = [
  ["1", "2"],
  ["3", "4"],
  ["1", "5"],
  ["2", "3"],
  ["4", "5"],
  ["1", "3"],
  ["2", "4"],
  ["3", "5"],
  ["1", "4"],
  ["2", "5"],
];

function makeMatches(
  groupMaxPoints = 4,
  finalMaxPoints = 6,
  schedulePairs = groupSchedule
) {
  const matches = [];

  schedulePairs.forEach((pair, index) => {
    const round = index + 1;

    matches.push({
      id: `G-A-${round}`,
      stage: "Grupo",
      group: "A",
      round,
      court: 1,
      maxPoints: groupMaxPoints,
      team1: `A${pair[0]}`,
      team2: `A${pair[1]}`,
      score1: "",
      score2: "",
    });

    matches.push({
      id: `G-B-${round}`,
      stage: "Grupo",
      group: "B",
      round,
      court: 2,
      maxPoints: groupMaxPoints,
      team1: `B${pair[0]}`,
      team2: `B${pair[1]}`,
      score1: "",
      score2: "",
    });
  });

  matches.push(
    {
      id: "SF-1",
      stage: "Semifinal",
      group: "",
      round: 11,
      court: 1,
      maxPoints: finalMaxPoints,
      team1: "1º A",
      team2: "2º B",
      score1: "",
      score2: "",
    },
    {
      id: "SF-2",
      stage: "Semifinal",
      group: "",
      round: 11,
      court: 2,
      maxPoints: finalMaxPoints,
      team1: "1º B",
      team2: "2º A",
      score1: "",
      score2: "",
    },
    {
      id: "F-1",
      stage: "Final",
      group: "",
      round: 12,
      court: 1,
      maxPoints: finalMaxPoints,
      team1: "Vencedor SF1",
      team2: "Vencedor SF2",
      score1: "",
      score2: "",
    }
  );

  return matches;
}

function scoreIsValid(score1, score2) {
  if (score1 === "" || score2 === "") return false;
  const s1 = Number(score1);
  const s2 = Number(score2);
  return Number.isFinite(s1) && Number.isFinite(s2) && s1 !== s2;
}

function directTeamLabel(team) {
  if (!team) return "";
  return `${team.id} - ${team.players.filter(Boolean).join(" / ")}`;
}

function groupIsComplete(group, matches) {
  return matches
    .filter((match) => match.stage === "Grupo" && match.group === group)
    .every((match) => scoreIsValid(match.score1, match.score2));
}

function getHeadToHeadWinnerId(teamAId, teamBId, matches) {
  const directMatch = matches.find(
    (match) =>
      match.stage === "Grupo" &&
      ((match.team1 === teamAId && match.team2 === teamBId) ||
        (match.team1 === teamBId && match.team2 === teamAId))
  );

  if (!directMatch || !scoreIsValid(directMatch.score1, directMatch.score2))
    return null;

  return Number(directMatch.score1) > Number(directMatch.score2)
    ? directMatch.team1
    : directMatch.team2;
}

function baseGroupSorter(a, b) {
  if (b.wins !== a.wins) return b.wins - a.wins;
  if (b.balance !== a.balance) return b.balance - a.balance;
  if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
  if (a.pointsAgainst !== b.pointsAgainst)
    return a.pointsAgainst - b.pointsAgainst;
  return a.id.localeCompare(b.id);
}

function sortGroupWithTwoTeamHeadToHead(groupTeams, matches) {
  const groupedByWins = groupTeams.reduce((acc, team) => {
    acc[team.wins] = acc[team.wins] || [];
    acc[team.wins].push(team);
    return acc;
  }, {});

  return Object.keys(groupedByWins)
    .map(Number)
    .sort((a, b) => b - a)
    .flatMap((wins) => {
      const tiedTeams = groupedByWins[wins];

      if (tiedTeams.length === 2) {
        const [teamA, teamB] = tiedTeams;
        const headToHeadWinnerId = getHeadToHeadWinnerId(
          teamA.id,
          teamB.id,
          matches
        );
        if (headToHeadWinnerId === teamA.id) return [teamA, teamB];
        if (headToHeadWinnerId === teamB.id) return [teamB, teamA];
      }

      return [...tiedTeams].sort(baseGroupSorter);
    });
}

function computeRankings(teams, matches) {
  const base = Object.fromEntries(
    teams.map((team) => [
      team.id,
      {
        ...team,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        balance: 0,
      },
    ])
  );

  matches
    .filter((match) => match.stage === "Grupo")
    .forEach((match) => {
      if (!scoreIsValid(match.score1, match.score2)) return;

      const s1 = Number(match.score1);
      const s2 = Number(match.score2);
      const t1 = base[match.team1];
      const t2 = base[match.team2];
      if (!t1 || !t2) return;

      t1.pointsFor += s1;
      t1.pointsAgainst += s2;
      t2.pointsFor += s2;
      t2.pointsAgainst += s1;

      if (s1 > s2) {
        t1.wins += 1;
        t2.losses += 1;
      } else {
        t2.wins += 1;
        t1.losses += 1;
      }
    });

  Object.values(base).forEach((team) => {
    team.balance = team.pointsFor - team.pointsAgainst;
  });

  return {
    A: sortGroupWithTwoTeamHeadToHead(
      Object.values(base).filter((team) => team.group === "A"),
      matches
    ),
    B: sortGroupWithTwoTeamHeadToHead(
      Object.values(base).filter((team) => team.group === "B"),
      matches
    ),
  };
}

function shuffleArray(array) {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildRandomTeams(players) {
  const shuffled = shuffleArray(
    players.map((player) => player.trim()).filter(Boolean)
  );

  return Array.from({ length: 10 }, (_, index) => {
    const group = index < 5 ? "A" : "B";
    const position = index < 5 ? index + 1 : index - 4;

    return {
      id: `${group}${position}`,
      group,
      players: [shuffled[index * 2] || "", shuffled[index * 2 + 1] || ""],
    };
  });
}

function getTeamById(teams, id) {
  return teams.find((team) => team.id === id) || null;
}

function resolveTeamId(id, rankings, matches, groupComplete) {
  if (id === "1º A") return groupComplete.A ? rankings.A[0]?.id || id : id;
  if (id === "2º A") return groupComplete.A ? rankings.A[1]?.id || id : id;
  if (id === "1º B") return groupComplete.B ? rankings.B[0]?.id || id : id;
  if (id === "2º B") return groupComplete.B ? rankings.B[1]?.id || id : id;

  if (id === "Vencedor SF1") {
    return (
      winnerIdOf(
        matches.find((match) => match.id === "SF-1"),
        rankings,
        matches,
        groupComplete
      ) || id
    );
  }

  if (id === "Vencedor SF2") {
    return (
      winnerIdOf(
        matches.find((match) => match.id === "SF-2"),
        rankings,
        matches,
        groupComplete
      ) || id
    );
  }

  return id;
}

function teamLabel(id, teams, rankings, matches, groupComplete) {
  const resolvedId = resolveTeamId(id, rankings, matches, groupComplete);
  const direct = getTeamById(teams, resolvedId);
  return direct ? directTeamLabel(direct) : resolvedId;
}

function winnerIdOf(match, rankings, matches, groupComplete) {
  if (!match || !scoreIsValid(match.score1, match.score2)) return "";

  return Number(match.score1) > Number(match.score2)
    ? resolveTeamId(match.team1, rankings, matches, groupComplete)
    : resolveTeamId(match.team2, rankings, matches, groupComplete);
}

function winnerLabelOf(match, teams, rankings, matches, groupComplete) {
  const winnerId = winnerIdOf(match, rankings, matches, groupComplete);
  return winnerId
    ? teamLabel(winnerId, teams, rankings, matches, groupComplete)
    : "";
}

function loadFromStorage(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Mantém o app funcionando mesmo se o navegador bloquear localStorage.
  }
}

function loadMatches(groupMaxPoints, finalMaxPoints) {
  return loadFromStorage(
    "torneio-padel-matches",
    makeMatches(groupMaxPoints, finalMaxPoints)
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Icon({ children }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-base">
      {children}
    </span>
  );
}

function runSelfTests() {
  const testMatches = makeMatches(4, 6);
  console.assert(testMatches.length === 23, "Deve criar 23 jogos.");
  console.assert(
    testMatches.filter((match) => match.stage === "Grupo").length === 20,
    "Deve criar 20 jogos de grupo."
  );
  console.assert(
    testMatches.filter((match) => match.maxPoints === 6).length === 3,
    "Semifinais e final devem ir até 6 pontos."
  );

  const scoringMatches = makeMatches(4, 6);
  scoringMatches[0] = { ...scoringMatches[0], score1: "4", score2: "2" };
  const scoringRankings = computeRankings(initialTeams, scoringMatches);
  console.assert(
    scoringRankings.A.find((team) => team.id === "A1")?.wins === 1,
    "A1 deve ter 1 vitória."
  );
  console.assert(
    scoringRankings.A.find((team) => team.id === "A1")?.balance === 2,
    "Saldo do A1 deve ser 2."
  );

  const threeWayTieMatches = makeMatches(4, 6);
  threeWayTieMatches[0] = {
    ...threeWayTieMatches[0],
    score1: "4",
    score2: "0",
  };
  threeWayTieMatches[2] = {
    ...threeWayTieMatches[2],
    score1: "0",
    score2: "4",
  };
  threeWayTieMatches[8] = {
    ...threeWayTieMatches[8],
    score1: "4",
    score2: "0",
  };
  const threeWayTieRankings = computeRankings(initialTeams, threeWayTieMatches);
  console.assert(
    threeWayTieRankings.A[0].id === "A1",
    "Empate triplo deve usar saldo/pontos."
  );

  console.assert(groupSchedule.length === 10, "Deve ter 10 rodadas de grupo.");
  console.assert(
    groupSchedule.every((pair) => pair.length === 2),
    "Cada rodada deve ter exatamente 2 duplas."
  );
  console.assert(
    new Set(groupSchedule.map((pair) => pair.join("-"))).size === 10,
    "Todos os confrontos do grupo devem ser únicos."
  );
  console.assert(
    groupSchedule.every(([team1, team2]) => team1 !== team2),
    "Uma dupla não pode jogar contra ela mesma."
  );
  console.assert(
    groupSchedule.every((pair, index) => {
      if (index === 0) return true;
      return !pair.some((team) => groupSchedule[index - 1].includes(team));
    }),
    "Nenhuma dupla deve jogar duas partidas seguidas no grupo."
  );
  console.assert(
    loadFromStorage("__teste_inexistente__", "fallback") === "fallback",
    "loadFromStorage deve retornar fallback quando não houver valor salvo."
  );
}

if (typeof window !== "undefined") runSelfTests();

export default function App() {
  const [playersText, setPlayersText] = useState(() =>
    loadFromStorage("torneio-padel-players-text", initialPlayers.join("\n"))
  );
  const [teams, setTeams] = useState(() =>
    loadFromStorage("torneio-padel-teams", initialTeams)
  );
  const [groupMaxPoints, setGroupMaxPoints] = useState(() =>
    loadFromStorage("torneio-padel-group-max-points", 4)
  );
  const [finalMaxPoints, setFinalMaxPoints] = useState(() =>
    loadFromStorage("torneio-padel-final-max-points", 6)
  );
  const [matches, setMatches] = useState(() =>
    loadMatches(
      loadFromStorage("torneio-padel-group-max-points", 4),
      loadFromStorage("torneio-padel-final-max-points", 6)
    )
  );
  const [tvMode, setTvMode] = useState(
    () => new URLSearchParams(window.location.search).get("tv") === "1"
  );

  const hasLoadedRemote = useRef(false);
  const isApplyingRemote = useRef(false);
  const saveTimeout = useRef(null);

  function applyTournamentData(saved) {
    if (!saved) return;

    isApplyingRemote.current = true;

    if (saved.playersText !== undefined) setPlayersText(saved.playersText);
    if (saved.teams !== undefined) setTeams(saved.teams);
    if (saved.groupMaxPoints !== undefined) setGroupMaxPoints(saved.groupMaxPoints);
    if (saved.finalMaxPoints !== undefined) setFinalMaxPoints(saved.finalMaxPoints);
    if (saved.matches !== undefined) setMatches(saved.matches);
  }

  function getTournamentPayload() {
    return {
      playersText,
      teams,
      groupMaxPoints,
      finalMaxPoints,
      matches,
      updatedAt: new Date().toISOString(),
    };
  }

  async function loadTournamentFromSupabase() {
    try {
      const { data, error } = await supabase
        .from("tournament_state")
        .select("id, data, updated_at")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.log("Erro ao carregar Supabase:", error);
        return;
      }

      if (data?.data && Object.keys(data.data).length > 0) {
        applyTournamentData(data.data);
        console.log("Torneio carregado do Supabase.");
      } else {
        console.log("Nenhum torneio salvo no Supabase ainda.");
      }
    } catch (error) {
      console.log("Erro inesperado ao carregar Supabase:", error);
    } finally {
      hasLoadedRemote.current = true;
    }
  }

  async function saveTournamentToSupabase(payload) {
    try {
      const { error } = await supabase.from("tournament_state").insert([
        {
          data: payload,
        },
      ]);

      if (error) {
        console.log("Erro ao salvar no Supabase:", error);
        return;
      }

      console.log("Torneio salvo no Supabase.");
    } catch (error) {
      console.log("Erro inesperado ao salvar no Supabase:", error);
    }
  }

  useEffect(() => {
    loadTournamentFromSupabase();

    const channel = supabase
      .channel("tournament_state_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tournament_state",
        },
        (payload) => {
          const saved = payload.new?.data;
          if (!saved) return;

          applyTournamentData(saved);
          console.log("Torneio atualizado via Supabase realtime.");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRemote.current) return;

    if (isApplyingRemote.current) {
      isApplyingRemote.current = false;
      return;
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      saveTournamentToSupabase(getTournamentPayload());
    }, 600);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [playersText, teams, groupMaxPoints, finalMaxPoints, matches]);

  const rankings = useMemo(
    () => computeRankings(teams, matches),
    [teams, matches]
  );
  const groupComplete = useMemo(
    () => ({
      A: groupIsComplete("A", matches),
      B: groupIsComplete("B", matches),
    }),
    [matches]
  );

  const overallGroupRanking = useMemo(() => {
    return [...rankings.A, ...rankings.B].sort(
      (a, b) =>
        b.wins - a.wins ||
        b.balance - a.balance ||
        b.pointsFor - a.pointsFor ||
        a.pointsAgainst - b.pointsAgainst ||
        a.id.localeCompare(b.id)
    );
  }, [rankings]);

  const finalMatch = matches.find((match) => match.id === "F-1");
  const champion = winnerLabelOf(
    finalMatch,
    teams,
    rankings,
    matches,
    groupComplete
  );

  useEffect(() => {
    saveToStorage("torneio-padel-matches", matches);
  }, [matches]);

  useEffect(() => {
    saveToStorage("torneio-padel-teams", teams);
  }, [teams]);

  useEffect(() => {
    saveToStorage("torneio-padel-players-text", playersText);
  }, [playersText]);

  useEffect(() => {
    saveToStorage("torneio-padel-group-max-points", groupMaxPoints);
  }, [groupMaxPoints]);

  useEffect(() => {
    saveToStorage("torneio-padel-final-max-points", finalMaxPoints);
  }, [finalMaxPoints]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (tvMode) url.searchParams.set("tv", "1");
    else url.searchParams.delete("tv");
    window.history.replaceState({}, "", url.toString());
  }, [tvMode]);

  function updateScore(id, field, value) {
    setMatches((previousMatches) =>
      previousMatches.map((match) => {
        if (match.id !== id) return match;
        const cleanedValue =
          value === ""
            ? ""
            : String(Math.max(0, Math.min(match.maxPoints, Number(value))));
        return { ...match, [field]: cleanedValue };
      })
    );
  }

  function applyPointSettings(nextGroupMaxPoints, nextFinalMaxPoints) {
    const groupLimit = Number(nextGroupMaxPoints);
    const finalLimit = Number(nextFinalMaxPoints);

    setMatches((previousMatches) =>
      previousMatches.map((match) => {
        const limit = match.stage === "Grupo" ? groupLimit : finalLimit;
        return {
          ...match,
          maxPoints: limit,
          score1:
            match.score1 === ""
              ? ""
              : String(Math.min(Number(match.score1), limit)),
          score2:
            match.score2 === ""
              ? ""
              : String(Math.min(Number(match.score2), limit)),
        };
      })
    );
  }

  function updateGroupMaxPoints(value) {
    const nextValue = Number(value);
    setGroupMaxPoints(nextValue);
    applyPointSettings(nextValue, finalMaxPoints);
  }

  function updateFinalMaxPoints(value) {
    const nextValue = Number(value);
    setFinalMaxPoints(nextValue);
    applyPointSettings(groupMaxPoints, nextValue);
  }

  function randomizeTeams() {
    const players = playersText
      .split("\n")
      .map((player) => player.trim())
      .filter(Boolean);

    setTeams(buildRandomTeams(players));
    setMatches(makeMatches(groupMaxPoints, finalMaxPoints));
  }

  function randomizeGroups() {
    const hasScores = matches.some(
      (match) => match.score1 !== "" || match.score2 !== ""
    );
    if (
      hasScores &&
      !window.confirm(
        "Sortear os grupos vai zerar os placares. Deseja continuar?"
      )
    )
      return;

    const shuffledTeams = shuffleArray([...teams]);
    const reassignedTeams = shuffledTeams.map((team, index) => {
      const group = index < 5 ? "A" : "B";
      const position = index < 5 ? index + 1 : index - 4;

      return {
        ...team,
        id: `${group}${position}`,
        group,
      };
    });

    setTeams(reassignedTeams);
    setMatches(makeMatches(groupMaxPoints, finalMaxPoints));
  }

  function randomizeConfrontos() {
    const hasScores = matches.some(
      (match) => match.score1 !== "" || match.score2 !== ""
    );
    if (
      hasScores &&
      !window.confirm(
        "Sortear a sequência dos confrontos vai zerar os placares. Deseja continuar?"
      )
    )
      return;

    setMatches(makeMatches(groupMaxPoints, finalMaxPoints, groupSchedule));
  }

  function resetScores() {
    setMatches((previousMatches) =>
      previousMatches.map((match) => ({ ...match, score1: "", score2: "" }))
    );
  }

  function updateTeamPlayer(teamId, index, value) {
    setTeams((previousTeams) =>
      previousTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.map((player, playerIndex) =>
                playerIndex === index ? value : player
              ),
            }
          : team
      )
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div
        className={
          tvMode ? "mx-auto max-w-7xl space-y-8" : "mx-auto max-w-7xl space-y-6"
        }
      >
        <header
          className={
            tvMode
              ? "flex flex-col gap-6 rounded-3xl bg-slate-900 p-8 text-white shadow-lg md:flex-row md:items-center md:justify-between"
              : "flex flex-col gap-4 rounded-3xl bg-slate-900 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between"
          }
        >
          <div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-slate-300">
              <span>🏆</span> Torneio de Padel
            </div>
            <h1
              className={
                tvMode
                  ? "mt-2 text-5xl font-bold md:text-6xl"
                  : "mt-2 text-3xl font-bold md:text-4xl"
              }
            >
              Torneio Pós-Venda
            </h1>
            <p className="mt-2 text-slate-300">
              10 duplas, 2 grupos, 2 quadras.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="text-2xl font-bold">10</div>
              <div className="text-xs">Duplas</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="text-2xl font-bold">23</div>
              <div className="text-xs">Jogos</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="text-2xl font-bold">4h</div>
              <div className="text-xs">Estimadas</div>
            </div>
          </div>
        </header>

        <div className="flex justify-end">
          <button
            onClick={() => setTvMode((current) => !current)}
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white shadow"
          >
            {tvMode ? "Sair do modo TV" : "Modo TV"}
          </button>
        </div>

        {!tvMode && (
          <Card>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Icon>⚙️</Icon> Configuração de pontuação
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-sm font-semibold text-slate-700">
                  Jogos da fase de grupos
                </span>
                <select
                  value={groupMaxPoints}
                  onChange={(event) => updateGroupMaxPoints(event.target.value)}
                  className="mt-2 w-full rounded-xl border bg-white px-3 py-2 font-semibold"
                >
                  {[4, 5, 6, 7, 8, 10].map((points) => (
                    <option key={points} value={points}>
                      Até {points} pontos
                    </option>
                  ))}
                </select>
              </label>

              <label className="rounded-2xl bg-slate-50 p-4">
                <span className="block text-sm font-semibold text-slate-700">
                  Semifinais e final
                </span>
                <select
                  value={finalMaxPoints}
                  onChange={(event) => updateFinalMaxPoints(event.target.value)}
                  className="mt-2 w-full rounded-xl border bg-white px-3 py-2 font-semibold"
                >
                  {[4, 5, 6, 7, 8, 10].map((points) => (
                    <option key={points} value={points}>
                      Até {points} pontos
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Ao reduzir a pontuação máxima, placares já lançados acima do novo
              limite serão ajustados automaticamente.
            </p>
          </Card>
        )}

        <Card className={tvMode ? "p-8" : ""}>
          <h2
            className={
              tvMode
                ? "flex items-center gap-3 text-4xl font-bold"
                : "flex items-center gap-2 text-xl font-bold"
            }
          >
            <Icon>🏆</Icon> Ranking geral da fase de grupos
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Classificação geral juntando Grupo A e Grupo B, antes do mata-mata.
          </p>

          <div
            className={
              tvMode
                ? "mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
                : "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
            }
          >
            {overallGroupRanking.slice(0, 2).map((team, index) => (
              <div
                key={team.id}
                className={`rounded-2xl border text-center shadow-sm ${
                  tvMode ? "p-8" : "p-4"
                } ${
                  index === 0
                    ? "bg-yellow-100"
                    : index === 1
                    ? "bg-slate-100"
                    : "bg-orange-100"
                }`}
              >
                <div
                  className={
                    tvMode ? "text-6xl font-bold" : "text-2xl font-bold"
                  }
                >
                  {index === 0 ? "🥇" : "🥈"}
                </div>
                <div
                  className={
                    tvMode
                      ? "mt-4 text-2xl font-semibold"
                      : "mt-2 font-semibold"
                  }
                >
                  {directTeamLabel(team)}
                </div>
                <div className="text-sm text-slate-600">Grupo {team.group}</div>
                <div className="mt-1 text-xs">
                  V: {team.wins} | Saldo: {team.balance}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table
              className={
                tvMode
                  ? "w-full min-w-[760px] text-xl"
                  : "w-full min-w-[760px] text-sm"
              }
            >
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Posição</th>
                  <th>Grupo</th>
                  <th>Dupla</th>
                  <th>V</th>
                  <th>PF</th>
                  <th>PC</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {overallGroupRanking.map((team, index) => (
                  <tr
                    key={team.id}
                    className={index < 4 ? "bg-emerald-50" : ""}
                  >
                    <td className="py-2 font-bold">{index + 1}º</td>
                    <td>Grupo {team.group}</td>
                    <td>{directTeamLabel(team)}</td>
                    <td>{team.wins}</td>
                    <td>{team.pointsFor}</td>
                    <td>{team.pointsAgainst}</td>
                    <td>{team.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {!tvMode && (
          <section className="grid gap-6 lg:grid-cols-2">
            {["A", "B"].map((group) => (
              <Card key={group}>
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Icon>🥇</Icon> Classificação Grupo {group}
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2">#</th>
                        <th>Dupla</th>
                        <th>V</th>
                        <th>PF</th>
                        <th>PC</th>
                        <th>Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankings[group].map((team, index) => (
                        <tr
                          key={team.id}
                          className={index < 2 ? "bg-emerald-50" : ""}
                        >
                          <td className="py-2 font-bold">{index + 1}</td>
                          <td>{directTeamLabel(team)}</td>
                          <td>{team.wins}</td>
                          <td>{team.pointsFor}</td>
                          <td>{team.pointsAgainst}</td>
                          <td>{team.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </section>
        )}

        <Card className={tvMode ? "p-8" : ""}>
          <h2
            className={
              tvMode
                ? "flex items-center gap-3 text-4xl font-bold"
                : "flex items-center gap-2 text-xl font-bold"
            }
          >
            <Icon>🎯</Icon> Cronograma e resultados
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table
              className={
                tvMode
                  ? "w-full min-w-[900px] text-xl"
                  : "w-full min-w-[900px] text-sm"
              }
            >
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Rodada</th>
                  <th>Quadra</th>
                  <th>Fase</th>
                  <th>Dupla 1</th>
                  <th>Placar</th>
                  <th>Dupla 2</th>
                  <th>Até</th>
                  <th>Vencedor</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b last:border-0">
                    <td className="py-3 font-semibold">{match.round}</td>
                    <td>{match.court}</td>
                    <td>{match.stage}</td>
                    <td>
                      {teamLabel(
                        match.team1,
                        teams,
                        rankings,
                        matches,
                        groupComplete
                      )}
                    </td>
                    <td>
                      {tvMode ? (
                        <div className="py-2 text-3xl font-bold">
                          {match.score1 === "" || match.score2 === ""
                            ? "- x -"
                            : `${match.score1} x ${match.score2}`}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <input
                            type="number"
                            min="0"
                            max={match.maxPoints}
                            value={match.score1}
                            onChange={(event) =>
                              updateScore(
                                match.id,
                                "score1",
                                event.target.value
                              )
                            }
                            className="w-16 rounded-lg border px-2 py-1 text-center"
                          />
                          <span>x</span>
                          <input
                            type="number"
                            min="0"
                            max={match.maxPoints}
                            value={match.score2}
                            onChange={(event) =>
                              updateScore(
                                match.id,
                                "score2",
                                event.target.value
                              )
                            }
                            className="w-16 rounded-lg border px-2 py-1 text-center"
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      {teamLabel(
                        match.team2,
                        teams,
                        rankings,
                        matches,
                        groupComplete
                      )}
                    </td>
                    <td>{match.maxPoints}</td>
                    <td className="font-semibold">
                      {winnerLabelOf(
                        match,
                        teams,
                        rankings,
                        matches,
                        groupComplete
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {!tvMode && (
          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Icon>👥</Icon> Participantes
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Edite a lista e clique em sortear para montar novas duplas e
                grupos.
              </p>
              <textarea
                value={playersText}
                onChange={(event) => setPlayersText(event.target.value)}
                className="mt-4 h-72 w-full rounded-xl border p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={randomizeTeams}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white shadow"
                >
                  🔀 Sortear duplas
                </button>
                <button
                  onClick={randomizeGroups}
                  className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 font-semibold text-white shadow"
                >
                  🏅 Sortear grupos
                </button>
                <button
                  onClick={randomizeConfrontos}
                  className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white shadow"
                >
                  🎲 Sortear confrontos
                </button>
                <button
                  onClick={resetScores}
                  className="flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold"
                >
                  ↻ Zerar placares
                </button>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Icon>✏️</Icon> Duplas e grupos
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {["A", "B"].map((group) => (
                  <div key={group} className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="mb-3 text-lg font-bold">Grupo {group}</h3>
                    <div className="space-y-3">
                      {teams
                        .filter((team) => team.group === group)
                        .map((team) => (
                          <div
                            key={team.id}
                            className="rounded-xl border bg-white p-3"
                          >
                            <div className="mb-2 font-bold">{team.id}</div>
                            <input
                              className="mb-2 w-full rounded-lg border px-3 py-2 text-sm"
                              value={team.players[0]}
                              onChange={(event) =>
                                updateTeamPlayer(team.id, 0, event.target.value)
                              }
                            />
                            <input
                              className="w-full rounded-lg border px-3 py-2 text-sm"
                              value={team.players[1]}
                              onChange={(event) =>
                                updateTeamPlayer(team.id, 1, event.target.value)
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {!tvMode && (
          <Card className="bg-amber-50">
            <h2 className="text-xl font-bold">Regulamento simples</h2>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <p>
                <strong>Formato:</strong> 10 duplas divididas em 2 grupos de 5.
                Todos jogam contra todos dentro do grupo.
              </p>
              <p>
                <strong>Pontuação:</strong> fase de grupos até {groupMaxPoints}{" "}
                pontos; semifinais e final até {finalMaxPoints} pontos.
              </p>
              <p>
                <strong>Classificação:</strong> vitória vale 1 ponto. Passam os
                2 melhores de cada grupo.
              </p>
              <p>
                <strong>Desempate:</strong> vitórias; confronto direto apenas em
                empate entre 2 duplas; saldo de pontos; pontos feitos; pontos
                contra; ordem da tabela.
              </p>
              <p>
                <strong>Mata-mata:</strong> 1º A x 2º B e 1º B x 2º A.
                Vencedores fazem a final.
              </p>
              <p>
                <strong>W.O.:</strong> tolerância sugerida de 5 minutos após
                chamada da organização.
              </p>
              <p>
                <strong>Ranking geral:</strong> mostra a posição de todas as
                duplas na fase de grupos, juntando os dois grupos.
              </p>
              <p>
                <strong>Legenda:</strong> V = vitórias; PF = pontos feitos; PC =
                pontos contra; Saldo = PF menos PC.
              </p>
            </div>
            {champion && (
              <div className="mt-4 rounded-2xl bg-white p-4 text-lg font-bold shadow-sm">
                🏆 Campeão: {champion}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
