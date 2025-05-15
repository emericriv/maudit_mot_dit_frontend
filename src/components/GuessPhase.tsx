interface GuessPhaseProps {
  onGuess: (guess: string) => void;
}

export const GuessPhase = ({ onGuess }: GuessPhaseProps) => {
  return (
    <div className="text-center bg-card border border-border p-4 rounded-lg shadow-sm">
      <p className="mb-4 text-lg">Devinez le mot à partir des indices :</p>
      <input
        type="text"
        placeholder="Proposez votre mot..."
        className="w-full p-3 rounded-lg border border-border bg-background text-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            onGuess(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};
