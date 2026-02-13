import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../../api/product.api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Products.module.css';
import { FiSearch, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState('');
    const [categoria, setCategoria] = useState(searchParams.get('categoria') || '');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sort, setSort] = useState('nombre:asc');
    const [sellType, setSellType] = useState(''); // '', 'perfume', 'decant'
    const [expandedProductId, setExpandedProductId] = useState(null); // Track which accordion is open
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const PRODUCTS_PER_PAGE = 20;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setPage(1);
        try {
            const data = await getProducts({ search, categoria, sort, sellType, limit: PRODUCTS_PER_PAGE, page: 1 });
            setProducts(data.products || []);
            setHasMore((data.products || []).length === PRODUCTS_PER_PAGE);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [search, categoria, sort, sellType]);

    const loadMoreProducts = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const data = await getProducts({ search, categoria, sort, sellType, limit: PRODUCTS_PER_PAGE, page: nextPage });
            const newProducts = data.products || [];
            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
                setPage(nextPage);
                setHasMore(newProducts.length === PRODUCTS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error loading more products:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const cat = searchParams.get('categoria');
        if (cat !== null) {
            setCategoria(cat);
        }
    }, [searchParams]);

    const handleCategoriaChange = (newCat) => {
        setCategoria(newCat);
        if (newCat) {
            setSearchParams({ categoria: newCat });
        } else {
            searchParams.delete('categoria');
            setSearchParams(searchParams);
        }
    };

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

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchProducts]);

    // Handler to toggle accordion - only one open at a time
    const handleToggleAccordion = (productId) => {
        setExpandedProductId(prev => prev === productId ? null : productId);
    };

    return (
        <div className={styles.page}>
            <SEO
                title="Venta Mayorista de Bebidas | Malvinas Argentinas"
                description="Hacé tu pedido mayorista de bebidas online. Distribuidora líder en Los Polvorines, Villa de Mayo y alrededores. Precios imbatibles por pack y pallet."
                keywords="venta de bebidas por mayor, distribuidora malvinas argentinas, gaseosas por pack polvorines, cervezas por mayor buenos aires"
            />
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.title}>Distribuidora Mayorista en Malvinas Argentinas</h1>
                    <p className={styles.subtitle}>Stock permanente de gaseosas, cervezas y destilados para tu comercio.</p>
                    <div className={styles.todayUpdate}>
                        <div className={styles.todayPulse} />
                        <span>Precios actualizados al <strong>{new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}</strong></span>
                    </div>
                </header>
            </div>

            <section className={styles.controlsSection}>
                <div className={styles.controlsContainer}>
                    <div className={styles.searchWrapper}>
                        <div className={styles.searchBar}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Buscar bebidas (Coca Cola, Fernet, etc.)"
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

                        <select
                            className={styles.categorySelect}
                            value={categoria}
                            onChange={(e) => handleCategoriaChange(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            className={styles.sellTypeSelect}
                            value={sellType}
                            onChange={(e) => setSellType(e.target.value)}
                        >
                            <option value="">Todos los productos</option>
                            <option value="unidad">Por Unidad</option>
                            <option value="pack">Por Pack / Caja</option>
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
                <div className={styles.catalogLayout}>
                    <main className={styles.mainContent}>
                        {loading ? (
                            <div className={styles.loader}>Buscando bebidas...</div>
                        ) : categoria === 'Cervezas' || categoria === 'Vinos' ? (
                            <div className={styles.comingSoon}>
                                <div className={styles.comingSoonIcon}>
                                    <FiShoppingBag />
                                </div>
                                <h2>Próximamente</h2>
                                <p>
                                    Estamos preparando nuestro catálogo de {categoria === 'Cervezas' ? 'Cervezas' : 'Vinos y Espirituosas'}.
                                    <br />
                                    ¡Vuelve pronto para ver nuestras novedades!
                                </p>
                                <button className={styles.backBtn} onClick={() => setCategoria('')}>
                                    Ver Gaseosas disponibles
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={viewMode === 'grid' ? styles.grid : styles.list}>
                                    {products.length > 0 ? (
                                        products.map(product => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                viewMode={viewMode}
                                                isExpanded={expandedProductId === product._id}
                                                onToggleAccordion={() => handleToggleAccordion(product._id)}
                                            />
                                        ))
                                    ) : (
                                        <div className={styles.noResults}>
                                            <p>No se encontraron productos con estos criterios.</p>
                                        </div>
                                    )}
                                </div>

                                {hasMore && products.length > 0 && (
                                    <div className={styles.loadMoreContainer}>
                                        <button
                                            className={styles.loadMoreBtn}
                                            onClick={loadMoreProducts}
                                            disabled={loadingMore}
                                        >
                                            {loadingMore ? 'Cargando...' : <>Cargar más productos <FiChevronDown /></>}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
