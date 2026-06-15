import { useState } from "react";
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';


export default function LoginPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    return <div>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                placeholder="Correo"
                value= {email}
                onChange={(e) => setEmail(e.target.value)} />
            <input 
            type="password" 
            placeholder="Contraseña"
            value= {password}
            onChange={(e) => setPassword(e.target.value)} />
            <button type="submit"> Ingresar  </button>
        </form>
    </div>
}