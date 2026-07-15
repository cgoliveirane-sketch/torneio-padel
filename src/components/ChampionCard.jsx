export default function ChampionCard({ champion }) {
  if (!champion) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-yellow-300 bg-gradient-to-br from-yellow-100 via-amber-50 to-white p-8 text-center shadow-lg">
      <div className="text-6xl">
        🏆
      </div>

      <h2 className="mt-4 text-4xl font-black text-slate-900">
        Campeões
      </h2>

      <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-amber-700">
        Torneio de Pádel
      </p>

      <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-yellow-200 bg-white/80 px-6 py-5 shadow-sm">
        <p className="text-2xl font-bold text-slate-900">
          {champion}
        </p>
      </div>

      <div className="mt-6 text-4xl">
        🥇 🎉
      </div>
    </section>
  );
}