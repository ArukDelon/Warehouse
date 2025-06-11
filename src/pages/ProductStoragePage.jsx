import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductStoragePage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        zoneId: '',
        quantity: 0,
        storedSince: new Date().toISOString().substring(0, 10)
    });
    const [editingItem, setEditingItem] = useState(null);
    const [products, setProducts] = useState([]);
    const [zones, setZones] = useState([]);

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchData();
        fetchProducts();
        fetchZones();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://localhost:7226/api/ProductStorage', authHeader);
            setItems(response.data);
        } catch (err) {
            setError('Помилка при завантаженні даних складу', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        const res = await axios.get('https://localhost:7226/api/Products', authHeader);
        setProducts(res.data);
    };

    const fetchZones = async () => {
        const res = await axios.get('https://localhost:7226/api/Zones', authHeader);
        setZones(res.data);
    };

    const openCreateModal = () => {
        setFormData({
            productId: '',
            zoneId: '',
            quantity: 0,
            storedSince: new Date().toISOString().substring(0, 10)
        });
        setEditingItem(null);
        setModalVisible(true);
    };

    const openEditModal = (item) => {
        setFormData({
            productId: item.productId,
            zoneId: item.zoneId,
            quantity: item.quantity,
            storedSince: item.storedSince.substring(0, 10)
        });
        setEditingItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setError('');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axios.put(`https://localhost:7226/api/ProductStorage/${editingItem.id}`, formData, authHeader);
            } else {
                await axios.post('https://localhost:7226/api/ProductStorage', formData, authHeader);
            }
            closeModal();
            fetchData();
        } catch (err) {
            setError('Помилка при збереженні даних',err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви дійсно хочете видалити цей запис?')) {
            await axios.delete(`https://localhost:7226/api/ProductStorage/${id}`, authHeader);
            fetchData();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Склад продуктів</h2>

            <button className="btn btn-success mb-3" onClick={openCreateModal}>
                Додати запис
            </button>

            {loading && <p>Завантаження...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && items.length === 0 && <p>Записів немає</p>}

            {!loading && items.length > 0 && (
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>Продукт</th>
                        <th>Зона</th>
                        <th>Кількість</th>
                        <th>Зберігається з</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.productName}</td>
                            <td>{item.zoneName}</td>
                            <td>{item.quantity}</td>
                            <td>{new Date(item.storedSince).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" onClick={() => openEditModal(item)}>Редагувати</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Видалити</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {modalVisible && (
                <div className="modal show fade d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editingItem ? 'Редагувати запис' : 'Додати запис'}</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="mb-3">
                                        <label className="form-label">Продукт</label>
                                        <select className="form-select" name="productId" value={formData.productId} onChange={handleFormChange} required>
                                            <option value="">Оберіть продукт</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Зона</label>
                                        <select className="form-select" name="zoneId" value={formData.zoneId} onChange={handleFormChange} required>
                                            <option value="">Оберіть зону</option>
                                            {zones.map(z => (
                                                <option key={z.id} value={z.id}>{z.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Кількість</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Зберігається з</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="storedSince"
                                            value={formData.storedSince}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Закрити</button>
                                    <button type="submit" className="btn btn-primary">{editingItem ? 'Зберегти' : 'Додати'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductStoragePage;