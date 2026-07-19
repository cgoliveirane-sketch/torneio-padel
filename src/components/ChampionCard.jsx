export default function ChampionCard({ champion }) {
  if (!champion) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-yellow-300 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 p-8 text-center shadow-xl">
      <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-yellow-300/30 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-orange-300/30 blur-3xl" />

      <div className="relative">
        <div className="text-6xl">🏆</div>

        <p className="mt-4 text-sm font-black uppercase tracking-[0.35em] text-amber-700">
          Campeões do torneio
        </p>

        <h2 className="mx-auto mt-4 max-w-3xl break-words text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          {champion}
        </h2>

        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-amber-500" />

        <p className="mt-5 text-sm font-semibold text-slate-600 sm:text-base">
          Parabéns pela conquista!
        </p>
      </div>
    </section>
  );
}