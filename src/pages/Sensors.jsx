import React, { useState, useEffect } from 'react';

const sensorTypeOptions = [
    { value: 0, label: 'Temperature' },
    { value: 1, label: 'Humidity' },
    { value: 2, label: 'Gas' },
    { value: 3, label: 'Motion' },
    { value: 4, label: 'Other' }
];

const SensorsPage = () => {
    const [sensors, setSensors] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [editingSensor, setEditingSensor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 0,       // число, а не рядок
        zoneId: ''
    });

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);

                const [sensorRes, zoneRes] = await Promise.all([
                    fetch(`https://localhost:7226/api/sensors`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`https://localhost:7226/api/zones`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (!sensorRes.ok || !zoneRes.ok) throw new Error('Помилка завантаження даних');

                const sensorData = await sensorRes.json();
                const zoneData = await zoneRes.json();

                // Прив'язка zone об'єкта для кожного сенсора:
                const sensorsWithZone = sensorData.map(sensor => ({
                    ...sensor,
                    zone: zoneData.find(z => z.id === sensor.zoneId)
                }));

                setSensors(sensorsWithZone);
                setZones(zoneData);

                // Якщо відкриваємо створення і zoneId пустий, встановлюємо першу зону
                if (!formData.zoneId && zoneData.length > 0) {
                    setFormData(prev => ({ ...prev, zoneId: zoneData[0].id }));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [token]);

    const openCreateModal = () => {
        setEditingSensor(null);
        setFormData({ name: '', type: 0, zoneId: zones[0]?.id || '' });
        setModalVisible(true);
        setError('');
    };

    const openEditModal = (sensor) => {
        setEditingSensor(sensor);
        setFormData({
            name: sensor.name,
            type: sensor.type,       // вже число
            zoneId: sensor.zoneId
        });
        setModalVisible(true);
        setError('');
    };

    const closeModal = () => {
        setModalVisible(false);
        setError('');
    };

    const handleFormChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'type' || name === 'zoneId') ? parseInt(value, 10) : value
        }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Видалити цей сканер?')) return;

        try {
            const res = await fetch(`https://localhost:7226/api/sensors/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Не вдалося видалити сканер');
            setSensors(sensors.filter(s => s.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || formData.type === undefined || !formData.zoneId) {
            setError('Будь ласка, заповніть усі поля.');
            return;
        }

        if (editingSensor) {
            await updateSensor();
        } else {
            await createSensor();
        }
    };

    const createSensor = async () => {
        try {
            const body = JSON.stringify({
                name: formData.name.trim(),
                type: formData.type,
                zoneId: formData.zoneId
            });

            const res = await fetch('https://localhost:7226/api/sensors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Помилка створення: ${errText}`);
            }

            const newSensor = await res.json();
            newSensor.zone = zones.find(z => z.id === newSensor.zoneId);

            setSensors([...sensors, newSensor]);
            closeModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const updateSensor = async () => {
        try {
            const res = await fetch(`https://localhost:7226/api/sensors/${editingSensor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: editingSensor.id,
                    name: formData.name.trim(),
                    type: formData.type,
                    zoneId: formData.zoneId
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Помилка оновлення: ${errorText}`);
            }

            const updatedSensor = await res.json();
            const zone = zones.find(z => z.id === updatedSensor.zoneId);
            updatedSensor.zone = zone;

            setSensors(sensors.map(s => (s.id === updatedSensor.id ? updatedSensor : s)));
            closeModal();
        } catch (err) {
            setError(err.message || 'Сталася помилка при оновленні сенсора');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Всі сканери</h2>

            <button className="btn btn-success mb-3" onClick={openCreateModal}>
                Додати сканер
            </button>

            {loading && <p>Завантаження...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && sensors.length === 0 && <p>Сканери відсутні</p>}

            {!loading && sensors.length > 0 && (
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>Назва</th>
                        <th>Тип</th>
                        <th>Зона</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sensors.map(sensor => (
                        <tr key={sensor.id}>
                            <td>{sensor.name}</td>
                            <td>{sensorTypeOptions.find(opt => opt.value === sensor.type)?.label || sensor.type}</td>
                            <td>{sensor.zone?.name || '—'}</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" onClick={() => openEditModal(sensor)}>
                                    Редагувати
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sensor.id)}>
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Модальне вікно */}
            {modalVisible && (
                <div className="modal show fade d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editingSensor ? 'Редагувати сканер' : 'Додати сканер'}</h5>
                                    <button type="button" className="btn-close" onClick={closeModal} />
                                </div>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="mb-3">
                                        <label className="form-label">Назва</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Тип</label>
                                        <select
                                            className="form-select"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleFormChange}
                                            required
                                        >
                                            {sensorTypeOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Зона</label>
                                        <select
                                            className="form-select"
                                            name="zoneId"
                                            value={formData.zoneId}
                                            onChange={handleFormChange}
                                            required
                                        >
                                            {zones.map(z => (
                                                <option key={z.id} value={z.id}>{z.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Закрити
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingSensor ? 'Зберегти' : 'Додати'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensorsPage;