import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrendingUp, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { formatCurrency } from '../../utils/currencyFormatter';
import { getProductHistoryStats } from '../../api/product.api';
import styles from './ProductHistoryModal.module.css';

const ProductHistoryModal = ({ isOpen, onClose, product }) => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            fetchStats();
        } else {
            setStats([]);
        }
    }, [isOpen, product]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getProductHistoryStats(product._id);
            setStats(data);
        } catch (error) {
            console.error('Error fetching history stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className={styles.header}>
                            <h3>Historial y Ventas: {product.nombre}</h3>
                            <button onClick={onClose}><FiX /></button>
                        </div>

                        <div className={styles.content}>
                            {loading ? (
                                <div className={styles.loading}>Cargando historial...</div>
                            ) : stats.length === 0 ? (
                                <p className={styles.empty}>No hay historial de precios registrado.</p>
                            ) : (
                                <div className={styles.tableWrapper}>
                                    <table className={styles.historyTable}>
                                        <thead>
                                            <tr>
                                                <th>Período</th>
                                                <th>Precio Venta</th>
                                                <th>Costo</th>
                                                <th>Ventas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.map((entry, index) => {
                                                const isCurrent = index === 0;
                                                const startDate = new Date(entry.startDate);
                                                const endDate = isCurrent ? new Date() : new Date(entry.endDate);

                                                return (
                                                    <tr key={index} className={isCurrent ? styles.currentPeriod : ''}>
                                                        <td>
                                                            <div className={styles.periodDate}>
                                                                <span className={styles.dateMain}>{startDate.toLocaleDateString()}</span>
                                                                <span className={styles.dateArrow}>➜</span>
                                                                <span className={styles.dateMain}>
                                                                    {isCurrent ? 'Actualidad' : endDate.toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={styles.price}>{formatCurrency(entry.price)}</span>
                                                        </td>
                                                        <td>
                                                            {entry.costPrice > 0 ? (
                                                                <span className={styles.cost}>{formatCurrency(entry.costPrice)}</span>
                                                            ) : '-'}
                                                        </td>
                                                        <td>
                                                            <div className={styles.salesTag}>
                                                                <FiShoppingCart />
                                                                <span>{entry.totalSold} unid.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductHistoryModal;
