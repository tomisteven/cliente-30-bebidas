import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiChevronDown, FiBox, FiPackage, FiTruck, FiInfo, FiClock } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useToast } from '../Toast/Toast';
import { formatCurrency } from '../../utils/currencyFormatter';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, viewMode = 'grid', isExpanded, onToggleAccordion }) => {
    const { addToCart } = useCart();
    const { addToast } = useToast();

    // internal state for selection - Default to 'pack'
    const [selectedUnitType, setSelectedUnitType] = useState('pack');
    const [internalExpanded, setInternalExpanded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, 'product', selectedUnitType);
        const unitLabels = { unit: 'Unidad', pack: 'Pack', pallet: 'Pallet' };
        addToast(`${product.nombre} (${unitLabels[selectedUnitType]}) agregado al carrito`, 'cart');
    };

    const isControlled = isExpanded !== undefined && onToggleAccordion !== undefined;
    const showBulkPrices = isControlled ? isExpanded : internalExpanded;

    const handleToggle = () => {
        if (isControlled) {
            onToggleAccordion();
        } else {
            setInternalExpanded(prev => !prev);
        }
    };

    const imageUrl = Array.isArray(product.imagenes) && product.imagenes.length > 0
        ? product.imagenes[0]
        : (typeof product.imagenes === 'string' ? product.imagenes : 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=500');

    const isList = viewMode === 'list';

    // Pricing Logic
    const unitPrice = product.precioUnidad || 0;
    const packPrice = product.precio || 0;
    const palletPrice = product.precioPallet || 0;

    const getCurrentPrice = () => {
        if (selectedUnitType === 'unit') return unitPrice;
        if (selectedUnitType === 'pallet') return (palletPrice * (product.packsPorPallet || 1));
        return packPrice;
    };

    const currentPrice = getCurrentPrice();
    const hasBulkPrices = selectedUnitType === 'unit' && product.bulkPrices && product.bulkPrices.length > 0;

    return (
        <motion.div
            className={`${styles.card} ${isList ? styles.listCard : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.imageWrapper}>
                <img
                    src={imageUrl}
                    alt={product.nombre}
                    className={styles.image}
                    loading="lazy"
                />
                {product.stock <= 0 && <div className={styles.outOfStock}>AGOTADO</div>}

                <div className={styles.imageOverlay}>
                    <button
                        className={styles.cartBtn}
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                    >
                        <FiShoppingCart />
                        <span>Comprar</span>
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.info}>
                    <p className={styles.brand}>{product.categoria}</p>
                    <h3 className={styles.name}>{product.nombre}</h3>
                </div>

                <div className={styles.unitSelector}>
                    {unitPrice > 0 && (
                        <button
                            className={`${styles.unitTab} ${selectedUnitType === 'unit' ? styles.unitTabActive : ''}`}
                            onClick={() => setSelectedUnitType('unit')}
                        >
                            <FiBox /> <span>1 U</span>
                        </button>
                    )}
                    {packPrice > 0 && (
                        <button
                            className={`${styles.unitTab} ${selectedUnitType === 'pack' ? styles.unitTabActive : ''}`}
                            onClick={() => setSelectedUnitType('pack')}
                        >
                            <FiPackage /> <span>x{product.unidadesPorPack}</span>
                        </button>
                    )}
                    {palletPrice > 0 && (
                        <button
                            className={`${styles.unitTab} ${selectedUnitType === 'pallet' ? styles.unitTabActive : ''}`}
                            onClick={() => setSelectedUnitType('pallet')}
                        >
                            <FiTruck /> <span>Pallet</span>
                        </button>
                    )}
                </div>

                <div className={styles.pricingSection}>
                    <div className={styles.priceHeader}>
                        <span className={styles.priceLabel}>Precio {selectedUnitType}</span>

                    </div>

                    <div className={styles.priceValue}>
                        {formatCurrency(currentPrice)}
                    </div>

                    {(selectedUnitType === 'pallet' || (selectedUnitType === 'pack' && product.unidadesPorPack > 1)) && (
                        <div className={styles.detailsRow}>
                            <span className={styles.detailsLabel}>
                                {selectedUnitType === 'pallet'
                                    ? `Total ${product.packsPorPallet || 1} packs`
                                    : `Total ${product.unidadesPorPack} unidades`}
                            </span>
                        </div>
                    )}
                    <div className={styles.liveBadge}>
                        <div className={styles.liveDot} />
                        <span className='span-precio-actualizado'>Precio {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                {hasBulkPrices && (
                    <div className={styles.bulkSection}>
                        <button
                            className={`${styles.bulkToggle} ${showBulkPrices ? styles.bulkToggleOpen : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggle();
                            }}
                        >
                            <span className={styles.bulkToggleText}>
                                📦 Escala x Unidades
                            </span>
                            <FiChevronDown className={styles.bulkChevron} />
                        </button>

                        <AnimatePresence>
                            {showBulkPrices && (
                                <motion.div
                                    className={styles.bulkPricesContainer}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                >
                                    <div className={styles.bulkPricesList}>
                                        {product.bulkPrices
                                            .sort((a, b) => a.minQuantity - b.minQuantity)
                                            .map((bp, index) => {
                                                const savings = ((product.precio - bp.price) / product.precio * 100).toFixed(0);
                                                return (
                                                    <div key={index} className={styles.bulkPriceItem}>
                                                        <div className={styles.bulkQty}>
                                                            <span className={styles.bulkQtyNumber}>{bp.minQuantity}+</span>
                                                        </div>
                                                        <div className={styles.bulkPriceInfo}>
                                                            <span className={styles.bulkPriceValue}>
                                                                {formatCurrency(bp.price)}
                                                            </span>
                                                        </div>
                                                        <div className={`${styles.bulkSavings} ${Number(savings) >= 5 ? styles.bulkSavingsHigh : ''}`}>
                                                            -{savings}%
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
