function MatchCard({
  match,
  label,
  className = "",
  isFinal = false,
}) {
  const homeWon =
    match?.finished &&
    Number(match.scoreHome) > Number(match.scoreAway);

  const awayWon =
    match?.finished &&
    Number(match.scoreAway) > Number(match.scoreHome);

  function formatTeam(team) {
    if (!team) {
      return "Aguardando definição";
    }

    return team;
  }

  return (
    <div
      className={`absolute z-10 rounded-2xl border shadow-xl ${
        match?.finished
          ? "border-emerald-500/50 bg-slate-900"
          : "border-slate-700 bg-slate-900"
      } ${isFinal ? "w-[420px] p-5" : "w-[380px] p-4"} ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`text-xs font-black uppercase tracking-[0.18em] ${
            isFinal
              ? "text-emerald-400"
              : "text-slate-400"
          }`}
        >
          {label}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
            match?.finished
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {match?.finished ? "Finalizado" : "Aguardando"}
        </span>
      </div>

      <div className="space-y-2">
        <div
          className={`flex min-h-[52px] items-center justify-between gap-3 rounded-xl px-4 py-3 ${
            homeWon
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-slate-800 text-white"
          }`}
        >
          <span className="min-w-0 whitespace-normal break-words pr-3 font-bold leading-snug">
            {homeWon && (
              <span className="mr-2">✓</span>
            )}

            {formatTeam(match?.home)}
          </span>

          <span className="shrink-0 text-2xl font-black">
            {match?.finished ? match.scoreHome : "–"}
          </span>
        </div>

        <div
          className={`flex min-h-[64px] items-center justify-between gap-3 rounded-xl px-4 py-3 ${
            awayWon
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-slate-800 text-white"
          }`}
        >
          <span className="min-w-0 truncate font-bold">
            {awayWon && (
              <span className="mr-2">✓</span>
            )}

            {formatTeam(match?.away)}
          </span>

          <span className="shrink-0 text-2xl font-black">
            {match?.finished ? match.scoreAway : "–"}
          </span>
        </div>
      </div>
    </div>
  );
}

function HorizontalLine({
  left,
  top,
  width,
}) {
  return (
    <div
      className="absolute z-0 h-px bg-slate-600"
      style={{
        left,
        top,
        width,
      }}
    />
  );
}

function VerticalLine({
  left,
  top,
  height,
}) {
  return (
    <div
      className="absolute z-0 w-px bg-slate-600"
      style={{
        left,
        top,
        height,
      }}
    />
  );
}

export default function TournamentBracket({
  quarterFinals = [],
  semifinals = [],
  finalMatch = [],
  champion = null,
  viceChampion = null,
  showChampionOverlay = false,
}) {
  const final = Array.isArray(finalMatch)
    ? finalMatch[0]
    : finalMatch;

  const qf1 = quarterFinals[0];
  const qf2 = quarterFinals[1];
  const qf3 = quarterFinals[2];
  const qf4 = quarterFinals[3];

  const sf1 = semifinals[0];
  const sf2 = semifinals[1];

  return (
    <section className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
  <div className="relative mx-auto h-[1020px] min-w-[1720px]">
    {/* Títulos */}
    <div className="absolute left-[20px] top-0 w-[380px] text-center">
      <h2 className="text-lg font-black uppercase tracking-[0.3em] text-slate-400">
        Quartas de final
      </h2>
    </div>

    <div className="absolute left-[660px] top-0 w-[380px] text-center">
      <h2 className="text-lg font-black uppercase tracking-[0.3em] text-slate-400">
        Semifinais
      </h2>
    </div>

    <div className="absolute left-[1260px] top-0 w-[420px] text-center">
      <h2 className="text-lg font-black uppercase tracking-[0.3em] text-emerald-400">
        Grande final
      </h2>
    </div>

    {/* Quartas */}
    <MatchCard
      match={qf1}
      label="Quartas 1"
      className="left-[20px] top-[60px]"
    />

    <MatchCard
      match={qf2}
      label="Quartas 2"
      className="left-[20px] top-[290px]"
    />

    <MatchCard
      match={qf3}
      label="Quartas 3"
      className="left-[20px] top-[570px]"
    />

    <MatchCard
      match={qf4}
      label="Quartas 4"
      className="left-[20px] top-[800px]"
    />

    {/* Semifinais */}
    <MatchCard
      match={sf1}
      label="Semifinal 1"
      className="left-[660px] top-[175px]"
    />

    <MatchCard
      match={sf2}
      label="Semifinal 2"
      className="left-[660px] top-[685px]"
    />

    {/* Final */}
    <MatchCard
      match={final}
      label="Grande final"
      isFinal
      className="left-[1260px] top-[430px]"
    />

    {/* Quartas 1 e 2 → Semifinal 1 */}
    <HorizontalLine left={400} top={155} width={130} />
    <HorizontalLine left={400} top={385} width={130} />
    <VerticalLine left={530} top={155} height={230} />
    <HorizontalLine left={530} top={270} width={130} />

    {/* Quartas 3 e 4 → Semifinal 2 */}
    <HorizontalLine left={400} top={665} width={130} />
    <HorizontalLine left={400} top={895} width={130} />
    <VerticalLine left={530} top={665} height={230} />
    <HorizontalLine left={530} top={780} width={130} />

    {/* Semifinais → Final */}
    <HorizontalLine left={1040} top={270} width={110} />
    <HorizontalLine left={1040} top={780} width={110} />
    <VerticalLine left={1150} top={270} height={510} />
    <HorizontalLine left={1150} top={525} width={110} />

    <div className="absolute left-[1195px] top-[512px] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/60 bg-slate-950 text-xs font-black text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
      ▶️
    </div>
  </div>
</section>
  );
}