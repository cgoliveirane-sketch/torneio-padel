function MatchBox({ match, highlight = false }) {
  if (!match) {
    return (
      <div className="min-h-28 rounded-xl border border-dashed bg-slate-50 p-4 text-sm text-slate-400">
        Aguardando definição
      </div>
    );
  }

  return (
    <div
      className={
        highlight
          ? "min-h-28 rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm"
          : "min-h-28 rounded-xl border bg-slate-50 p-4 shadow-sm"
      }
    >
      <div className="mb-2 font-bold">
        {match.id}
      </div>

      <div className="border-b py-1">
        {match.home}
      </div>

      <div className="py-1">
        {match.away}
      </div>
    </div>
  );
}

export default function Bracket({
  quarterFinals = [],
  semifinals = [],
  finalMatch = [],
}) {
  return (
    <section className="overflow-x-auto rounded-3xl border bg-white p-6 shadow-lg">
      <h2 className="mb-8 text-3xl font-bold">
        🌳 Chaveamento
      </h2>

      <div className="grid min-w-[1000px] grid-cols-3 gap-10">
        {/* QUARTAS */}
        <div>
          <h3 className="mb-5 text-xl font-bold">
            Quartas
          </h3>

          <div className="grid grid-rows-4 gap-5">
            <MatchBox match={quarterFinals[0]} />
            <MatchBox match={quarterFinals[1]} />
            <MatchBox match={quarterFinals[2]} />
            <MatchBox match={quarterFinals[3]} />
          </div>
        </div>

        {/* SEMIFINAIS */}
        <div>
          <h3 className="mb-5 text-xl font-bold">
            Semifinais
          </h3>

          <div className="grid h-full grid-rows-4 gap-5">
            <div className="row-span-2 flex items-center">
              <div className="w-full">
                <MatchBox match={semifinals[0]} />
              </div>
            </div>

            <div className="row-span-2 flex items-center">
              <div className="w-full">
                <MatchBox match={semifinals[1]} />
              </div>
            </div>
          </div>
        </div>

        {/* FINAL */}
        <div>
          <h3 className="mb-5 text-xl font-bold">
            Final
          </h3>

          <div className="flex h-full items-center">
            <div className="w-full">
              <MatchBox
                match={finalMatch[0]}
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}