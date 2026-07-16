export default function TvMode() {
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
                  João / Altemar
                </p>
              </div>

              <div className="text-3xl font-black text-slate-500">
                X
              </div>

              <div>
                <p className="text-2xl font-black">
                  Patrick / Marcos
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
                  Adriel / Cícero
                </p>
              </div>

              <div className="text-3xl font-black text-slate-500">
                X
              </div>

              <div>
                <p className="text-2xl font-black">
                  Mateus / Alexandre
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-2xl font-black">
              Classificação — Grupo A
            </h2>

            <div className="mt-5 space-y-3">
              {[
                ["1º", "João / Altemar", "12"],
                ["2º", "Patrick / Marcos", "9"],
                ["3º", "Edipo / Fernando", "3"],
              ].map(([position, team, points]) => (
                <div
                  key={team}
                  className="grid grid-cols-[60px_1fr_60px] items-center rounded-2xl bg-slate-800 px-4 py-3"
                >
                  <span className="font-black text-emerald-400">
                    {position}
                  </span>

                  <span className="font-semibold">
                    {team}
                  </span>

                  <span className="text-right font-black">
                    {points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-2xl font-black">
              Classificação — Grupo B
            </h2>

            <div className="mt-5 space-y-3">
              {[
                ["1º", "Adriel / Cícero", "12"],
                ["2º", "Mateus / Alexandre", "9"],
                ["3º", "Rafael / Lucas", "3"],
              ].map(([position, team, points]) => (
                <div
                  key={team}
                  className="grid grid-cols-[60px_1fr_60px] items-center rounded-2xl bg-slate-800 px-4 py-3"
                >
                  <span className="font-black text-emerald-400">
                    {position}
                  </span>

                  <span className="font-semibold">
                    {team}
                  </span>

                  <span className="text-right font-black">
                    {points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}