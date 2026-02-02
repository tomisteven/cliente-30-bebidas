import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createProduct, updateProduct, getProductBySlug, getCategories, createCategory } from '../../api/product.api';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useNotification } from '../../context/NotificationContext';
import styles from './ProductForm.module.css';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { calculateSuggestedPrice, convertToARS } = useCurrency();
    const { showNotification } = useNotification();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        _id: '',
        nombre: '',
        sku: '',
        descripcion: '',
        precio: '',
        precioCard: '',
        stock: 0,
        categoria: 'Lattafa',
        imagenes: [''],
        bulkPrices: [],
        isExclusive: false,
        precioExclusivo: '',
        sellType: 'perfume',
        decantOptions: {
            available: false,
            description: '',
            sizes: []
        }
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
                        precioCard: data.precioCard?.toString() || '',
                        imagenes: data.imagenes.length > 0 ? data.imagenes : [''],
                        isExclusive: data.isExclusive || false,
                        precioExclusivo: data.precioExclusivo?.toString() || '',
                        sellType: data.sellType || 'perfume',
                        decantOptions: data.decantOptions || { available: false, description: '', sizes: [] }
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

    const addDecantSize = () => {
        setFormData(prev => ({
            ...prev,
            decantOptions: {
                ...prev.decantOptions,
                available: true,
                sizes: [...prev.decantOptions.sizes, { size: '', price: '', stock: '' }]
            }
        }));
    };

    const removeDecantSize = (index) => {
        const newSizes = formData.decantOptions.sizes.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            decantOptions: {
                ...prev.decantOptions,
                sizes: newSizes
            }
        }));
    };

    const handleDecantSizeChange = (index, field, value) => {
        const newSizes = [...formData.decantOptions.sizes];
        newSizes[index][field] = value;
        setFormData(prev => ({
            ...prev,
            decantOptions: {
                ...prev.decantOptions,
                sizes: newSizes
            }
        }));
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
                precioCard: Number(formData.precioCard),
                stock: Number(formData.stock),
                imagenes: formData.imagenes.filter(img => img.trim() !== ''),
                bulkPrices: cleanedBulkPrices,
                isExclusive: formData.isExclusive,
                precioExclusivo: formData.precioExclusivo ? Number(formData.precioExclusivo) : null,
                decantOptions: {
                    ...formData.decantOptions,
                    available: formData.sellType !== 'perfume',
                    sizes: formData.decantOptions.sizes
                        .filter(s => s.size && s.price)
                        .map(s => ({
                            size: Number(s.size),
                            price: Number(s.price),
                            stock: Number(s.stock) || 0
                        }))
                }
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

                <h1 className={styles.title}>{isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>

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
                            <div className={styles.formGroup}>
                                <label>Tipo de Venta</label>
                                <select name="sellType" value={formData.sellType} onChange={handleChange}>
                                    <option value="perfume">Solo Perfume Completo</option>
                                    <option value="decant">Solo Decant</option>
                                    <option value="both">Ambos (Perfume + Decant)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {(formData.sellType === 'decant' || formData.sellType === 'both') && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>💧 Opciones de Decant</h2>
                                <button type="button" onClick={addDecantSize} className={styles.addBtn}>
                                    <FiPlus /> Agregar Tamaño
                                </button>
                            </div>

                            <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                                <label>Descripción del decant</label>
                                <input
                                    type="text"
                                    value={formData.decantOptions.description}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        decantOptions: { ...prev.decantOptions, description: e.target.value }
                                    }))}
                                    placeholder="ej: Atomizador de vidrio con spray"
                                />
                            </div>

                            {formData.decantOptions.sizes.length === 0 ? (
                                <div className={styles.emptyDecants}>
                                    <p>No hay tamaños de decant configurados.</p>
                                    <p>Hacé clic en "+ Agregar Tamaño" para comenzar.</p>
                                </div>
                            ) : (
                                <div className={styles.decantGrid}>
                                    {formData.decantOptions.sizes.map((s, index) => (
                                        <div key={index} className={styles.decantCard}>
                                            <div className={styles.decantCardHeader}>
                                                <span className={styles.decantCardNumber}>#{index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDecantSize(index)}
                                                    className={styles.decantRemoveBtn}
                                                    title="Eliminar tamaño"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                            <div className={styles.decantCardBody}>
                                                <div className={styles.formGroup}>
                                                    <label>ML</label>
                                                    <input
                                                        type="number"
                                                        value={s.size}
                                                        onChange={(e) => handleDecantSizeChange(index, 'size', e.target.value)}
                                                        placeholder="5"
                                                        min="1"
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Precio USD</label>
                                                    <input
                                                        type="number"
                                                        value={s.price}
                                                        onChange={(e) => handleDecantSizeChange(index, 'price', e.target.value)}
                                                        placeholder="12"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>Stock</label>
                                                    <input
                                                        type="number"
                                                        value={s.stock}
                                                        onChange={(e) => handleDecantSizeChange(index, 'stock', e.target.value)}
                                                        placeholder="20"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Precios (USD)</h2>
                        <p className={styles.infoText}>Los precios se ingresan en DÓLARES y se mostrarán en PESOS al cliente según la cotización del día.</p>

                        <div className={styles.formGroup}>
                            <label>Precio Efectivo/Transf. (USD)</label>
                            <input type="number" name="precio" value={formData.precio} onChange={handleChange} required />
                            {formData.precio && (
                                <div className={styles.suggestedPreview}>
                                    <span>Precio sugerido individual:</span>
                                    <strong>{formatCurrency(calculateSuggestedPrice(Number(formData.precio)))} USD</strong>
                                    <small>({formatCurrency(convertToARS(calculateSuggestedPrice(Number(formData.precio))))} ARS)</small>
                                </div>
                            )}
                        </div>
                        {/* <div className={styles.formGroup}>
                                <label>Precio con Tarjeta (USD)</label>
                                <input type="number" name="precioCard" value={formData.precioCard} onChange={handleChange} />
                            </div> */}

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
                                    <label>Precio Exclusivo Mayorista (USD)</label>
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
                            <h2 className={styles.sectionTitle}>Precios por Mayor (Opcional)</h2>
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
                                    <label>Precio x Unidad (USD)</label>
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
