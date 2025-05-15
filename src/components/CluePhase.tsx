interface CluePhaseProps {
  selectedWord: string;
  onClueSubmit: (clue: string) => void;
}

export const CluePhase = ({ selectedWord, onClueSubmit }: CluePhaseProps) => {
  return (
    <div className="text-center bg-card border border-border p-4 rounded-lg shadow-sm">
      <p className="mb-4 text-lg">
        Donnez un indice pour faire deviner le mot :{" "}
        <strong className="text-primary">{selectedWord}</strong>
      </p>
      <input
        type="text"
        placeholder="Tapez votre indice..."
        className="w-full p-3 rounded-lg border border-border bg-background text-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            onClueSubmit(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};
