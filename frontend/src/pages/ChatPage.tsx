import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { io, Socket } from 'socket.io-client';

type Message = {
  id: number;
  content: string;
  createdAt: string;
  imageUrl?: string;
  gameUrl?: string;
  sender: {
    id: number;
    username: string;
  };
};

export default function ChatPage() {
  const { roomId } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const response = await api.get(`/messages/room/${roomId}`);
      setMessages(response.data);
    };

    loadMessages();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const username =
      localStorage.getItem('username') ?? 'Usuario';

    const newSocket = io('http://localhost:3000');

    socketRef.current = newSocket;

    newSocket.emit('join_room', {
      roomId: Number(roomId),
      username,
    });

    newSocket.on('new_message', (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    newSocket.on('active_users', (data: { count: number; users: string[] }) => {
      setActiveUsers(data.users);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');

    if (
      !socketRef.current ||
      !message.trim() ||
      !roomId ||
      !userId
    ) {
      return;
    }

    socketRef.current.emit('send_message', {
      roomId: Number(roomId),
      message,
      senderId: Number(userId),
    });

    setMessage('');
  };

  return (
  <main className="page chat-page">
    <section className="chat-shell">
      <aside className="chat-sidebar card">
        <h2>GameHub</h2>

        <p className="muted">
          Sala #{roomId}
        </p>

        <div className="active-box">
          <strong>
            Usuarios activos: {activeUsers.length}
          </strong>

          <ul>
            {activeUsers.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
        </div>

        <p className="muted">
          Usa <strong>!bot buscar elden ring</strong>
        </p>
      </aside>

      <section className="chat-panel card">
        <header className="chat-header">
          <div>
            <p className="muted">Chat en vivo</p>
            <h1>Sala de juego</h1>
          </div>
        </header>

        <div className="messages-box">
          {messages.map((msg) => {
  const currentUsername =
    localStorage.getItem('username');

  const isMine =
    msg.sender.username === currentUsername;

  const isBot =
    msg.sender.username === 'GameBot';

    

  return (
    <div
      key={msg.id}
      className={
        isBot
          ? 'message-row bot'
          : isMine
            ? 'message-row mine'
            : 'message-row other'
      }
    >
      <div className="message-bubble">
  <strong>{msg.sender.username}</strong>

  {msg.imageUrl && (
    <img
      className="bot-game-image"
      src={msg.imageUrl}
      alt="Juego recomendado"
    />
  )}

  <p>{msg.content}</p>

  {msg.gameUrl && (
    <a
      className="bot-link"
      href={msg.gameUrl}
      target="_blank"
      rel="noreferrer"
    >
      Ver información completa
    </a>
  )}
</div>
    </div>
  );
})}
        </div>

        <form
          className="message-form"
          onSubmit={sendMessage}
        >
          <input
            className="input"
            type="text"
            placeholder="Escribe un mensaje o usa !bot buscar..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <button
            className="button"
            type="submit"
          >
            Enviar
          </button>
        </form>
      </section>
    </section>
  </main>
);
}