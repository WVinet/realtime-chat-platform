import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { io, Socket } from 'socket.io-client';

type Message = {
  id: number;
  content: string;
  createdAt: string;
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
    <div>
      <h1>Chat</h1>
      <p>Room ID: {roomId}</p>

      <p>Usuarios activos: {activeUsers.length}</p>

      <ul>
        {activeUsers.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>

      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender.username}</strong>
          <p>{message.content}</p>
        </div>
      ))}

      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}