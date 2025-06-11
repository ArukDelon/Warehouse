import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('https://localhost:7226/api/Auth/register', {
                username,
                password,
                role: 'user'
            });

            alert(response.data.message || 'Реєстрація успішна!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Помилка при реєстрації');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">📝 Реєстрація</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Ім'я користувача</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Введіть ім'я"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Придумайте пароль"
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button type="submit" className="btn btn-success w-100">Зареєструватися</button>
                </form>

                <div className="text-center mt-3">
                    <span>Вже маєте акаунт?</span>
                    <br />
                    <Link to="/login" className="btn btn-link">Увійти</Link>
                </div>
            </div>
        </div>
    );
}