import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import supplierApi from '../../../api/supplier.api';
import {
    FiArrowLeft, FiPlus, FiSave, FiTrash2,
    FiClock, FiTag, FiBox, FiMessageCircle,
    FiDollarSign, FiHash, FiLayers,
    FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import styles from './SupplierDetail.module.css';

const SupplierDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [products, setProducts] = useState([]);
    const [expandedIndices, setExpandedIndices] = useState(new Set());

    const toggleExpand = (index) => {
        const newExpanded = new Set(expandedIndices);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedIndices(newExpanded);
    };

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await supplierApi.getById(id);
                setSupplier(response.data);
                setProducts(response.data.products || []);
            } catch (error) {
                console.error('Error fetching supplier:', error);
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
        // Expand the first item (the new one)
        setExpandedIndices(new Set([0]));
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
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
        // Clear expansion for removed index
        const newExpanded = new Set(expandedIndices);
        newExpanded.delete(index);
        setExpandedIndices(newExpanded);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await supplierApi.update(id, { products });
            // Notification or Alert? The previous code used alert
            alert('Lista de precios actualizada correctamente');
        } catch (error) {
            alert('Error al guardar cambios');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Sincronizando Lista de Precios...</p>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Professional Header */}
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <button className={styles.backBtn} onClick={() => navigate('/admin/proveedores')}>
                        <FiArrowLeft />
                    </button>
                    <div>
                        <span className={styles.subTitle}>Gestión de Proveedor</span>
                        <h2>{supplier.name}</h2>
                    </div>
                </div>
                <div className={styles.controls}>
                    <button className={styles.addBtn} onClick={handleAddProduct}>
                        <FiPlus /> Nueva Fila
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        <FiSave /> {saving ? 'Sincronizando...' : 'Guardar Todo'}
                    </button>
                </div>
            </header>

            {/* Products Grid */}
            <div className={styles.grid}>
                <AnimatePresence>
                    {products.map((product, idx) => {
                        const isExpanded = expandedIndices.has(idx);
                        return (
                            <motion.div
                                key={idx}
                                className={`${styles.productCard} ${isExpanded ? styles.expanded : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <div className={styles.accordionHeader} onClick={() => toggleExpand(idx)}>
                                    <div className={styles.headerInfoSimple}>
                                        <div className={styles.titleArea}>
                                            <span className={styles.productNameDisplay}>
                                                {product.name || 'Sin nombre'}
                                            </span>
                                            <span className={styles.categoryBadge}>
                                                {product.category || 'Sin categoría'}
                                            </span>
                                        </div>
                                        <div className={styles.priceSummary}>
                                            <span className={styles.summaryLabel}>U:</span>
                                            <span className={styles.summaryValue}>${product.price}</span>
                                            <span className={styles.summaryLabel}>P:</span>
                                            <span className={styles.summaryValue}>${product.pricePack}</span>
                                        </div>
                                    </div>
                                    <div className={styles.headerActions}>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveProduct(idx);
                                        }} className={styles.removeBtnSimple}>
                                            <FiTrash2 />
                                        </button>
                                        <div className={styles.chevron}>
                                            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className={styles.accordionBody}
                                        >
                                            <div className={styles.cardHeader}>
                                                <div className={styles.group}>
                                                    <label>Editar Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={product.name}
                                                        onChange={e => handleProductChange(idx, 'name', e.target.value)}
                                                        placeholder="Ej: Coca Cola 1.5L"
                                                        className={styles.nameInput}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.mainInfo}>
                                                <div className={styles.group}>
                                                    <label>Categoría</label>
                                                    <div className={styles.inputWrapper}>
                                                        <FiTag className={styles.icon} />
                                                        <input
                                                            type="text"
                                                            value={product.category}
                                                            onChange={e => handleProductChange(idx, 'category', e.target.value)}
                                                            placeholder="Gaseosas, Vinos, etc."
                                                            className={styles.input}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pricing Sections */}
                                            <div className={styles.pricingSection}>
                                                <span className={styles.sectionLabel}>Estructura de Costos</span>
                                                <div className={styles.pricingGrid}>
                                                    <div className={styles.priceItem}>
                                                        <label>$ Unidad</label>
                                                        <input
                                                            type="number"
                                                            value={product.price}
                                                            onChange={e => handleProductChange(idx, 'price', Number(e.target.value))}
                                                            className={styles.numberInput}
                                                        />
                                                    </div>
                                                    <div className={styles.priceItem}>
                                                        <label>$ Pack</label>
                                                        <input
                                                            type="number"
                                                            value={product.pricePack}
                                                            onChange={e => handleProductChange(idx, 'pricePack', Number(e.target.value))}
                                                            className={styles.numberInput}
                                                        />
                                                    </div>
                                                    <div className={styles.priceItem}>
                                                        <label>U. x Pack</label>
                                                        <input
                                                            type="number"
                                                            value={product.unitsPerPack}
                                                            onChange={e => handleProductChange(idx, 'unitsPerPack', Number(e.target.value))}
                                                            className={styles.numberInput}
                                                        />
                                                    </div>
                                                    <div className={styles.priceItem}>
                                                        <label>$ Pallet</label>
                                                        <input
                                                            type="number"
                                                            value={product.pricePallet}
                                                            onChange={e => handleProductChange(idx, 'pricePallet', Number(e.target.value))}
                                                            className={styles.numberInput}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Optional / Custom */}
                                            <div className={styles.customSection}>
                                                <div className={styles.pricingGrid}>
                                                    <div className={styles.priceItem}>
                                                        <label>$ Especial</label>
                                                        <input
                                                            type="number"
                                                            value={product.priceCustom}
                                                            onChange={e => handleProductChange(idx, 'priceCustom', Number(e.target.value))}
                                                            className={styles.numberInput}
                                                        />
                                                    </div>
                                                    <div className={styles.priceItem}>
                                                        <label>Cant. X</label>
                                                        <input
                                                            type="number"
                                                            value={product.customQuantity}
                                                            onChange={e => handleProductChange(idx, 'customQuantity', Number(e.target.value))}
                                                            className={styles.numberInput}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.group}>
                                                <label>Notas Internas</label>
                                                <div className={styles.inputWrapper}>
                                                    <FiMessageCircle className={styles.icon} />
                                                    <input
                                                        type="text"
                                                        value={product.comments}
                                                        onChange={e => handleProductChange(idx, 'comments', e.target.value)}
                                                        placeholder="Ej: Oferta válida hasta el lunes"
                                                        className={styles.input}
                                                    />
                                                </div>
                                            </div>

                                            <footer className={styles.cardFooter}>
                                                <div className={styles.lastUpdate}>
                                                    <FiClock /> Sincronizado: {new Date(product.lastUpdate).toLocaleDateString()}
                                                </div>
                                            </footer>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {products.length === 0 && (
                    <div className={styles.emptyState}>
                        <FiBox />
                        <p>No hay productos registrados para este proveedor.</p>
                        <button className={styles.addBtn} onClick={handleAddProduct}>
                            Crear Primer Producto
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierDetail;
