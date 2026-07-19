import KnockoutMatch from "./KnockoutMatch";

export default function KnockoutStage({
  quarterFinals,
  semifinals,
  finalMatch,
  thirdPlaceMatch,
  settings,
  quarterPointOptions,
  semiPointOptions,
  finalPointOptions,
  setQuarterFinals,
  setSemifinals,
  setFinalMatch,
  setThirdPlaceMatch,
  setChampion,
  setMessage,
  finishMatch,
  updateSemifinalsFromQuarterFinals,
  updateFinalFromSemifinals,
  updateThirdPlaceFromSemifinals,
}) {
  return (
    <>
{quarterFinals.length > 0 && (
  <KnockoutMatch
    title="Quartas de Final"
    matches={quarterFinals}
    pointOptions={quarterPointOptions}
    onScoreChange={(id, field, value) => {
      setQuarterFinals((current) =>
        current.map((match) =>
          match.id === id
            ? { ...match, [field]: value }
            : match
        )
      );
    }}
onFinishMatch={(match) => {
  try {
    const updatedQuarterFinals = finishMatch(
      quarterFinals,
      match.id,
      match.scoreHome,
      match.scoreAway,
      settings.quarterPoints
    );

    setQuarterFinals(updatedQuarterFinals);

    setSemifinals((currentSemifinals) =>
      updateSemifinalsFromQuarterFinals(
        updatedQuarterFinals,
        currentSemifinals
      )
    );

    const finishedQuarterFinals =
      updatedQuarterFinals.filter(
        (quarterMatch) => quarterMatch.finished
      ).length;

    if (finishedQuarterFinals === 4) {
      setMessage(
        "Quartas encerradas. Semifinais completas."
      );
    } else {
      setMessage(
        `Resultado salvo. ${finishedQuarterFinals} de 4 classificados para as semifinais.`
      );
    }
  } catch (error) {
    setMessage(error.message);
  }
}}
  />
)}
{semifinals.length > 0 && (
  <KnockoutMatch
    title="Semifinais"
    matches={semifinals}
    pointOptions={semiPointOptions}
    onScoreChange={(id, field, value) => {
  setSemifinals((current) =>
    current.map((match) =>
      match.id === id
        ? {
            ...match,
            [field]: value,
            finished: false,
            winner: null,
          }
        : match
    )
  );

  setFinalMatch([]);
  setThirdPlaceMatch([]);
}}
    onFinishMatch={(match) => {
      try {
        const updatedSemifinals = finishMatch(
          semifinals,
          match.id,
          match.scoreHome,
          match.scoreAway,
          settings.semiPoints
        );

        setSemifinals(updatedSemifinals);

        setFinalMatch((currentFinal) =>
  updateFinalFromSemifinals(
    updatedSemifinals,
    currentFinal
  )
);
setThirdPlaceMatch((currentThirdPlace) =>
  updateThirdPlaceFromSemifinals(
    updatedSemifinals,
    currentThirdPlace
  )
);

const finishedSemifinals =
  updatedSemifinals.filter(
    (match) => match.finished
  ).length;

if (finishedSemifinals === 2) {
  setMessage(
    "Final completa."
  );
} else {
  setMessage(
    `Resultado salvo. ${finishedSemifinals} de 2 classificados para a final.`
  );
}
      } catch (error) {
        setMessage(error.message);
      }
    }}
  />
)}

{thirdPlaceMatch.length > 0 && (
  <KnockoutMatch
    title="Disputa de 3º Lugar"
    matches={thirdPlaceMatch}
    pointOptions={semiPointOptions}
    onScoreChange={(id, field, value) => {
      setThirdPlaceMatch((current) =>
        current.map((match) =>
          match.id === id
            ? {
                ...match,
                [field]: value,
                finished: false,
                winner: null,
              }
            : match
        )
      );
    }}
    onFinishMatch={(match) => {
      try {
        const updatedThirdPlace = finishMatch(
          thirdPlaceMatch,
          match.id,
          match.scoreHome,
          match.scoreAway,
          settings.semiPoints
        );

        setThirdPlaceMatch(updatedThirdPlace);

        setMessage(
          "Disputa de 3º lugar encerrada. Terceiro colocado definido."
        );
      } catch (error) {
        setMessage(error.message);
      }
    }}
  />
)}
{finalMatch.length > 0 && (
  <KnockoutMatch
    title="Final"
    matches={finalMatch}
    pointOptions={finalPointOptions}
    onScoreChange={(id, field, value) => {
      setFinalMatch((current) =>
        current.map((match) =>
          match.id === id
            ? {
                ...match,
                [field]: value,
                finished: false,
              }
            : match
        )
      );

      setChampion(null);
    }}
    onFinishMatch={(match) => {
      try {
        const updatedFinal = finishMatch(
          finalMatch,
          match.id,
          match.scoreHome,
          match.scoreAway,
          settings.finalPoints
        );

        setFinalMatch(updatedFinal);

        const winner =
          Number(match.scoreHome) >
          Number(match.scoreAway)
            ? match.home
            : match.away;

        setChampion(winner);
        setMessage("Final encerrada. Campeão definido.");
      } catch (error) {
        setMessage(error.message);
      }
    }}
  />
)}
</>
  );
}