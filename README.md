# 💻 Maudit Mot Dit - Frontend

Frontend minimal en **React + TypeScript** avec **Vite** et **Tailwind CSS**. Utilise **Axios** pour la communication avec l’API Django.

---

## 🔧 Installation

1. Place-toi dans le dossier `frontend/`
2. Installe les dépendances :
   ```bash
   npm install
   ```

---

## 🌍 Configuration

Créer un fichier `.env` avec la variable d’environnement pour l’URL de l’API :

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Lancement du projet

```bash
npm run dev
```

L’application sera disponible sur `http://localhost:5173`

---

## 📡 Appels API

Les appels à l’API sont centralisés dans `services/apiServices.ts` :

```ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## 🎨 Stack

- React
- TypeScript
- Vite
- TailwindCSS
- Axios

---

## ⚡ WebSockets

Connexion à l’endpoint WebSocket :

```ts
const socket = new WebSocket("ws://localhost:8000/ws/game/<room_code>/")
```

---

## ✅ Fonctionnalités

- Création et jointure de rooms via l’API
- Communication WebSocket en live
- Interface stylisée avec Tailwind
