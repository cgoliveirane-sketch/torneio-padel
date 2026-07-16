import { loadTournament } from "../utils/storage";
import { calculateRanking } from "../utils/ranking";
import { useEffect, useState } from "react";
export default function TvMode() {
  const [tournament, setTournament] = useState(null);

useEffect(() => {
  const loadData = () => {
    setTournament(loadTournament());
  };

  loadData();

  const interval = setInterval(loadData, 1000);

  return () => clearInterval(interval);
}, []);
const pendingMatchesA =
  tournament?.matches?.A?.filter((match) => !match.finished) || [];

const pendingMatchesB =
  tournament?.matches?.B?.filter((match) => !match.finished) || [];

const nextMatchA =
  pendingMatchesA[1] || pendingMatchesA[0] || null;

const nextMatchB =
  pendingMatchesB[1] || pendingMatchesB[0] || null;
  function getTeam(teamId) {
  if (!teamId) {
    return null;
  }

  const allGroupTeams = [
    ...(tournament?.groups?.A || []),
    ...(tournament?.groups?.B || []),
  ];

  return allGroupTeams.find((team) => team.id === teamId);
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
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Torneio ao vivo
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Torneio de Padel
            </h1>
          </div>

          <div className="rounded-2xl bg-emerald-500 px-5 py-3 text-lg font-black text-slate-950">
            AO VIVO
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-slate-900 p-6 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-300">
              Próximo jogo — Grupo A
            </p>

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-center">
              <div>
                <p className="text-2xl font-black">
  {homeTeamA
    ? `${homeTeamA.player1} / ${homeTeamA.player2}`
    : "Aguardando"}
</p>
              </div>

              <div className="text-3xl font-black text-slate-500">
                X
              </div>

              <div>
                <p className="text-2xl font-black">
  {awayTeamA
    ? `${awayTeamA.player1} / ${awayTeamA.player2}`
    : "Aguardando"}
</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-400/30 bg-gradient-to-br from-blue-400/20 to-slate-900 p-6 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300">
              Próximo jogo — Grupo B
            </p>

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-center">
              <div>
                <p className="text-2xl font-black">
  {homeTeamB
    ? `${homeTeamB.player1} / ${homeTeamB.player2}`
    : "Aguardando"}
</p>
              </div>

              <div className="text-3xl font-black text-slate-500">
                X
              </div>

              <div>
                <p className="text-2xl font-black">
  {awayTeamB
    ? `${awayTeamB.player1} / ${awayTeamB.player2}`
    : "Aguardando"}
</p>
              </div>
            </div>
          </div>
        </section>

       <section className="grid gap-6 lg:grid-cols-2">
  {/* GRUPO A */}
  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
    <h2 className="text-2xl font-black">
      Classificação — Grupo A
    </h2>

    <div className="mt-5 space-y-3">
      <div className="grid grid-cols-[60px_1fr_80px] mb-2 px-4 text-xs font-bold uppercase text-slate-400">
  <span>Pos</span>
  <span>Dupla</span>
  <span className="text-right">V | SG</span>
</div>
      {rankingA.map((item, index) => {
        const team = getTeam(item.teamId || item.id);
        console.log("RANKING A:", rankingA);
console.log("RANKING B:", rankingB);

        return (
          <div
            key={item.teamId || item.id || index}
            className="grid grid-cols-[60px_1fr_80px] items-center rounded-2xl bg-slate-800 px-4 py-3"
          >
            <span className="font-black text-emerald-400">
              {index + 1}º
            </span>

            <span className="font-semibold">
              {item.players ||
                (team
                  ? `${team.player1} / ${team.player2}`
                  : "Equipe")}
            </span>

            <span className="text-right font-black">
  {item.wins}V | {item.balance > 0 ? "+" : ""}{item.balance}
</span>
          </div>
        );
      })}
    </div>
  </div>

  {/* GRUPO B */}
  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
    <h2 className="text-2xl font-black">
      Classificação — Grupo B
    </h2>
    <div className="mt-5 space-y-3">
      <div className="grid grid-cols-[60px_1fr_80px] mb-2 px-4 text-xs font-bold uppercase text-slate-400">
  <span>Pos</span>
  <span>Dupla</span>
  <span className="text-right">V | SG</span>
</div>
      {rankingB.map((item, index) => {
        const team = getTeam(item.teamId || item.id);

        return (
          <div
            key={item.teamId || item.id || index}
            className="grid grid-cols-[60px_1fr_80px] items-center rounded-2xl bg-slate-800 px-4 py-3"
          >
            <span className="font-black text-emerald-400">
              {index + 1}º
            </span>

            <span className="font-semibold">
              {item.players ||
                (team
                  ? `${team.player1} / ${team.player2}`
                  : "Equipe")}
            </span>

            <span className="text-right font-black">
  {item.wins}V | {item.balance > 0 ? "+" : ""}{item.balance}
</span>
          </div>
        );
      })}
    </div>
  </div>
</section>
      </div>
    </div>
  );
}