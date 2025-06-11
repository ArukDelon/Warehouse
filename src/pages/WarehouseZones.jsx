import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import GaugeChartWithNeedle from '../components/GaugeChartWithNeedle.jsx';



const WarehouseZones = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        maxVolume: '',
        maxWeight: ''
    });

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    useEffect(() => {
        if (!token) {
            setError('Не вказано токен');
            setLoading(false);
            return;
        }

        const fetchZones = async () => {
            try {
                const res = await fetch(`https://localhost:7226/api/zones/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Помилка завантаження зон');
                const data = await res.json();
                setZones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchZones();
    }, [token]);

    const handleCreate = async () => {
        try {
            const res = await fetch(`https://localhost:7226/api/zones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    maxVolume: parseFloat(formData.maxVolume),
                    maxWeight: parseFloat(formData.maxWeight)
                })
            });

            if (!res.ok) throw new Error('Не вдалося створити зону');

            const newZone = await res.json();
            setZones([...zones, { ...newZone, usedVolume: 0, usedWeight: 0 }]);
            setShowModal(false);
            setFormData({ name: '', maxVolume: '', maxWeight: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <div>
            <h2>Zones</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-4">
                {zones.map((zone) => {
                    const volumePercent = zone.maxVolume > 0
                        ? Math.round((zone.usedVolume / zone.maxVolume) * 100)
                        : 0;
                    const weightPercent = zone.maxWeight > 0
                        ? Math.round((zone.usedWeight / zone.maxWeight) * 100)
                        : 0;

                    return (
                        <Col md={4} key={zone.id}>
                            <Card className="shadow-sm h-100">
                                <Card.Body>
                                    <Card.Title className="mb-3">{zone.name}</Card.Title>
                                    <Row>
                                        <Col xs={6}>
                                            <GaugeChartWithNeedle value={volumePercent} label="Volume" />
                                            <div className="text-muted text-center">
                                                {zone.usedVolume} / {zone.maxVolume} м³
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <GaugeChartWithNeedle value={weightPercent} label="Weight" />
                                            <div className="text-muted text-center">
                                                {zone.usedWeight} / {zone.maxWeight} кг
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="mt-3 text-muted text-center">
                                        Temp: ~23°C
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}

                <Col md={4}>
                    <Card className="text-center ">
                        <Card.Body>
                            <Button variant="outline-primary" onClick={() => setShowModal(true)}>
                                + ADD NEW ZONE
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal для створення */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Нова зона</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Назва зони</Form.Label>
                            <Form.Control
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Макс. обʼєм (м³)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.maxVolume}
                                onChange={(e) => setFormData({ ...formData, maxVolume: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Макс. вага (кг)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.maxWeight}
                                onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Скасувати</Button>
                    <Button variant="primary" onClick={handleCreate}>Створити</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WarehouseZones;