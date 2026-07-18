import BracketScreen from "./BracketScreen";

export default function TournamentStage({
  currentPhase,
  quarterFinals = [],
  semifinals = [],
  finalMatch = [],
}) {
  switch (currentPhase) {
    case "quarterFinals":
    case "semifinals":
    case "final":
      return (
        <BracketScreen
          quarterFinals={quarterFinals}
          semifinals={semifinals}
          finalMatch={finalMatch}
        />
      );

    default:
      return (
        <BracketScreen
          quarterFinals={quarterFinals}
          semifinals={semifinals}
          finalMatch={finalMatch}
        />
      );
  }
}