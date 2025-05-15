import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Nettoyer le sessionStorage lors de l'arrivée sur la home
    sessionStorage.clear();

    return () => {
      // Cleanup si nécessaire
    };
  }, []);

  const handleCreateRoom = () => {
    navigate("/create");
  };

  const handleJoinRoom = () => {
    navigate("/join");
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans flex flex-col">
      <header className="text-center py-10">
        <img
          src="/Maudit_mot_dit_logo.png"
          alt="Logo Maudit Mot Dit"
          className="mx-auto w-32 h-32 mb-4"
        />
        <h1 className="text-5xl font-bold mb-4 text-primary drop-shadow-lg">
          Maudit Mot Dit
        </h1>
        <p className="text-lg italic tracking-wide text-secondary">
          Retrouvez le bon mot... au bon moment !
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <section className="max-w-3xl text-center mb-12">
          <p className="text-xl mb-6">
            Bienvenue dans la version en ligne du jeu ! Trouvez les bons mots,
            coopérez ou déjouez vos amis, et devenez le maître des clés
            mystiques.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={handleCreateRoom}
              className="bg-primary text-background font-bold px-6 py-3 rounded-full hover:bg-accent hover:cursor-pointer transition-all"
            >
              Créer une partie
            </button>
            <button
              onClick={handleJoinRoom}
              className="bg-primary text-background font-bold px-6 py-3 rounded-full hover:bg-accent hover:cursor-pointer transition-all"
            >
              Rejoindre une partie
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16 w-full max-w-6xl px-4">
          <div className="bg-secondary text-background p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl mb-2">🎮 3 à 6 joueurs</h3>
            <p>
              Invitez vos amis pour une partie en ligne rapide et pleine de
              rebondissements.
            </p>
          </div>
          <div className="bg-secondary text-background p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl mb-2">🔮 Ambiance mystique</h3>
            <p>
              Retrouvez l’univers graphique de la boîte physique, mais en ligne
              !
            </p>
          </div>
          <div className="bg-secondary text-background p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl mb-2">👥 Aucun compte requis</h3>
            <p>Un pseudo temporaire suffit pour jouer. Rejoignez en un clic.</p>
          </div>
        </section>

        <section className="bg-secondary text-background p-8 rounded-xl shadow-xl max-w-4xl mb-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            🧾 Règles du jeu
          </h2>
          <p className="text-justify mb-4">
            Au début d'une manche, un joueur est désigné pour choisir entre 2
            mots lequel il fera deviner. À chaque mot est associé un nombre
            d'indices. L'objectif du joueur est que le mot soit trouvé en
            utilisant exactement ce nombre d'indices. Une fois choisi, il donne
            son premier indice et tous les autres joueurs doivent faire une
            proposition. Ceci jusqu'à ce que tous les indices soient donnés.
          </p>
          <p className="mb-4">La manche prend fin :</p>
          <ul className="list-disc list-inside mb-4">
            <li>
              Si le mot est trouvé avec le nombre d'indices indiqués, dans ce
              cas le joueur ayant deviné et le joueur faisant deviner gagnent
              autant de points que d'indices.
            </li>
            <li>
              Si le mot est trouvé avant, seul le joueur ayant deviné gagne
              autant de points que d'indices donnés.
            </li>
            <li>
              Si une fois tous les indices donnés, le mot n'est pas trouvé,
              alors personne ne gagne de points.
            </li>
          </ul>
          <p>
            Une fois un mot proposé par un joueur, il n'est pas possible pour le
            joueur faisant deviner de s'en servir comme indice !
          </p>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-border text-sm">
        <p>&copy; 2025 Maudit Mot Dit - Jeu en ligne. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
