import { useState } from "react";
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';


export default function LoginPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const handleSubmit = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        try{
            const response = await api.post(
                '/auth/login',
                {
                    email,
                    password
                },
            );

            console.log(response.data);

            console.log(response.data);

            const token = response.data.access_token;
            const user = response.data.user;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', user.id.toString());
            localStorage.setItem('username', user.username);

            navigate('/rooms');
            
        } catch (error){
            console.error(error);
            
        }
        
        
    }
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post('/auth/register', {
            username,
            email,
            password,
            });

            setIsRegistering(false);
        } catch (error) {
            console.error(error);
        }
        };

    return (
  <main className="login-layout">
    <section className="login-hero">
      <p className="eyebrow">Realtime Gaming Platform</p>
      <h1>GameHub</h1>
      <p>
        Encuentra juegos, entra a salas públicas y conversa en tiempo real.
      </p>
    </section>

    <section
      className={
        isRegistering
          ? 'auth-split register-active'
          : 'auth-split login-active'
      }
    >
      <section className="auth-card-panel login-panel"
                onClick={() => isRegistering && setIsRegistering(false)}>
        <h2>Bienvenido</h2>
        <p>Ingresa para continuar</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Ingresar</button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
          >
            Regístrate
          </button>
        </p>

      </section>

      <section className="auth-card-panel register-panel"
                onClick={() => !isRegistering && setIsRegistering(true)}>
        <h2>Crear cuenta</h2>
        <p>Elige tu username gamer</p>

        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Crear cuenta</button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
          >
            Inicia sesión
          </button>
        </p>

      </section>
    </section>
  </main>
);
}