import { useState, useEffect } from 'react';
import { Button, Card, Container, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import axios from "axios";
import DashboardWidget from "../components/DashboardWidget.jsx";

const Dashboard = () => {
    const [warehouse, setWarehouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', location: '' });

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    useEffect(() => {
        const fetchWarehouse = async () => {
            try {
                const res = await fetch('https://localhost:7226/api/warehouses/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setWarehouse(data);
                } else if (res.status === 404) {
                    setWarehouse(null);
                } else {
                    throw new Error('Помилка завантаження складу');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchWarehouse();
        else window.location.href = '/login';
    }, [token]);

    const handleCreate = async () => {
        try {
            const res = await axios.post(
                'https://localhost:7226/api/warehouses',
                {
                    name: formData.name?.trim(),
                    location: formData.location?.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWarehouse(res.data);
            setShowModal(false);
            setFormData({ name: '', location: '' });
            setError('');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError(error.response.data.message || 'Некоректні дані складу');
                } else if (error.response.status === 409) {
                    setError('Склад для цього користувача вже існує.');
                } else if (error.response.status === 401) {
                    window.location.href = '/login';
                } else {
                    setError('Сталася невідома помилка');
                }
            } else {
                setError(error.message || 'Помилка запиту');
            }
        }
    };


    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}

            {warehouse ? (
                <DashboardWidget/>
            ) : (
                <div className="mt-4">
                    <Alert variant="info">У вас ще немає створеного складу.</Alert>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Створити склад
                    </Button>
                </div>
            )}

            {/* Модальне вікно створення складу */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Створення складу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Назва складу</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Введіть назву складу"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Розташування</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                placeholder="Введіть розташування складу"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>
                        Створити
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Dashboard;