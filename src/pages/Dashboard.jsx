export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="text-lg font-bold">Próximo jogo Grupo A</h2>

          <p className="mt-3 text-slate-500">
            Nenhum jogo iniciado.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="text-lg font-bold">Próximo jogo Grupo B</h2>

          <p className="mt-3 text-slate-500">
            Nenhum jogo iniciado.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">Ranking</h2>

        <p className="text-slate-500">Em construção...</p>
      </div>
    </div>
  );
}