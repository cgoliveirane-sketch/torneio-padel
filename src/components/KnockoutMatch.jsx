export default function KnockoutMatch({
  title,
  matches,
  pointOptions,
  onScoreChange,
  onFinishMatch,
}) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-2xl font-bold">
        🏆 {title}
      </h2>

      <div className="grid gap-5 x1:grid-cols-2">
        {matches.map((match) => {
          const winner = match.finished
            ? Number(match.scoreHome) >
              Number(match.scoreAway)
              ? match.home
              : match.away
            : null;

          const participantsDefined =
            Boolean(match.home) && Boolean(match.away);

          return (
            <div
              key={match.id}
              className={
                match.finished
                  ? "rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                  : "rounded-xl border bg-slate-50 p-4"
              }
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-bold">
                  {match.id}
                </span>

                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500">
                    {match.finished
                      ? "🏆 Vencedor"
                      : participantsDefined
                      ? "Pendente"
                      : "Aguardando classificados"}
                  </div>

                  {winner && (
                    <div className="mt-1 text-xs font-bold text-emerald-700">
                      {winner}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="text-center">
                  <div className="mb-2 min-h-12 break-words text-sm font-semibold leading-snug">
                    {match.home || "A definir"}
                  </div>

                  <select
                    value={match.scoreHome}
                    disabled={!participantsDefined}
                    onChange={(event) =>
                      onScoreChange(
                        match.id,
                        "scoreHome",
                        event.target.value
                      )
                    }
                    className="mx-auto block w-20 rounded-xl border bg-white px-2 py-3 text-center text-xl font-bold outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-24"
                  >
                    <option value="">-</option>

                    {pointOptions.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center font-bold text-slate-400">
                  X
                </div>

                <div className="text-center">
                  <div className="mb-2 min-h-10 text-sm font-semibold">
                    {match.away || "A definir"}
                  </div>

                  <select
                    value={match.scoreAway}
                    disabled={!participantsDefined}
                    onChange={(event) =>
                      onScoreChange(
                        match.id,
                        "scoreAway",
                        event.target.value
                      )
                    }
                    className="mx-auto block w-24 rounded-xl border bg-white px-3 py-2 text-center text-xl font-bold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">-</option>

                    {pointOptions.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={!participantsDefined}
                onClick={() => onFinishMatch(match)}
                className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {match.finished
                  ? "Atualizar resultado"
                  : participantsDefined
                  ? "Finalizar partida"
                  : "Aguardando classificados"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}