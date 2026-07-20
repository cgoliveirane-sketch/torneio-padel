import MatchCard from "./MatchCard";
import BracketConnector from "./BracketConnector";

export default function BracketScreen({
  quarterFinals = [],
  semifinals = [],
  finalMatch = [],
}) {
  const qf1 = quarterFinals[0];
  const qf2 = quarterFinals[1];
  const qf3 = quarterFinals[2];
  const qf4 = quarterFinals[3];

  const sf1 = semifinals[0];
  const sf2 = semifinals[1];

  const final = finalMatch[0];

  return (
    <section className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      <div className="relative mx-auto h-[1020px] min-w-[1720px]">
        {/* Títulos */}
        <div className="absolute left-[20px] top-0 w-[390px] text-center">
          <h2 className="text-lg font-black uppercase tracking-[0.3em] text-slate-400">
            Quartas de final
          </h2>
        </div>

        <div className="absolute left-[660px] top-0 w-[390px] text-center">
          <h2 className="text-lg font-black uppercase tracking-[0.3em] text-slate-400">
            Semifinais
          </h2>
        </div>

        <div className="absolute left-[1260px] top-0 w-[430px] text-center">
          <h2 className="text-lg font-black uppercase tracking-[0.3em] text-emerald-400">
            Grande final
          </h2>
        </div>

        {/* Quartas de final */}
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

        {/* Quartas 1 e 2 para semifinal 1 */}
        <BracketConnector
          left={410}
          top={160}
          width={120}
          orientation="horizontal"
        />

        <BracketConnector
          left={410}
          top={390}
          width={120}
          orientation="horizontal"
        />

        <BracketConnector
          left={530}
          top={160}
          height={230}
          orientation="vertical"
        />

        <BracketConnector
          left={530}
          top={275}
          width={130}
          orientation="horizontal"
        />

        {/* Quartas 3 e 4 para semifinal 2 */}
        <BracketConnector
          left={410}
          top={670}
          width={120}
          orientation="horizontal"
        />

        <BracketConnector
          left={410}
          top={900}
          width={120}
          orientation="horizontal"
        />

        <BracketConnector
          left={530}
          top={670}
          height={230}
          orientation="vertical"
        />

        <BracketConnector
          left={530}
          top={785}
          width={130}
          orientation="horizontal"
        />

        {/* Semifinal 1 para final */}
        <BracketConnector
          left={1050}
          top={275}
          width={100}
          orientation="horizontal"
        />

        {/* Semifinal 2 para final */}
        <BracketConnector
          left={1050}
          top={785}
          width={100}
          orientation="horizontal"
        />

        {/* União das semifinais */}
        <BracketConnector
          left={1150}
          top={275}
          height={510}
          orientation="vertical"
        />

        <BracketConnector
          left={1150}
          top={530}
          width={110}
          orientation="horizontal"
        />

        {/* Indicador central */}
        <div className="absolute left-[1194px] top-[516px] z-20 flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/70 bg-slate-950 text-xs font-black text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]">
          ▶️
        </div>
      </div>
    </section>
  );
}