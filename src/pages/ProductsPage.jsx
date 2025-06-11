import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        volumePerUnit: '',
        weightPerUnit: ''
    });

    // Завантаження продуктів
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://localhost:7226/api/products');
                setProducts(response.data);
            } catch (err) {
                setError('Помилка при завантаженні продуктів',err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', sku: '', volumePerUnit: '', weightPerUnit: '' });
        setModalVisible(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            sku: product.sku,
            volumePerUnit: product.volumePerUnit,
            weightPerUnit: product.weightPerUnit
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setError('');
    };

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axios.put(`https://localhost:7226/api/products/${editingProduct.id}`, formData);
            } else {
                await axios.post('https://localhost:7226/api/products', formData);
            }
            const response = await axios.get('https://localhost:7226/api/products');
            setProducts(response.data);
            closeModal();
        } catch (err) {
            setError('Помилка при збереженні продукту',err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити продукт?')) return;
        try {
            await axios.delete(`https://localhost:7226/api/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            setError('Помилка при видаленні продукту',err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Список продуктів</h2>

            <button className="btn btn-success mb-3" onClick={openCreateModal}>
                Додати продукт
            </button>

            {loading && <p>Завантаження...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && products.length === 0 && <p>Продукти відсутні</p>}

            {!loading && Array.isArray(products) && products.length > 0 && (
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>Назва</th>
                        <th>SKU</th>
                        <th>Обʼєм (од.)</th>
                        <th>Вага (од.)</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.sku}</td>
                            <td>{product.volumePerUnit}</td>
                            <td>{product.weightPerUnit}</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" onClick={() => openEditModal(product)}>
                                    Редагувати
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>
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
                                    <h5 className="modal-title">
                                        {editingProduct ? 'Редагувати продукт' : 'Додати продукт'}
                                    </h5>
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
                                        <label className="form-label">SKU</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Обʼєм (од.)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            name="volumePerUnit"
                                            value={formData.volumePerUnit}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Вага (од.)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            name="weightPerUnit"
                                            value={formData.weightPerUnit}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Закрити
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingProduct ? 'Зберегти' : 'Додати'}
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

export default ProductsPage;
