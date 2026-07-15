function RankingTable({ groupName, ranking }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b bg-slate-50 px-5 py-4">
        <h2 className="text-2xl font-bold">
          Classificação — Grupo {groupName}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Pos.</th>
              <th className="px-4 py-3">Dupla</th>
              <th className="px-4 py-3">J</th>
              <th className="px-4 py-3">V</th>
              <th className="px-4 py-3">D</th>
              <th className="px-4 py-3">PF</th>
              <th className="px-4 py-3">PC</th>
              <th className="px-4 py-3">Saldo</th>
            </tr>
          </thead>

          <tbody>
            {ranking.map((team, index) => (
              <tr
                key={team.id}
                className={
                  index === 0
                    ? "border-t bg-green-200"
                    : index === 1
                    ? "border-t bg-green-100"
                    : "border-t"
                }
              >
                <td className="px-4 py-3 font-bold">
  {index === 0
    ? "🥇"
    : index === 1
    ? "🥈"
    : index === 2
    ? "🥉"
    : index + 1 + "º"}
</td>

                <td className="px-4 py-3">
                  <div className="font-semibold">
                    {team.id}
                  </div>
                  <div className="text-xs text-slate-500">
                    {team.players}
                  </div>
                </td>

                <td className="px-4 py-3 text-center">{team.games}</td>
                <td className="px-4 py-3 text-center">{team.wins}</td>
                <td className="px-4 py-3 text-center">{team.losses}</td>
                <td className="px-4 py-3 text-center">{team.pointsFor}</td>
                <td className="px-4 py-3 text-center">{team.pointsAgainst}</td>
                <td className="px-4 py-3 text-center font-bold">
                  {team.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default RankingTable;