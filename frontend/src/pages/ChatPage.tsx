import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { io, Socket } from 'socket.io-client';
import Navbar from '../components/Navbar';


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

type Room = {
  id: number;
  title: string;
  imageUrl?: string;
  type: 'GAME' | 'MOVIE';
};

export default function ChatPage() {
  const { roomId } = useParams();

  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [knownUsers, setKnownUsers] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const messagesBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const loadRoom = async () => {
      const response = await api.get(`/rooms/${roomId}`);
      setRoom(response.data);
    };

    loadRoom();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const loadMessages = async () => {
      const response = await api.get(`/messages/room/${roomId}`);
      setMessages(response.data);

      const users = response.data
        .map((msg: Message) => msg.sender.username)
        .filter((user: string) => user !== 'GameBot');

      setKnownUsers(Array.from(new Set(users)));
    };

    loadMessages();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const username = localStorage.getItem('username') ?? 'Usuario';
    const newSocket = io('http://localhost:3000');

    socketRef.current = newSocket;

    newSocket.emit('join_room', {
      roomId: Number(roomId),
      username,
    });

    newSocket.on('new_message', (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);

      if (newMessage.sender.username !== 'GameBot') {
        setKnownUsers((prev) =>
          Array.from(
            new Set([...prev, newMessage.sender.username]),
          ),
        );
      }
    });

    newSocket.on('active_users', (data: { count: number; users: string[] }) => {
      setActiveUsers(data.users);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    const box = messagesBoxRef.current;

    if (!box) return;

    box.scrollTop = box.scrollHeight;
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');

    if (!socketRef.current || !message.trim() || !roomId || !userId) {
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
    <>
    <Navbar />
    <main className="chat-layout">
      <aside className="chat-room-panel">
        <button
          className="back-button"
          type="button"
          onClick={() => window.history.back()}
        >
          ← Volver
        </button>

        <div className="room-preview">
          {room?.imageUrl && (
            <img src={room.imageUrl} alt={room.title} />
          )}

          <p className="eyebrow">Sala</p>
          <h1>{room?.title ?? `Sala #${roomId}`}</h1>
          <p>
            Chat público en tiempo real para conversar sobre este juego.
          </p>
        </div>

        <div className="members-panel">
          <h3>Integrantes</h3>

          {[...new Set([...knownUsers, ...activeUsers])].map((user) => {
            const isActive = activeUsers.includes(user);

            return (
              <div className="member-row" key={user}>
                <span
                  className={
                    isActive
                      ? 'member-dot active'
                      : 'member-dot inactive'
                  }
                />
                <span>{user}</span>
              </div>
            );
          })}
        </div>

        <div className="bot-hint">
          <strong>GameBot</strong>
          <p>Prueba: !bot buscar elden ring</p>
        </div>
      </aside>

      <section className="chat-main-panel">
        <header className="chat-topbar">
          <div>
            <p className="eyebrow">Chat en vivo</p>
            <h2>{room?.title ?? 'Sala de juego'}</h2>
          </div>

          <span>{activeUsers.length} activos</span>
        </header>

        <div
          className="messages-box aesthetic-messages"
          ref={messagesBoxRef}
        >
  {messages.map((msg) => {
    const currentUsername = localStorage.getItem('username');
    const isMine = msg.sender.username === currentUsername;
    const isBot = msg.sender.username === 'GameBot';

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

        <form className="chat-input-bar" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit">➜</button>
        </form>
      </section>
    </main>
    </>
  );
}