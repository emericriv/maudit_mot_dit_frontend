import axios from "axios";

export interface Player {
  id: string;
  pseudo: string;
  is_owner: boolean;
  score: number;
}

export interface WordChoice {
  word1: { word: string; clues: number; malus: boolean };
  word2: { word: string; clues: number; malus: boolean };
}

export interface RoundCompleteData {
  winner: { id: string; pseudo: string };
  cluesCount: number;
  requiredClues: number;
  canMalus: boolean;
  word: string;
  currentPlayer: { id: string; pseudo: string };
  perfect: boolean;
  malusApplied?: boolean;
  message?: string;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createRoom = async (pseudo: string) => {
  const response = await apiClient.post("/game/create-room/", { pseudo });
  return response.data;
};

export async function joinRoom(pseudo: string, roomCode: string) {
  const response = await apiClient.post("/game/join-room/", {
    pseudo,
    room_code: roomCode,
  });
  return response.data;
}
