import axios from "axios";

export interface Player {
  id: string;
  pseudo: string;
  is_owner: boolean;
  score: number;
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
