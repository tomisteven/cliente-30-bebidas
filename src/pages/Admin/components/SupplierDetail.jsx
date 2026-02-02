import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supplierApi from '../../../api/supplier.api';
import { FiArrowLeft, FiPlus, FiSave, FiTrash2, FiClock, FiTag, FiBox, FiX } from 'react-icons/fi';
import styles from '../AdminDashboard.module.css';

const SupplierDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await supplierApi.getById(id);
                setSupplier(response.data);
                setProducts(response.data.products || []);
            } catch (error) {
                console.error('Error fetching supplier:', error);
                alert('No se pudo cargar la información del proveedor');
                navigate('/admin/proveedores');
            } finally {
                setLoading(false);
            }
        };
        fetchSupplier();
    }, [id, navigate]);

    const handleAddProduct = () => {
        const newProduct = {
            name: '',
            description: '',
            category: '',
            price: 0,
            pricePack: 0,
            unitsPerPack: 6,
            pricePallet: 0,
            unitsPerPallet: 0,
            priceCustom: 0,
            customQuantity: 0,
            comments: '',
            lastUpdate: new Date().toISOString()
        };
        setProducts([newProduct, ...products]);
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value,
            lastUpdate: new Date().toISOString()
        };
        setProducts(updatedProducts);
    };

    const handleRemoveProduct = (index) => {
        if (window.confirm('¿Eliminar este producto de la lista?')) {
            const updatedProducts = products.filter((_, i) => i !== index);
            setProducts(updatedProducts);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await supplierApi.update(id, { products });
            alert('Lista de precios actualizada correctamente');
        } catch (error) {
            alert('Error al guardar cambios');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loader}>Cargando lista de precios...</div>;

    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <button className="outline-btn" onClick={() => navigate('/admin/proveedores')} style={{ border: 'none', background: 'rgba(255,255,255,0.05)' }}>
                    <FiArrowLeft /> Panel
                </button>
                <div className={styles.headerInfo}>
                    <h2 style={{ margin: 0 }}>{supplier.name}</h2>
                    <span className={styles.dateLabel}>Módulo de Costos y Logística</span>
                </div>
                <div className={styles.actions}>
                    <button className="outline-btn" onClick={handleAddProduct}>
                        <FiPlus /> Nueva Fila
                    </button>
                    <button className="premium-btn" onClick={handleSave} disabled={saving}>
                        <FiSave /> {saving ? 'Guardando...' : 'Guardar Todo'}
                    </button>
                </div>
            </div>

            <div className={styles.excelContainer}>
                <div style={{ overflowX: 'auto' }}>
                    <table className={styles.excelTable}>
                        <thead>
                            <tr>
                                <th style={{ minWidth: '220px' }}>Producto / Descripción</th>
                                <th style={{ minWidth: '140px' }}>Categoría</th>
                                <th style={{ minWidth: '110px' }}>$ Unidad</th>
                                <th style={{ minWidth: '110px' }}>$ Pack</th>
                                <th style={{ minWidth: '70px' }}>U/Pk</th>
                                <th style={{ minWidth: '110px' }}>$ Pallet</th>
                                <th style={{ minWidth: '110px' }}>$ Especial</th>
                                <th style={{ minWidth: '70px' }}>Cant. X</th>
                                <th style={{ minWidth: '150px' }}>Notas Internas</th>
                                <th style={{ minWidth: '100px' }}>Actualizado</th>
                                <th style={{ width: '50px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            type="text"
                                            value={product.name}
                                            onChange={e => handleProductChange(idx, 'name', e.target.value)}
                                            placeholder="Ej: Coca Cola 1.5L"
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={product.category}
                                            onChange={e => handleProductChange(idx, 'category', e.target.value)}
                                            placeholder="..."
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.price}
                                            onChange={e => handleProductChange(idx, 'price', Number(e.target.value))}
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.pricePack}
                                            onChange={e => handleProductChange(idx, 'pricePack', Number(e.target.value))}
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.unitsPerPack}
                                            onChange={e => handleProductChange(idx, 'unitsPerPack', Number(e.target.value))}
                                            className={styles.excelInput}
                                            placeholder="6"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.pricePallet}
                                            onChange={e => handleProductChange(idx, 'pricePallet', Number(e.target.value))}
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.priceCustom}
                                            onChange={e => handleProductChange(idx, 'priceCustom', Number(e.target.value))}
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={product.customQuantity}
                                            onChange={e => handleProductChange(idx, 'customQuantity', Number(e.target.value))}
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={product.comments}
                                            onChange={e => handleProductChange(idx, 'comments', e.target.value)}
                                            placeholder="Ej: Oferta semanal"
                                            className={styles.excelInput}
                                        />
                                    </td>
                                    <td style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                        {new Date(product.lastUpdate).toLocaleDateString()}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => handleRemoveProduct(idx)} className={styles.deleteBtn} style={{ fontSize: '0.9rem' }}>
                                            <FiX />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <FiBox style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }} />
                        <p>No hay productos registrados para este proveedor.</p>
                        <button className="outline-btn" onClick={handleAddProduct} style={{ marginTop: '1rem' }}>
                            Comenzar ahora
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierDetail;
