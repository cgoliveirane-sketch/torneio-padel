function getWinner(match) {
  if (!match?.finished) {
    return null;
  }

  return Number(match.scoreHome) >
    Number(match.scoreAway)
    ? match.home
    : match.away;
}

function getLoser(match) {
  if (!match?.finished) {
    return null;
  }

  return Number(match.scoreHome) >
    Number(match.scoreAway)
    ? match.away
    : match.home;
}

export default function PodiumCard({
  finalMatch = [],
  thirdPlaceMatch = [],
}) {
  const final = finalMatch[0];
  const thirdPlaceGame = thirdPlaceMatch[0];

  if (!final?.finished) {
    return null;
  }

  const champion = getWinner(final);
  const runnerUp = getLoser(final);
  const thirdPlace = getWinner(thirdPlaceGame);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5 shadow-xl sm:p-8">
      <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative">
        <div className="mb-8 text-center">
          <div className="text-5xl">🏆</div>

          <p className="mt-3 text-xs font-black uppercase tracking-[0.35em] text-slate-500">
            Resultado final
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            Pódio do Torneio
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 lg:items-end">
          <div className="order-2 rounded-3xl border border-slate-300 bg-white p-6 text-center shadow-md lg:order-1">
            <div className="text-5xl">🥈</div>

            <p className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              2º lugar
            </p>

            <h3 className="mt-3 text-xl font-black text-slate-900">
              Vice-campeões
            </h3>

            <p className="mt-4 break-words font-semibold leading-snug text-slate-700">
              {runnerUp || "A definir"}
            </p>
          </div>

          <div className="order-1 rounded-3xl border border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-100 p-8 text-center shadow-lg lg:order-2 lg:-translate-y-6">
            <div className="text-6xl">🥇</div>

            <p className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-amber-700">
              1º lugar
            </p>

            <h3 className="mt-3 text-2xl font-black text-slate-950">
              Campeões
            </h3>

            <p className="mt-4 break-words text-lg font-black leading-snug text-slate-950">
              {champion || "A definir"}
            </p>
          </div>

          <div className="order-3 rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-100 p-6 text-center shadow-md">
            <div className="text-5xl">🥉</div>

            <p className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-amber-700">
              3º lugar
            </p>

            <h3 className="mt-3 text-xl font-black text-slate-900">
              Terceiro colocado
            </h3>

            <p className="mt-4 break-words font-semibold leading-snug text-slate-700">
              {thirdPlace || "A definir"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}