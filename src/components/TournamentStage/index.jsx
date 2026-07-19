import BracketScreen from "./BracketScreen";

export default function TournamentStage({
  currentPhase,
  quarterFinals = [],
  semifinals = [],
  finalMatch = [],
  thirdPlaceMatch = [],
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
          thirdPlaceMatch={thirdPlaceMatch}
        />
      );

    default:
      return (
        <BracketScreen
          quarterFinals={quarterFinals}
          semifinals={semifinals}
          finalMatch={finalMatch}
          thirdPlaceMatch={thirdPlaceMatch}
        />
      );
  }
}