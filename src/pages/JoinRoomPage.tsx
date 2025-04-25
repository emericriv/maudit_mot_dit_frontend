// src/pages/JoinRoomPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../services/apiServices";

export default function JoinRoomPage() {
  const [pseudo, setPseudo] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await joinRoom(pseudo, roomCode);
      // Stockage session temporaire (à améliorer plus tard)
      sessionStorage.setItem("sessionId", response.sessionId);
      sessionStorage.setItem("playerId", response.playerId.toString());
      sessionStorage.setItem("pseudo", response.pseudo);

      navigate(`/lobby/${response.roomCode}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Join a Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Your Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}
