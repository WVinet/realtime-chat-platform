import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

type Game = {
  id: number;
  name: string;
  background_image: string;
  rating: number;
};

export default function RoomsPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('');
  const [genre, setGenre] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  const response = await api.get('/games/search', {
    params: {
      query: search,
      platform,
      genre,
    },
  });

  setGames(response.data.results);
  setLoading(false);
};

  const enterRoom = async (
  game: Game,
) => {
  try {
    const response = await api.post(
      '/rooms',
      {
        externalId: game.id.toString(),
        title: game.name,
        type: 'GAME',
        imageUrl:
          game.background_image,
      },
    );

    const room = response.data;

    navigate(`/chat/${room.id}`);

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const loadGames = async () => {
      const response = await api.get('/games/popular');
      setGames(response.data.results);
    };

    loadGames();
  }, []);

  return (
  <>
  <Navbar />
  <main className="rooms-layout">
    <header className="rooms-header">
      <div>
        <p className="eyebrow">Realtime Gaming Platform</p>
        <h1>Explora juegos</h1>
        <p>
          Busca un juego, entra a su sala pública y conversa en tiempo real.
        </p>
      </div>
    </header>

    <section className="rooms-toolbar">
      <form className="rooms-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">Plataforma</option>
          <option value="4">PC</option>
          <option value="187">PlayStation 5</option>
          <option value="1">Xbox One</option>
          <option value="7">Nintendo Switch</option>
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Género</option>
          <option value="action">Action</option>
          <option value="role-playing-games-rpg">RPG</option>
          <option value="adventure">Adventure</option>
          <option value="shooter">Shooter</option>
        </select>

        <button type="submit">
          Buscar
        </button>
      </form>
    </section>

    {loading && (
      <p className="rooms-loading">
        Buscando juegos...
      </p>
    )}

    <section className="rooms-grid">
      {games.map((game) => (
        <article className="room-game-card" key={game.id}>
          <img
            src={game.background_image}
            alt={game.name}
          />

          <div className="room-game-body">
            <div>
              <p className="game-label">Game room</p>
              <h3>{game.name}</h3>
            </div>

            <p className="game-rating">
              ⭐ {game.rating}
            </p>

            <button onClick={() => enterRoom(game)}>
              Entrar al chat
            </button>
          </div>
        </article>
      ))}
    </section>
  </main>
  </>
);
}