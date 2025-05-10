interface CluePhaseProps {
  selectedWord: string;
  onClueSubmit: (clue: string) => void;
}

export const CluePhase = ({ selectedWord, onClueSubmit }: CluePhaseProps) => {
  return (
    <div className="text-center">
      <p className="mb-2">
        Donnez un indice pour faire deviner le mot :{" "}
        <strong>{selectedWord}</strong>
      </p>
      <input
        type="text"
        placeholder="Tapez votre indice..."
        className="w-full p-2 border rounded"
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
