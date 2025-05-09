import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/apiServices";

function CreateRoomPage() {
  const [pseudo, setPseudo] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom(pseudo);
      console.log("Room créée avec succès:", response);

      // Stockage des informations de session
      sessionStorage.setItem("sessionId", response.sessionId);
      sessionStorage.setItem("playerId", response.playerId.toString());
      sessionStorage.setItem("pseudo", response.pseudo);

      navigate(`/lobby/${response.roomCode}`);
    } catch (error) {
      alert("Erreur lors de la création de la room.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Créer une Room</h1>
      <input
        type="text"
        placeholder="Votre pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
      />
      <button
        onClick={handleCreateRoom}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
      >
        Créer
      </button>
    </div>
  );
}

export default CreateRoomPage;
