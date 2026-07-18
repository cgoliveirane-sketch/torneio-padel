function getTeamName(team) {
  if (!team) {
    return "A definir";
  }

  if (typeof team === "string") {
    return team;
  }

  if (team.name) {
    return team.name;
  }

  if (team.player1 || team.player2) {
    return [team.player1, team.player2]
      .filter(Boolean)
      .join(" / ");
  }

  if (Array.isArray(team.players)) {
    return team.players
      .map((player) =>
        typeof player === "string"
          ? player
          : player?.name
      )
      .filter(Boolean)
      .join(" / ");
  }

  return "A definir";
}

export default function MatchCard({
  match,
  label,
  isFinal = false,
  className = "",
}) {
  const team1 =
    match?.team1 ??
    match?.home ??
    match?.player1 ??
    match?.dupla1 ??
    null;

  const team2 =
    match?.team2 ??
    match?.away ??
    match?.player2 ??
    match?.dupla2 ??
    null;

  const score1 =
    match?.score1 ??
    match?.scoreHome ??
    match?.homeScore ??
    match?.placar1;

  const score2 =
    match?.score2 ??
    match?.scoreAway ??
    match?.awayScore ??
    match?.placar2;

  const finished =
    match?.finished ??
    match?.isFinished ??
    match?.completed ??
    match?.status === "finished";

  const winner =
    match?.winner ??
    match?.winningTeam ??
    null;

  const team1Name = getTeamName(team1);
  const team2Name = getTeamName(team2);
  const winnerName = getTeamName(winner);

  const team1Won =
    Boolean(finished) &&
    (winnerName === team1Name ||
      Number(score1) > Number(score2));

  const team2Won =
    Boolean(finished) &&
    (winnerName === team2Name ||
      Number(score2) > Number(score1));

  return (
    <article
      className={`absolute rounded-3xl border border-emerald-500/40 bg-slate-900/95 shadow-2xl ${
        isFinal
          ? "w-[430px] p-6"
          : "w-[390px] p-5"
      } ${className}`}
    >
      <header className="mb-5 flex items-center justify-between gap-4">
        <h3
          className={`font-black uppercase tracking-[0.18em] ${
            isFinal
              ? "text-base text-emerald-400"
              : "text-sm text-slate-300"
          }`}
        >
          {label}
        </h3>

        {finished && (
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-black uppercase text-emerald-400">
            Finalizado
          </span>
        )}
      </header>

      <div className="space-y-3">
        <div
          className={`flex min-h-[68px] items-center justify-between gap-4 rounded-2xl px-5 py-3 ${
            team1Won
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-slate-800 text-white"
          }`}
        >
          <span className="min-w-0 whitespace-normal break-words pr-3 text-lg font-bold leading-snug">
            {team1Won && (
              <span className="mr-2 text-emerald-400">
                ✓
              </span>
            )}

            {team1Name}
          </span>

          <strong className="shrink-0 text-3xl font-black">
            {score1 ?? "-"}
          </strong>
        </div>

        <div
          className={`flex min-h-[68px] items-center justify-between gap-4 rounded-2xl px-5 py-3 ${
            team2Won
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-slate-800 text-white"
          }`}
        >
          <span className="min-w-0 whitespace-normal break-words pr-3 text-lg font-bold leading-snug">
            {team2Won && (
              <span className="mr-2 text-emerald-400">
                ✓
              </span>
            )}

            {team2Name}
          </span>

          <strong className="shrink-0 text-3xl font-black">
            {score2 ?? "-"}
          </strong>
        </div>
      </div>
    </article>
  );
}