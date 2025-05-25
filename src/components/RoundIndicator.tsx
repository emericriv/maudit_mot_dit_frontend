interface RoundCompleteProps {
  currentRound: number;
  totalRounds: number;
}

export const RoundIndicator = ({
  currentRound,
  totalRounds,
}: RoundCompleteProps) => {
  return (
    <div
      className="text-sm text-muted-foreground bg-primary py-3 px-6 rounded-full text-background
    "
    >
      Tour {currentRound}/{totalRounds}
    </div>
  );
};
