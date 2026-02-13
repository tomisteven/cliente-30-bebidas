import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createProduct, updateProduct, getProductBySlug, getCategories, createCategory } from '../../api/product.api';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiRefreshCw, FiCheck, FiX, FiBox, FiPackage, FiTruck } from 'react-icons/fi';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useNotification } from '../../context/NotificationContext';
import styles from './ProductForm.module.css';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { showNotification } = useNotification();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        _id: '',
        nombre: '',
        sku: '',
        descripcion: '',
        precio: '',
        unidadesPorPack: '',
        precioUnidad: '',
        precioPallet: '',
        packsPorPallet: '',
        precioCosto: '',
        precioCard: '',
        stock: 0,
        categoria: '',
        imagenes: [''],
        bulkPrices: [],
        isExclusive: false,
        precioExclusivo: '',
        isActive: true,
    });

    const [categories, setCategories] = useState([]);
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEditing) {
            const fetchProduct = async () => {
                try {
                    const data = await getProductBySlug(id); // id aqui es el slug
                    setFormData({
                        ...data,
                        precio: data.precio.toString(),
                        unidadesPorPack: data.unidadesPorPack?.toString() || '',
                        precioUnidad: data.precioUnidad?.toString() || '',
                        precioPallet: data.precioPallet?.toString() || '',
                        packsPorPallet: data.packsPorPallet?.toString() || '',
                        precioCosto: data.precioCosto?.toString() || '',
                        precioCard: data.precioCard?.toString() || '',
                        imagenes: data.imagenes.length > 0 ? data.imagenes : [''],
                        isExclusive: data.isExclusive || false,
                        isActive: data.isActive !== false,
                        precioExclusivo: data.precioExclusivo?.toString() || '',
                        bulkPrices: data.bulkPrices || []
                    });
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };
            fetchProduct();
        } else {
            // Check for pre-filled name in query params
            const params = new URLSearchParams(location.search);
            const prefilledName = params.get('nombre');
            if (prefilledName) {
                setFormData(prev => ({ ...prev, nombre: prefilledName }));
            }
        }
    }, [id, isEditing, location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBulkPriceChange = (index, field, value) => {
        const newBulkPrices = [...formData.bulkPrices];
        newBulkPrices[index][field] = value;
        setFormData(prev => ({ ...prev, bulkPrices: newBulkPrices }));
    };

    const handleStockClick = (delta) => {
        setFormData(prev => ({
            ...prev,
            stock: Math.max(0, (parseInt(prev.stock) || 0) + delta)
        }));
    };

    const addBulkPrice = () => {
        setFormData(prev => ({
            ...prev,
            bulkPrices: [...prev.bulkPrices, { minQuantity: '', price: '' }]
        }));
    };

    const removeBulkPrice = (index) => {
        const newBulkPrices = formData.bulkPrices.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, bulkPrices: newBulkPrices }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.imagenes];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, imagenes: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ''] }));
    };

    const removeImageField = (index) => {
        const newImages = formData.imagenes.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, imagenes: newImages.length > 0 ? newImages : [''] }));
    };

    const generateSku = () => {
        if (!formData.nombre) {
            alert('Por favor, ingresa el nombre del producto primero.');
            return;
        }

        // Limpiar el nombre: mayúsculas, quitar espacios y caracteres especiales
        const cleanName = formData.nombre
            .toUpperCase()
            .trim()
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 4);

        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const newSku = `${cleanName}-${randomNumber}`;

        setFormData(prev => ({ ...prev, sku: newSku }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Limpiar y validar bulkPrices antes de enviar
            const cleanedBulkPrices = formData.bulkPrices
                .filter(bp => bp.minQuantity && bp.price && Number(bp.minQuantity) > 0)
                .map(bp => ({
                    minQuantity: Number(bp.minQuantity),
                    price: Number(bp.price)
                }));

            const payload = {
                ...formData,
                precio: Number(formData.precio),
                unidadesPorPack: Number(formData.unidadesPorPack) || 1,
                precioUnidad: formData.precioUnidad ? Number(formData.precioUnidad) : 0,
                precioPallet: formData.precioPallet ? Number(formData.precioPallet) : 0,
                packsPorPallet: Number(formData.packsPorPallet) || 1,
                precioCosto: formData.precioCosto ? Number(formData.precioCosto) : 0,
                precioCard: Number(formData.precioCard),
                stock: Number(formData.stock),
                imagenes: formData.imagenes.filter(img => img.trim() !== ''),
                bulkPrices: cleanedBulkPrices,
                isExclusive: formData.isExclusive,
                isActive: formData.isActive,
                precioExclusivo: formData.precioExclusivo ? Number(formData.precioExclusivo) : null,
            };

            if (isEditing) {
                // Usar el _id real para la actualización, no el slug
                await updateProduct(formData._id, payload);
                showNotification('Producto actualizado correctamente');
            } else {
                // Eliminar el _id vacío antes de crear para evitar errores de validación en MongoDB
                const { _id, ...createPayload } = payload;
                await createProduct(createPayload);
                showNotification('Producto creado correctamente');
            }
            navigate('/admin');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error al guardar producto', 'error');
        }
    };

    return (
        <div className={styles.page}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <button onClick={() => navigate('/admin')} className={styles.backBtn}>
                    <FiArrowLeft /> Volver al Dashboard
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className={styles.title} style={{ marginBottom: 0 }}>{isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>

                    <label className={`${styles.statusToggle} ${formData.isActive ? styles.statusToggleActive : ''}`}>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <span>
                            {formData.isActive ? 'Producto ACTIVO' : 'Producto PAUSADO'}
                        </span>
                    </label>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Información Básica</h2>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Nombre del Producto</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>SKU (Código)</label>
                                <div className={styles.inputWithAction}>
                                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
                                    <button
                                        type="button"
                                        onClick={generateSku}
                                        className={styles.actionBtn}
                                        title="Generar SKU automático"
                                    >
                                        <FiRefreshCw />
                                    </button>
                                </div>
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Descripción</label>
                                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Categoría</label>
                                {isAddingNewCategory ? (
                                    <div className={styles.newCategoryWrapper}>
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Nombre de la nueva categoría"
                                            autoFocus
                                        />
                                        <div className={styles.newCategoryActions}>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (!newCategoryName.trim()) {
                                                        showNotification('Ingresa un nombre para la categoría', 'error');
                                                        return;
                                                    }
                                                    try {
                                                        const result = await createCategory(newCategoryName.trim());
                                                        setCategories(prev => [...prev, result.categoria]);
                                                        setFormData(prev => ({ ...prev, categoria: result.categoria }));
                                                        setNewCategoryName('');
                                                        setIsAddingNewCategory(false);
                                                        showNotification('Categoría agregada correctamente');
                                                    } catch (error) {
                                                        if (error.response?.status === 409) {
                                                            // La categoría ya existe, usarla
                                                            setFormData(prev => ({ ...prev, categoria: error.response.data.categoria }));
                                                            setNewCategoryName('');
                                                            setIsAddingNewCategory(false);
                                                            showNotification('Categoría existente seleccionada');
                                                        } else {
                                                            showNotification(error.response?.data?.message || 'Error al crear categoría', 'error');
                                                        }
                                                    }
                                                }}
                                                className={styles.confirmCategoryBtn}
                                                title="Confirmar nueva categoría"
                                            >
                                                <FiCheck />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewCategoryName('');
                                                    setIsAddingNewCategory(false);
                                                }}
                                                className={styles.cancelCategoryBtn}
                                                title="Cancelar"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.categorySelectWrapper}>
                                        <select name="categoria" value={formData.categoria} onChange={handleChange}>
                                            <option value="">Seleccionar Categoría</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingNewCategory(true)}
                                            className={styles.addCategoryBtn}
                                            title="Agregar nueva categoría"
                                        >
                                            <FiPlus /> Nueva
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock Inicial</label>
                                <div className={styles.stockStepper}>
                                    <button
                                        type="button"
                                        className={styles.stepperBtn}
                                        onClick={() => handleStockClick(-1)}
                                    >
                                        <FiMinus />
                                    </button>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                    <button
                                        type="button"
                                        className={styles.stepperBtn}
                                        onClick={() => handleStockClick(1)}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Precios</h2>
                        <p className={styles.infoText}>Los precios se expresan en PESOS ($).</p>



                        <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
                            <label style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Costo por Pack (Base para ganancias) ($)</label>
                            <input
                                type="number"
                                name="precioCosto"
                                value={formData.precioCosto}
                                onChange={handleChange}
                                placeholder="Ingrese el costo del pack (ej: 19100)"
                                style={{
                                    padding: '1rem',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#0f172a',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: '#f1f5f9'
                                }}
                            />
                            <small style={{ color: '#64748b', marginTop: '0.5rem', display: 'block' }}>* Este costo se usará para calcular tus ganancias en packs, pallets y unidades.</small>
                        </div>

                        <div className={styles.pricingContainer}>
                            {/* Top Row: Pack & Pallet */}
                            <div className={styles.pricingTopRow}>
                                {/* Pack (Principal) */}
                                <div className={`${styles.pricingCard} ${styles.cardPack}`}>
                                    <h4><FiPackage /> Pack</h4>
                                    <div className={styles.formGroup}>
                                        <label>Precio Venta Pack (Público) ($)</label>
                                        <input
                                            type="number"
                                            name="precio"
                                            value={formData.precio}
                                            onChange={handleChange}
                                            required
                                            placeholder="Precio de venta al público"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Unidades por Pack</label>
                                        <input
                                            type="number"
                                            name="unidadesPorPack"
                                            value={formData.unidadesPorPack}
                                            onChange={handleChange}
                                            placeholder="Ej: 6"
                                        />
                                    </div>
                                    {formData.precio && formData.unidadesPorPack && (
                                        <div className={styles.helperText}>
                                            <span>Unitario implícito:</span>
                                            <span className={styles.priceHighlight}>
                                                {formatCurrency(Number(formData.precio) / Number(formData.unidadesPorPack))}
                                            </span>
                                        </div>
                                    )}
                                    {formData.precio && formData.precioCosto && (
                                        <div className={styles.helperText} style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.5rem', color: Number(formData.precio) > Number(formData.precioCosto) ? '#16a34a' : '#dc2626' }}>
                                            <span>Ganancia x Pack:</span>
                                            <span style={{ fontWeight: 600 }}>
                                                {formatCurrency(Number(formData.precio) - Number(formData.precioCosto))}
                                                {Number(formData.precioCosto) > 0 && (
                                                    <small style={{ marginLeft: '4px', opacity: 0.8 }}>
                                                        ({((Number(formData.precio) - Number(formData.precioCosto)) / Number(formData.precioCosto) * 100).toFixed(1)}%)
                                                    </small>
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Pallet */}
                                <div className={`${styles.pricingCard} ${styles.cardPallet}`}>
                                    <h4><FiTruck /> Pallet</h4>
                                    <div className={styles.formGroup}>
                                        <label>Precio Venta Pack (Mayorista) ($)</label>
                                        <input
                                            type="number"
                                            name="precioPallet"
                                            value={formData.precioPallet}
                                            onChange={handleChange}
                                            placeholder="Precio venta por pack en pallet"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Cantidad Packs en Pallet</label>
                                        <input
                                            type="number"
                                            name="packsPorPallet"
                                            value={formData.packsPorPallet}
                                            onChange={handleChange}
                                            placeholder="Ej: 50"
                                        />
                                    </div>
                                    {formData.precioPallet && formData.packsPorPallet && (
                                        <div className={styles.helperText}>
                                            <span>Total Pallet:</span>
                                            <span className={styles.priceHighlight}>
                                                {formatCurrency(Number(formData.precioPallet) * Number(formData.packsPorPallet))}
                                            </span>
                                        </div>
                                    )}
                                    {formData.precioPallet && formData.precioCosto && formData.packsPorPallet && (
                                        <div className={styles.helperText} style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.5rem', color: Number(formData.precioPallet) > Number(formData.precioCosto) ? '#16a34a' : '#dc2626' }}>
                                            <span>Ganancia Total Pallet:</span>
                                            <span style={{ fontWeight: 600 }}>
                                                {formatCurrency((Number(formData.precioPallet) - Number(formData.precioCosto)) * Number(formData.packsPorPallet))}
                                                <small style={{ marginLeft: '4px', opacity: 0.8 }}>
                                                    ({((Number(formData.precioPallet) - Number(formData.precioCosto)) / Number(formData.precioCosto) * 100).toFixed(1)}%)
                                                </small>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Row: Unitario (Full Width) */}
                            <div className={`${styles.pricingCard} ${styles.cardUnit} ${styles.pricingFullRow}`}>
                                <h4><FiBox /> Unitario</h4>
                                <div className={styles.formGroup}>
                                    <label>Precio Unitario ($)</label>
                                    <input
                                        type="number"
                                        name="precioUnidad"
                                        value={formData.precioUnidad}
                                        onChange={handleChange}
                                        placeholder="Precio por unidad suelta"
                                    />
                                </div>
                                {formData.precioUnidad && formData.precioCosto && formData.unidadesPorPack && (
                                    <div className={styles.helperText} style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.5rem', color: Number(formData.precioUnidad) > (Number(formData.precioCosto) / Number(formData.unidadesPorPack)) ? '#16a34a' : '#dc2626' }}>
                                        <span>Ganancia x Unidad:</span>
                                        <span style={{ fontWeight: 600 }}>
                                            {formatCurrency(Number(formData.precioUnidad) - (Number(formData.precioCosto) / Number(formData.unidadesPorPack)))}
                                            {Number(formData.precioCosto) > 0 && (
                                                <small style={{ marginLeft: '4px', opacity: 0.8 }}>
                                                    ({((Number(formData.precioUnidad) - (Number(formData.precioCosto) / Number(formData.unidadesPorPack))) / (Number(formData.precioCosto) / Number(formData.unidadesPorPack)) * 100).toFixed(1)}%)
                                                </small>
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Producto Exclusivo Mayorista */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>🔒 Exclusividad Mayorista</h2>
                        <p className={styles.infoText}>Los productos exclusivos solo serán visibles para usuarios registrados (mayoristas).</p>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="isExclusive"
                                        checked={formData.isExclusive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isExclusive: e.target.checked }))}
                                        style={{ width: 'auto', accentColor: 'var(--accent-color)' }}
                                    />
                                    <span>Marcar como Producto Exclusivo</span>
                                </label>
                            </div>
                            {formData.isExclusive && (
                                <div className={styles.formGroup}>
                                    <label>Precio Exclusivo Mayorista ($)</label>
                                    <input
                                        type="number"
                                        name="precioExclusivo"
                                        value={formData.precioExclusivo}
                                        onChange={handleChange}
                                        placeholder="Precio especial para mayoristas"
                                    />
                                    {formData.precioExclusivo && formData.precio && (
                                        <div className={styles.suggestedPreview} style={{ color: '#22c55e' }}>
                                            <span>Ahorro mayorista:</span>
                                            <strong>
                                                -{Math.round(((Number(formData.precio) - Number(formData.precioExclusivo)) / Number(formData.precio)) * 100)}%
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Imágenes con soporte múltiple */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Imágenes (URLs)</h2>
                            <button type="button" onClick={addImageField} className={styles.addBtn}>
                                <FiPlus /> Imagen
                            </button>
                        </div>
                        {formData.imagenes.map((img, index) => (
                            <div key={index} className={styles.bulkRow}>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
                                    <input
                                        type="text" value={img}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                    {img && (
                                        <div className={styles.imagePreview}>
                                            <img src={img} alt={`Preview ${index + 1}`} />
                                        </div>
                                    )}
                                </div>
                                <button type="button" onClick={() => removeImageField(index)} className={styles.removeBtn}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Precios por Cantidad (Mayorista)</h2>
                            <button type="button" onClick={addBulkPrice} className={styles.addBtn}>
                                <FiPlus /> Tramo
                            </button>
                        </div>
                        {formData.bulkPrices.map((bp, index) => (
                            <div key={index} className={styles.bulkRow}>
                                <div className={styles.formGroup}>
                                    <label>Mín. Unidades</label>
                                    <input
                                        type="number" value={bp.minQuantity}
                                        onChange={(e) => handleBulkPriceChange(index, 'minQuantity', e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Precio x Unidad ($)</label>
                                    <input
                                        type="number" value={bp.price}
                                        onChange={(e) => handleBulkPriceChange(index, 'price', e.target.value)}
                                    />
                                </div>
                                <button type="button" onClick={() => removeBulkPrice(index)} className={styles.removeBtn}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="premium-btn" style={{ width: '100%', marginTop: '2rem' }}>
                        {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
