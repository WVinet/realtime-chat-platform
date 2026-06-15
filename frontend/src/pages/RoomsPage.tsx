import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const response = await api.get('/games/search', {
      params: {
        query: search,
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
  <main className="page">
    <h1>GameHub</h1>

    <form
      className="search-form"
      onSubmit={handleSearch}
    >
      <input
        className="input"
        type="text"
        placeholder="Buscar juego..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        className="button"
        type="submit"
      >
        Buscar
      </button>
    </form>

    {loading && (
      <p className="muted">
        Buscando...
      </p>
    )}

    <div className="games-grid">
      {games.map((game) => (
        <div
          className="game-card"
          key={game.id}
        >
          <img
            className="game-image"
            src={game.background_image}
            alt={game.name}
          />

          <div className="game-content">
            <h3>{game.name}</h3>

            <p className="muted">
              ⭐ {game.rating}
            </p>

            <button
              className="button"
              onClick={() => enterRoom(game)}
            >
              Entrar al chat
            </button>
          </div>
        </div>
      ))}
    </div>
  </main>
);
}