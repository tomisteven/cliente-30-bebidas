import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../../api/product.api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Miniaturas.module.css';
import { FiSearch, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import SEO from '../../components/SEO/SEO';

const Miniaturas = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('nombre:asc');
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState([]);

    const fetchInitialProducts = useCallback(async () => {
        setLoading(true);
        setPage(1);
        try {
            const data = await getProducts({ search, categoria: 'Miniaturas', sort, limit: 20, page: 1 });
            setProducts(data.products || []);
            setHasMore(data.products?.length === 20);
        } catch (error) {
            console.error('Error fetching miniaturas products:', error);
        } finally {
            setLoading(false);
        }
    }, [search, sort]);

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchAllCategories();
    }, []);

    const loadMoreProducts = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const data = await getProducts({ search, categoria: 'Miniaturas', sort, limit: 20, page: nextPage });
            const newProducts = data.products || [];
            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
                setPage(nextPage);
                setHasMore(newProducts.length === 20);
            }
        } catch (error) {
            console.error('Error loading more miniaturas products:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchInitialProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchInitialProducts]);

    const handleToggleAccordion = (productId) => {
        setExpandedProductId(prev => prev === productId ? null : productId);
    };

    return (
        <div className={styles.page}>
            <SEO
                title="Miniaturas"
                description="Colección de perfumes en formato miniatura. Ideales para regalo o para llevar con vos a todos lados."
                keywords="miniaturas perfumes, perfumes pequeños, frascos miniatura, regalos perfumes"
            />
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.title}>Colección de Miniaturas</h1>
                    <p className={styles.subtitle}>El detalle perfecto en formato compacto.</p>
                </header>
            </div>

            <section className={styles.controlsSection}>
                <div className={styles.controlsContainer}>
                    <div className={styles.searchWrapper}>
                        <div className={styles.searchBar}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Buscar miniaturas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            className={styles.sortSelect}
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="nombre:asc">Nombre (A-Z)</option>
                            <option value="precio:asc">Menor precio</option>
                            <option value="precio:desc">Mayor precio</option>
                        </select>

                        <div className={styles.viewToggles}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Vista Cuadrícula"
                            >
                                <FiGrid />
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
                                title="Vista Lista"
                            >
                                <FiList />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">
                <main className={styles.mainContent}>
                    {loading ? (
                        <div className={styles.loader}>Buscando tesoros pequeños...</div>
                    ) : (
                        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
                            {products.length > 0 ? (
                                <>
                                    {products.map(product => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            viewMode={viewMode}
                                            isExpanded={expandedProductId === product._id}
                                            onToggleAccordion={() => handleToggleAccordion(product._id)}
                                        />
                                    ))}

                                    {hasMore && (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '3rem' }}>
                                            <button
                                                className="outline-btn"
                                                onClick={loadMoreProducts}
                                                disabled={loadingMore}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                                            >
                                                {loadingMore ? 'Cargando...' : <>Cargar más fragancias <FiChevronDown /></>}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.noResults}>
                                    <p>No se encontraron miniaturas en este momento.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Miniaturas;
