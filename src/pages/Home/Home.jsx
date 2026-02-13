import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts, getExclusiveProducts, getCategories } from '../../api/product.api';
import { getCombos } from '../../api/combo.api';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SEO from '../../components/SEO/SEO';
import styles from '../Products/Products.module.css';
import homeStyles from './Home.module.css';
import essenceBg from '../../assets/essence_beverages.png';
import { FiSearch, FiGrid, FiList, FiChevronDown, FiAward, FiTruck, FiShield, FiPackage, FiArrowRight, FiLock } from 'react-icons/fi';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [exclusiveProducts, setExclusiveProducts] = useState([]);
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState('');
    const [categoria, setCategoria] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('nombre:asc');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState([]);

    const fetchInitialProducts = useCallback(async () => {
        setLoading(true);
        setPage(1);
        try {
            const data = await getProducts({ search, categoria, sort, limit: 20, page: 1, excludeCategoria: 'NICHO' });
            console.log(data);
            setProducts(data.products || []);
            setHasMore(data.products?.length === 20);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [search, categoria, sort]);

    // Fetch categories
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

    // Fetch combos for the banner
    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const data = await getCombos();
                setCombos(data || []);
            } catch (error) {
                console.error('Error fetching combos:', error);
            }
        };
        fetchCombos();
    }, []);

    // Fetch exclusive products only for authenticated users
    useEffect(() => {
        if (isAuthenticated) {
            const fetchExclusive = async () => {
                try {
                    const data = await getExclusiveProducts();
                    setExclusiveProducts(data.products || []);
                } catch (error) {
                    console.error('Error fetching exclusive products:', error);
                }
            };
            fetchExclusive();
        }
    }, [isAuthenticated]);


    const loadMoreProducts = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const data = await getProducts({ search, categoria, sort, limit: 20, page: nextPage, excludeCategoria: 'NICHO' });
            console.log(data);
            const newProducts = data.products || [];
            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
                setPage(nextPage);
                setHasMore(newProducts.length === 20);
            }
        } catch (error) {
            console.error('Error loading more products:', error);
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

    // Get combo preview images
    const getComboPreviewImages = () => {
        const images = [];
        combos.slice(0, 2).forEach(combo => {
            if (combo.products) {
                combo.products.slice(0, 2).forEach(item => {
                    if (item.product?.imagenes?.[0] && images.length < 3) {
                        images.push(item.product.imagenes[0]);
                    }
                });
            }
        });
        return images;
    };

    // Get max discount from combos
    const getMaxDiscount = () => {
        if (combos.length === 0) return 0;
        return Math.max(...combos.map(c => c.discountPercentage || 0));
    };

    const comboImages = getComboPreviewImages();
    const maxDiscount = getMaxDiscount();

    return (
        <div className={homeStyles.home}>
            <SEO
                title="Distribuidora de Bebidas | Malvinas Argentinas y Zona Norte"
                description="Tu distribuidora líder de bebidas en Los Polvorines, Villa de Mayo y Malvinas Argentinas. Precios imbatibles por pack y pallet. ¡Hacé tu pedido hoy!"
                keywords="distribuidora de bebidas malvinas argentinas, mayorista de bebidas los polvorines, venta de bebidas por pallet buenos aires, gaseosas por mayor zona norte"
            />
            <HeroCarousel />


            <section className={styles.controlsSection}>
                <div className={styles.controlsContainer}>
                    <div className={styles.searchWrapper}>
                        <div className={styles.searchBar}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="¿Qué bebida estás buscando?"
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
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <div className={styles.viewToggles}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <FiGrid />
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
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
                        <div className={homeStyles.catalogSection}>
                            <h1 className={homeStyles.sectionTitle}>Distribuidora de Bebidas en Malvinas Argentinas</h1>
                            {loading ? (
                                <div className={styles.loader}>Cargando catálogo...</div>
                            ) : (
                                <>
                                    <div className={viewMode === 'grid' ? styles.grid : styles.list}>
                                        {products.map(product => (
                                            <ProductCard key={product._id} product={product} viewMode={viewMode} />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                                            <button
                                                className="outline-btn"
                                                onClick={loadMoreProducts}
                                                disabled={loadingMore}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                                            >
                                                {loadingMore ? 'Cargando...' : <>Cargar más productos <FiChevronDown /></>}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </main>
                </div>

                {/* Exclusive Products Section - Only for authenticated users */}
                {isAuthenticated && exclusiveProducts.length > 0 && (
                    <motion.section
                        className={homeStyles.exclusiveSection}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={homeStyles.exclusiveHeader}>
                            <div className={homeStyles.exclusiveBadge}>
                                <FiLock /> ZONA MAYORISTA
                            </div>
                            <h2 className={homeStyles.exclusiveTitle}>Productos Exclusivos</h2>
                            <p className={homeStyles.exclusiveSubtitle}>
                                Bebidas y productos con precios especiales solo disponibles para clientes registrados
                            </p>
                        </div>
                        <div className={styles.grid} style={{ marginTop: '2rem' }}>
                            {exclusiveProducts.slice(0, 4).map(product => (
                                <ProductCard key={product._id} product={product} viewMode="grid" />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Combo Promo Banner */}
                {combos.length > 0 && (
                    <Link to="/combos" style={{ textDecoration: 'none' }}>
                        <motion.div
                            className={homeStyles.comboBanner}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className={homeStyles.comboBannerContent}>
                                <span className={homeStyles.comboBannerTag}>
                                    <FiPackage /> Ofertas Exclusivas
                                </span>
                                <h3 className={homeStyles.comboBannerTitle}>
                                    Combos de <span>Bebidas</span>
                                </h3>
                                <p className={homeStyles.comboBannerText}>
                                    Descubrí nuestros packs seleccionados con descuentos especiales.
                                    La mejor forma de abastecer tu heladera o comercio.
                                </p>
                                <span className={homeStyles.comboBannerBtn}>
                                    Ver Combos <FiArrowRight />
                                </span>
                            </div>

                            <div className={homeStyles.comboBannerVisual}>
                                <div className={homeStyles.comboBannerImages}>
                                    {comboImages.map((img, idx) => (
                                        <div key={idx} className={homeStyles.comboBannerImage}>
                                            <img src={img} alt={`Producto ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                {maxDiscount > 0 && (
                                    <div className={homeStyles.comboBannerDiscount}>
                                        <span className={homeStyles.comboBannerDiscountValue}>-{maxDiscount}%</span>
                                        <span className={homeStyles.comboBannerDiscountLabel}>Descuento</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </Link>
                )}

                {/* Nuestra Esencia Section */}
                <section className={homeStyles.essenceSection}>
                    <div className={homeStyles.essenceContent}>
                        <span className={homeStyles.essenceTag}>NUESTRO CENTRO LOGÍSTICO</span>
                        <h2 className={homeStyles.essenceTitle}>Distribuidora 30 Bebidas: Tu Socio Estratégico a Gran Escala.</h2>
                        <p className={homeStyles.essenceText}>
                            En <strong>30 Bebidas</strong>, operamos con una infraestructura de vanguardia diseñada para el abastecimiento masivo. Nuestra logística optimizada garantiza que tu comercio, evento o cadena de distribución cuente siempre con stock disponible, precios directos y una entrega puntual.
                        </p>

                        <div className={homeStyles.features}>
                            <div className={homeStyles.featureItem}>
                                <div className={homeStyles.featureIcon}><FiAward /></div>
                                <h3>Calidad Premium</h3>
                                <p>Productos 100% originales garantizados.</p>
                            </div>
                            <div className={homeStyles.featureItem}>
                                <div className={homeStyles.featureIcon}><FiTruck /></div>
                                <h3>Envío Seguro</h3>
                                <p>Llegamos a todo el país con máximo cuidado.</p>
                            </div>
                            <div className={homeStyles.featureItem}>
                                <div className={homeStyles.featureIcon}><FiShield /></div>
                                <h3>Compra Protegida</h3>
                                <p>Tu seguridad es nuestra prioridad número uno.</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={homeStyles.essenceImage}
                        style={{ backgroundImage: `url(${essenceBg})` }}
                    />
                </section>
            </div>
        </div>
    );
};

export default Home;

