import { useEffect, useState } from "react";

import { calculateRanking } from "../utils/ranking";
import { loadTournament } from "../utils/storage";

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
    tournament?.matches?.A?.filter(
      (match) => !match.finished
    ) || [];

  const pendingMatchesB =
    tournament?.matches?.B?.filter(
      (match) => !match.finished
    ) || [];

  /*
   * O primeiro jogo pendente é considerado o que está em quadra.
   * A TV mostra o segundo pendente, que é quem joga depois.
   * Se houver somente um pendente, ele será mostrado.
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
      allGroupTeams.find(
        (team) => team.id === teamId
      ) || null
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

  const quarterFinals =
    tournament?.quarterFinals || [];

  const semifinals =
    tournament?.semifinals || [];

  const finalMatch =
    tournament?.finalMatch || [];

  let currentPhase = "groups";

  if (tournament?.champion) {
    currentPhase = "champion";
  } else if (finalMatch.length > 0) {
    currentPhase = "final";
  } else if (semifinals.length > 0) {
    currentPhase = "semifinals";
  } else if (quarterFinals.length > 0) {
    currentPhase = "quarterFinals";
  }

  const phaseTitle = {
    groups: "Fase de Grupos",
    quarterFinals: "Quartas de Final",
    semifinals: "Semifinais",
    final: "Final",
    champion: "Campeões",
  }[currentPhase];

  const isGroupStage =
    currentPhase === "groups";

  const isQuarterFinals =
    currentPhase === "quarterFinals";

  const isSemifinals =
    currentPhase === "semifinals";

  const isFinal =
    currentPhase === "final";

  const isChampion =
    currentPhase === "champion";

  function renderKnockoutMatch(match) {
    if (!match) {
      return null;
    }

    const homeWon =
      match.finished &&
      Number(match.scoreHome) >
        Number(match.scoreAway);

    const awayWon =
      match.finished &&
      Number(match.scoreAway) >
        Number(match.scoreHome);

    return (
      <div
        key={match.id}
        className={
          match.finished
            ? "rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-xl"
            : "rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
        }
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="text-lg font-black text-emerald-400">
            {match.id}
          </span>

          <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
            {match.finished
              ? "Finalizado"
              : "Próximo jogo"}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-center">
          <div>
            <p
              className={
                homeWon
                  ? "text-2xl font-black text-emerald-400"
                  : "text-2xl font-black"
              }
            >
              {match.home}
            </p>

            {match.finished && (
              <p className="mt-3 text-4xl font-black">
                {match.scoreHome}
              </p>
            )}
          </div>

          <div className="text-3xl font-black text-slate-500">
            X
          </div>

          <div>
            <p
              className={
                awayWon
                  ? "text-2xl font-black text-emerald-400"
                  : "text-2xl font-black"
              }
            >
              {match.away}
            </p>

            {match.finished && (
              <p className="mt-3 text-4xl font-black">
                {match.scoreAway}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Torneio ao vivo
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Torneio de Pádel
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
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h2 className="text-2xl font-black">
                  Classificação — Grupo A
                </h2>

                <div className="mb-2 mt-5 grid grid-cols-[60px_1fr_100px] px-4 text-xs font-bold uppercase text-slate-400">
                  <span>Pos.</span>
                  <span>Dupla</span>
                  <span className="text-right">
                    V | SG
                  </span>
                </div>

                <div className="space-y-3">
                  {rankingA.map(
                    (item, index) => (
                      <div
                        key={item.id}
                        className={`grid grid-cols-[60px_1fr_100px] items-center rounded-2xl border px-4 py-3 ${
                          index < 4
                            ? "border-emerald-500/30 bg-slate-800"
                            : "border-red-500/30 bg-slate-800"
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
                          {formatBalance(
                            item.balance
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <h2 className="text-2xl font-black">
                  Classificação — Grupo B
                </h2>

                <div className="mb-2 mt-5 grid grid-cols-[60px_1fr_100px] px-4 text-xs font-bold uppercase text-slate-400">
                  <span>Pos.</span>
                  <span>Dupla</span>
                  <span className="text-right">
                    V | SG
                  </span>
                </div>

                <div className="space-y-3">
                  {rankingB.map(
                    (item, index) => (
                      <div
                        key={item.id}
                        className={`grid grid-cols-[60px_1fr_100px] items-center rounded-2xl border px-4 py-3 ${
                          index < 4
                            ? "border-emerald-500/30 bg-slate-800"
                            : "border-red-500/30 bg-slate-800"
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
                          {formatBalance(
                            item.balance
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {isQuarterFinals && (
          <section className="grid gap-6 lg:grid-cols-2">
            {quarterFinals.map(
              renderKnockoutMatch
            )}
          </section>
        )}

        {isSemifinals && (
          <section className="grid gap-6 lg:grid-cols-2">
            {semifinals.map(
              renderKnockoutMatch
            )}
          </section>
        )}

        {isFinal && (
          <section className="mx-auto max-w-4xl">
            {finalMatch.map(
              renderKnockoutMatch
            )}
          </section>
        )}

        {isChampion && (
          <section className="rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-300 via-yellow-100 to-white p-10 text-center text-slate-950 shadow-2xl">
            <div className="text-8xl">
              🏆
            </div>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.35em] text-amber-700">
              Campeões do torneio
            </p>

            <h2 className="mt-5 text-5xl font-black">
              {tournament.champion}
            </h2>

            <div className="mt-8 text-5xl">
              🥇 🎉
            </div>
          </section>
        )}
      </div>
    </div>
  );
}