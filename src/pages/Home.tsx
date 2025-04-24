// src/pages/Home.tsx
import { useState } from "react";
import { createRoom, joinRoom } from "../services/apiServices";

const Home = () => {
  const [pseudo, setPseudo] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = async () => {
    const data = await createRoom(pseudo);
    console.log("Room créée :", data);
  };

  const handleJoin = async () => {
    const data = await joinRoom(roomCode, pseudo);
    console.log("Room rejointe :", data);
  };

  return (
    <div className="p-4 space-y-4">
      <input
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        placeholder="Ton pseudo"
        className="border px-2 py-1"
      />
      <input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Code de la room"
        className="border px-2 py-1"
      />
      <div className="space-x-2">
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Créer une room
        </button>
        <button
          onClick={handleJoin}
          className="bg-green-500 text-white px-4 py-2"
        >
          Rejoindre une room
        </button>
      </div>
    </div>
  );
};

export default Home;
