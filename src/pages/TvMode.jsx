import { useEffect, useState } from "react";

import TournamentStage from "../components/TournamentStage";
import { calculateRanking } from "../utils/ranking";
import { loadTournament } from "../utils/storage";

const DEMO_MODE = false;

// Opções:
// "groups"
// "quarterFinals"
// "semifinals"
// "final"
// "champion"
const DEMO_PHASE = "quarterFinals";

export default function TvMode() {
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    function loadData() {
      setTournament(loadTournament());
    }

    loadData();

    const interval = setInterval(loadData, 1000);

    return () => clearInterval(interval);
  }, []);

  const pendingMatchesA =
    tournament?.matches?.A?.filter((match) => !match.finished) || [];

  const pendingMatchesB =
    tournament?.matches?.B?.filter((match) => !match.finished) || [];

  /*
   * O primeiro jogo pendente é considerado o jogo atual.
   * A TV mostra o segundo pendente como próximo jogo.
   * Caso exista somente um pendente, ele será mostrado.
   */
  const nextMatchA =
    pendingMatchesA[1] ||
    pendingMatchesA[0] ||
    null;

  const nextMatchB =
    pendingMatchesB[1] ||
    pendingMatchesB[0] ||
    null;

  function getTeam(teamId) {
    if (!teamId) {
      return null;
    }

    const allGroupTeams = [
      ...(tournament?.groups?.A || []),
      ...(tournament?.groups?.B || []),
    ];

    return (
      allGroupTeams.find((team) => team.id === teamId) ||
      null
    );
  }

  function formatTeam(team) {
    if (!team) {
      return "Aguardando";
    }

    return `${team.player1} / ${team.player2}`;
  }

  function formatBalance(balance) {
    if (balance > 0) {
      return `+${balance}`;
    }

    return balance;
  }

  const homeTeamA = getTeam(nextMatchA?.home);
  const awayTeamA = getTeam(nextMatchA?.away);

  const homeTeamB = getTeam(nextMatchB?.home);
  const awayTeamB = getTeam(nextMatchB?.away);

  const rankingA = calculateRanking(
    tournament?.groups?.A || [],
    tournament?.matches?.A || []
  );

  const rankingB = calculateRanking(
    tournament?.groups?.B || [],
    tournament?.matches?.B || []
  );

  const quarterFinals = tournament?.quarterFinals || [];
  const semifinals = tournament?.semifinals || [];
  const finalMatch = tournament?.finalMatch || [];
  const thirdPlaceMatch = tournament?.thirdPlaceMatch || [];
  const quarterFinalsFinished =
  quarterFinals.length === 4 &&
  quarterFinals.every((match) => match.finished);

const semifinalsFinished =
  semifinals.length === 2 &&
  semifinals.every((match) => match.finished);

let currentPhase = "groups";

if (DEMO_MODE) {
  currentPhase = DEMO_PHASE;
} else if (tournament?.champion) {
  currentPhase = "champion";
} else if (
  semifinalsFinished &&
  (finalMatch.length > 0 ||
    thirdPlaceMatch.length > 0)
) {
  currentPhase = "final";
} else if (quarterFinalsFinished) {
  currentPhase = "semifinals";
} else if (
  quarterFinals.some(
    (match) =>
      match?.home ||
      match?.away ||
      match?.team1 ||
      match?.team2
  )
) {
  currentPhase = "quarterFinals";
}
  const phaseTitle = {
    groups: "Fase de Grupos",
    quarterFinals: "Quartas de Final",
    semifinals: "Semifinais",
    final: "Final e Disputa de 3º Lugar",
    champion: "Campeões",
  }[currentPhase];

  const isGroupStage = currentPhase === "groups";
  const isChampion = currentPhase === "champion";

  if (!tournament) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />

          <p className="mt-5 text-lg font-bold text-slate-300">
            Carregando torneio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Torneio ao vivo
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Torneio de Padel
            </h1>
          </div>

          <div className="text-center">
            <div className="rounded-2xl bg-emerald-500 px-5 py-2 text-lg font-black text-slate-950">
              {phaseTitle}
            </div>

            <div className="mt-2 text-sm uppercase tracking-widest text-emerald-300">
              Ao vivo
            </div>
          </div>
        </header>

        {isGroupStage && (
          <>
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-slate-900 p-6 shadow-xl">
                <p className="text-sm font-bold uppercase tracking-widest text-amber-300">
                  Próximo jogo — Grupo A
                </p>

                <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-center">
                  <p className="text-2xl font-black">
                    {formatTeam(homeTeamA)}
                  </p>

                  <div className="text-3xl font-black text-slate-500">
                    X
                  </div>

                  <p className="text-2xl font-black">
                    {formatTeam(awayTeamA)}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-400/30 bg-gradient-to-br from-blue-400/20 to-slate-900 p-6 shadow-xl">
                <p className="text-sm font-bold uppercase tracking-widest text-blue-300">
                  Próximo jogo — Grupo B
                </p>

                <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-center">
                  <p className="text-2xl font-black">
                    {formatTeam(homeTeamB)}
                  </p>

                  <div className="text-3xl font-black text-slate-500">
                    X
                  </div>

                  <p className="text-2xl font-black">
                    {formatTeam(awayTeamB)}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <RankingGroup
                title="Classificação — Grupo A"
                ranking={rankingA}
                formatBalance={formatBalance}
              />

              <RankingGroup
                title="Classificação — Grupo B"
                ranking={rankingB}
                formatBalance={formatBalance}
              />
            </section>
          </>
        )}

        {!isGroupStage && !isChampion && (
          <TournamentStage
            currentPhase={currentPhase}
            quarterFinals={quarterFinals}
            semifinals={semifinals}
            finalMatch={finalMatch}
            thirdPlaceMatch={thirdPlaceMatch}
          />
        )}

        {isChampion && (
          <section className="rounded-3xl border border-emerald-500/40 bg-slate-900 p-10 text-center shadow-2xl">
            <div className="text-8xl">🏆</div>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.35em] text-emerald-400">
              Campeões do torneio
            </p>

            <h2 className="mt-5 text-5xl font-black text-white">
              {tournament.champion}
            </h2>
          </section>
        )}
      </div>
    </div>
  );
}

function RankingGroup({
  title,
  ranking,
  formatBalance,
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="text-2xl font-black">
        {title}
      </h2>

      <div className="mb-2 mt-5 grid grid-cols-[60px_1fr_100px] px-4 text-xs font-bold uppercase text-slate-400">
        <span>Pos.</span>
        <span>Dupla</span>

        <span className="text-right">
          V | SG
        </span>
      </div>

      <div className="space-y-3">
        {ranking.map((item, index) => (
          <div
            key={item.id}
            className={`grid grid-cols-[60px_1fr_100px] items-center rounded-2xl border bg-slate-800 px-4 py-3 ${
              index < 4
                ? "border-emerald-500/30"
                : "border-red-500/30"
            }`}
          >
            <span className="font-black text-emerald-400">
              {index + 1}º
            </span>

            <span className="font-semibold">
              {item.players}
            </span>

            <span className="text-right font-black">
              {item.wins}V |{" "}
              {formatBalance(item.balance)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}