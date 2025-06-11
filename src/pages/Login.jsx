import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7226/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: username, password}),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(errorText || 'Помилка при реєстрації');
            }

            const data = await response.json();
            login({username, token: data.token}); // або login(data), залежно від реалізації
            navigate('/');
        } catch (error) {
            alert('Невірні дані або сервер не відповідає');
            console.error(error);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">🔐 Вхід до Smart Warehouse</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="username"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Введіть username"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Введіть пароль"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Увійти</button>
                </form>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="text-center mt-3">
                    <span>Ще не маєте акаунту?</span>
                    <br />
                    <Link to="/register" className="btn btn-link">Зареєструватися</Link>
                </div>
            </div>
        </div>
    );
}