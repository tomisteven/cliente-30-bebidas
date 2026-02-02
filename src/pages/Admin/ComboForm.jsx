import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCombo, updateCombo, getComboById } from '../../api/combo.api';
import { getProducts } from '../../api/product.api';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';
import styles from '../Admin/ProductForm.module.css'; // Reuso los estilos

const ComboForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const isEditing = !!id;

    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        products: [],
        discountPercentage: 0,
        isActive: true
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const prodData = await getProducts({ limit: 1000 }); // Cargamos todos para la selección
                setProducts(prodData.products || []);

                if (isEditing) {
                    const comboData = await getComboById(id);
                    setFormData({
                        ...comboData,
                        products: comboData.products.map(p => ({
                            product: p.product._id || p.product,
                            quantity: p.quantity
                        }))
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchInitialData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...formData.products];
        newProducts[index][field] = value;
        setFormData(prev => ({ ...prev, products: newProducts }));
    };

    const addProductToCombo = () => {
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, { product: '', quantity: 1 }]
        }));
    };

    const removeProductFromCombo = (index) => {
        const newProducts = formData.products.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, products: newProducts }));
    };

    const calculateTotals = () => {
        let basePrice = 0;
        formData.products.forEach(p => {
            const product = products.find(prod => prod._id === p.product);
            if (product) {
                basePrice += (product.precio * p.quantity);
            }
        });

        const discount = Number(formData.discountPercentage) || 0;
        const finalPrice = basePrice * (1 - discount / 100);

        return { basePrice, finalPrice };
    };

    const { basePrice, finalPrice } = calculateTotals();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                discountPercentage: Number(formData.discountPercentage),
                products: formData.products.map(p => ({
                    product: p.product,
                    quantity: Number(p.quantity)
                }))
            };

            if (isEditing) {
                await updateCombo(id, payload);
                showNotification('Combo actualizado correctamente');
            } else {
                await createCombo(payload);
                showNotification('Combo creado correctamente');
            }
            navigate('/admin');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error al guardar combo', 'error');
        }
    };

    return (
        <div className={styles.page}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <button onClick={() => navigate('/admin')} className={styles.backBtn}>
                    <FiArrowLeft /> Volver al Dashboard
                </button>

                <h1 className={styles.title}>{isEditing ? 'Editar Combo' : 'Crear Nuevo Combo'}</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Información del Combo</h2>
                        <p className={styles.infoText}>Los precios de los productos seleccionados están en USD. El descuento se aplica sobre el total en dólares.</p>
                        <div className={styles.grid}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Nombre del Combo</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Descripción</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Descuento (%)</label>
                                <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id="isActive" />
                                <label htmlFor="isActive" style={{ margin: 0 }}>Combo Activo</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Productos Incluidos</h2>
                            <button type="button" onClick={addProductToCombo} className={styles.addBtn}>
                                <FiPlus /> Producto
                            </button>
                        </div>
                        {formData.products.map((p, index) => (
                            <div key={index} className={styles.comboProductRow}>
                                <div className={`${styles.formGroup} ${styles.productSelectGroup}`}>
                                    <label>Seleccionar Producto</label>
                                    <select
                                        value={p.product}
                                        onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Elige un producto --</option>
                                        {products.map(prod => (
                                            <option key={prod._id} value={prod._id}>
                                                {prod.nombre} ({prod.stock} disp.)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={`${styles.formGroup} ${styles.quantityGroup}`}>
                                    <label>Cantidad</label>
                                    <input
                                        type="number" value={p.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                        required min="1"
                                    />
                                </div>
                                <div className={styles.removeActionGroup}>
                                    <button type="button" onClick={() => removeProductFromCombo(index)} className={styles.removeBtn}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.section} style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent)' }}>
                        <h2 className={styles.sectionTitle}>Resumen de Precios</h2>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Precio Base Total (USD)</label>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {basePrice.toFixed(2)} USD
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Precio Final con {formData.discountPercentage}% desc. (USD)</label>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                                    {finalPrice.toFixed(2)} USD
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="premium-btn" style={{ width: '100%', marginTop: '2rem' }}>
                        {isEditing ? 'Actualizar Combo' : 'Crear Combo'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ComboForm;
