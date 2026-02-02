import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiX } from 'react-icons/fi';
import { formatCurrency } from '../../../utils/currencyFormatter';
import styles from '../AdminDashboard.module.css';

const ProductsTab = () => {
    const {
        products,
        loading,
        onDeleteProduct,
        adminSearch,
        setAdminSearch,
        adminCategory,
        setAdminCategory
    } = useOutletContext();

    const categories = [...new Set(products.map(p => p.categoria))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = adminSearch === '' ||
            product.nombre.toLowerCase().includes(adminSearch.toLowerCase()) ||
            product.sku.toLowerCase().includes(adminSearch.toLowerCase());

        const matchesCategory = adminCategory === '' || product.categoria === adminCategory;

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return <div className={styles.loader}>Cargando productos...</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
                <div className={styles.searchContainer}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        className={styles.tableSearch}
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                    />
                    {adminSearch && (
                        <button
                            className={styles.clearSearchBtn}
                            onClick={() => setAdminSearch('')}
                            title="Limpiar búsqueda"
                        >
                            <FiX />
                        </button>
                    )}
                </div>

                <div className={styles.adminFilters}>
                    <select
                        className={styles.adminSelect}
                        value={adminCategory}
                        onChange={(e) => setAdminCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.resultsCount}>
                    {filteredProducts.length} productos encontrados
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product._id}>
                            <td>
                                <div className={styles.productInfo}>
                                    {product.imagenes?.[0] && <img src={product.imagenes[0]} alt="" />}
                                    <span>{product.nombre}</span>
                                </div>
                            </td>
                            <td>{product.categoria}</td>
                            <td>{formatCurrency(product.precio)}</td>
                            <td>{product.stock}</td>
                            <td>
                                <span className={product.isActive ? styles.activeStatus : styles.inactiveStatus}>
                                    {product.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td>
                                <div className={styles.tableActions}>
                                    <Link to={`/admin/editar-producto/${product.slug}`} className={styles.editBtn}>
                                        <FiEdit />
                                    </Link>
                                    <button onClick={() => onDeleteProduct(product._id)} className={styles.deleteBtn}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                        <tr>
                            <td colSpan="6" className={styles.noResults}>
                                <div className={styles.emptySearchContainer}>
                                    <p>No se encontraron productos para "<strong>{adminSearch}</strong>"</p>
                                    {adminSearch && (
                                        <Link
                                            to={`/admin/crear-producto?nombre=${encodeURIComponent(adminSearch)}`}
                                            className="premium-btn"
                                            style={{ marginTop: '1rem', display: 'inline-flex' }}
                                        >
                                            <FiPlus /> Crear "{adminSearch}"
                                        </Link>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTab;
