interface CluesListProps {
  givenClues: string[];
}

export const CluesList = ({ givenClues }: CluesListProps) => (
  <div className="mt-6">
    <h3 className="font-bold mb-2">Indices donnés :</h3>
    <div className="flex flex-wrap gap-2">
      {givenClues.map((clue, index) => (
        <div key={index} className="bg-blue-100 px-3 py-1 rounded-full">
          {clue}
        </div>
      ))}
    </div>
  </div>
);
