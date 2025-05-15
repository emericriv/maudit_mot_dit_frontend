import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createRoom } from "../services/apiServices";

export default function CreateRoomPage() {
  const [pseudo, setPseudo] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createRoom(pseudo);
      sessionStorage.setItem("sessionId", response.sessionId);
      sessionStorage.setItem("playerId", response.playerId.toString());
      sessionStorage.setItem("pseudo", response.pseudo);

      navigate(`/lobby/${response.roomCode}`);
    } catch (error) {
      alert("Erreur lors de la création de la room.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center px-4">
      {/* Lien de retour */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-primary hover:underline text-sm flex items-center"
      >
        ← Retour à l'accueil
        <img
          src="/Maudit_mot_dit_logo.png"
          alt="Logo Maudit Mot Dit"
          className="w-10 h-10"
        />
      </Link>

      {/* Bloc central */}
      <div className="bg-secondary text-background p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Créer une partie
        </h1>

        <form onSubmit={handleCreateRoom}>
          <label htmlFor="pseudo" className="block mb-2 font-semibold">
            Choisissez un pseudo
          </label>
          <input
            id="pseudo"
            type="text"
            placeholder="Votre pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-primary focus:outline-none focus:ring-2 focus:ring-primary/60 mb-6"
          />

          <button
            type="submit"
            className="w-full bg-primary text-background font-bold px-6 py-3 rounded-full hover:bg-accent hover:cursor-pointer transition-all"
          >
            Créer la room
          </button>
        </form>
      </div>
    </div>
  );
}
