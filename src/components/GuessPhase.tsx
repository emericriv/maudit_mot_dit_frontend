interface GuessPhaseProps {
  onGuess: (guess: string) => void;
}

export const GuessPhase = ({ onGuess }: GuessPhaseProps) => {
  return (
    <div className="text-center">
      <p className="mb-2">Devinez le mot à partir des indices :</p>
      <input
        type="text"
        placeholder="Proposez votre mot..."
        className="w-full p-2 border rounded"
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
