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

  if (!final?.finished) {
    return null;
  }

  const champion = getWinner(final);
  const runnerUp = getLoser(final);

const thirdPlaceGame = thirdPlaceMatch[0];
const thirdPlace = getWinner(thirdPlaceGame);

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-lg">
      <div className="mb-8 text-center">
        <div className="text-5xl">🏆</div>

        <h2 className="mt-3 text-3xl font-black text-slate-900">
          Pódio do Torneio
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-6 text-center shadow-sm">
          <div className="text-4xl">🥇</div>

          <h3 className="mt-3 text-xl font-bold">
            Campeões
          </h3>

          <p className="mt-3 font-semibold text-slate-900">
            {champion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-300 bg-slate-50 p-6 text-center shadow-sm">
          <div className="text-4xl">🥈</div>

          <h3 className="mt-3 text-xl font-bold">
            Vice-campeões
          </h3>

          <p className="mt-3 font-semibold text-slate-900">
            {runnerUp}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center shadow-sm">
          <div className="text-4xl">🥉</div>

          <h3 className="mt-3 text-xl font-bold">
  Terceiro colocado
</h3>

<p className="mt-3 font-semibold text-slate-900">
  {thirdPlace || "A definir"}
</p>
        </div>
      </div>
    </section>
  );
}