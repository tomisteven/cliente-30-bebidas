import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { FiDollarSign, FiTrendingUp, FiPackage, FiActivity, FiBarChart2, FiAward } from 'react-icons/fi';
import reportApi from '../../api/report.api';
import { formatCurrency } from '../../utils/currencyFormatter';
import styles from './AdminReports.module.css';

const AdminReports = () => {
    const [stats, setStats] = useState(null);
    const [salesHistory, setSalesHistory] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const [statsData, historyData, topProductsData] = await Promise.all([
                    reportApi.getStats(),
                    reportApi.getSalesHistory(days),
                    reportApi.getTopProducts()
                ]);
                setStats(statsData.data);
                setSalesHistory(historyData.data);
                setTopProducts(topProductsData.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [days]);

    if (loading && !stats) return <div className={styles.loading}>Cargando reportes...</div>;

    return (
        <div className={styles.reportsContainer}>
            {/* Stats Cards Row */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.iconWrapper} style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}>
                        <FiDollarSign />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Ventas Totales</h3>
                        <p>{stats ? formatCurrency(stats.totalSales) : '-'}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconWrapper} style={{ backgroundColor: '#e8f5e9', color: '#388e3c' }}>
                        <FiTrendingUp />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Ganancia Estimada</h3>
                        <p>{stats ? formatCurrency(stats.totalProfit) : '-'}</p>
                        <small className={styles.subtext}>Margen: {stats && stats.totalSales > 0 ? ((stats.totalProfit / stats.totalSales) * 100).toFixed(1) : 0}%</small>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconWrapper} style={{ backgroundColor: '#fff3e0', color: '#f57c00' }}>
                        <FiPackage />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Valor de Stock</h3>
                        <p>{stats ? formatCurrency(stats.totalStockValue) : '-'}</p>
                        <small className={styles.subtext}>{stats?.totalStockUnits} unidades</small>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconWrapper} style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}>
                        <FiActivity />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Ticket Promedio</h3>
                        <p>{stats ? formatCurrency(stats.averageTicket) : '-'}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.gridSection}>
                {/* Evolution Chart */}
                <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.cardHeader}>
                        <h2><FiBarChart2 /> Evolución de Ventas y Ganancias</h2>
                        <select value={days} onChange={(e) => setDays(e.target.value)} className={styles.selectDays}>
                            <option value="7">Últimos 7 días</option>
                            <option value="30">Últimos 30 días</option>
                            <option value="90">Últimos 3 meses</option>
                        </select>
                    </div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={salesHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#388e3c" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#388e3c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    labelFormatter={(label) => `Fecha: ${label}`}
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                />
                                <Legend />
                                <Area type="monotone" name="Ventas" dataKey="sales" stroke="#1976d2" fillOpacity={1} fill="url(#colorSales)" />
                                <Area type="monotone" name="Ganancia" dataKey="profit" stroke="#388e3c" fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className={styles.tableCard} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.cardHeader}>
                        <h2><FiAward /> Productos Más Vendidos</h2>
                    </div>
                    <div className={styles.topProductsList}>
                        {topProducts.map((product, index) => (
                            <div key={product._id} className={styles.productItem}>
                                <div className={styles.productDetails}>
                                    <div className={styles.rankBadge}>#{index + 1}</div>
                                    <span className={styles.productName}>{product.nombre}</span>
                                </div>
                                <div className={styles.productStats}>
                                    <span className={styles.productSold}>{product.totalSold} unid.</span>
                                    <span className={styles.productRevenue}>{formatCurrency(product.totalRevenue)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
