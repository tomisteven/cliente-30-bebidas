import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, deleteProduct } from '../../api/product.api';
import { getCombos, deleteCombo } from '../../api/combo.api';
import authApi from '../../api/auth.api';
import orderApi from '../../api/order.api';
import discountApi from '../../api/discount.api';
import emailApi from '../../api/email.api';
import { useNotification } from '../../context/NotificationContext';
import { FiPlus, FiBox, FiPackage, FiUsers, FiShoppingBag, FiMail, FiTag, FiSettings, FiX, FiRefreshCw, FiTruck, FiPieChart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ProductHistoryModal from '../../components/Admin/ProductHistoryModal';
import styles from './AdminDashboard.module.css';

const AdminLayout = () => {
    const [products, setProducts] = useState([]);
    const [combos, setCombos] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    // History Modal State
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedProductForHistory, setSelectedProductForHistory] = useState(null);

    // Persistent Filters for Products Tab - Initialize from sessionStorage
    const [adminSearch, setAdminSearch] = useState(sessionStorage.getItem('adminProductSearch') || '');
    const [adminCategory, setAdminCategory] = useState(sessionStorage.getItem('adminProductCategory') || '');

    // Sync filters to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('adminProductSearch', adminSearch);
    }, [adminSearch]);

    useEffect(() => {
        sessionStorage.setItem('adminProductCategory', adminCategory);
    }, [adminCategory]);

    // UI States for User management
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [couponData, setCouponData] = useState({
        code: '',
        type: 'percentage',
        value: 10,
        minPurchase: 0
    });
    const [couponAssignmentMode, setCouponAssignmentMode] = useState('new');
    const [isGenericCouponModalOpen, setIsGenericCouponModalOpen] = useState(false);

    const { isAdmin: authIsAdmin, loading: authLoading } = useAuth();

    const fetchData = async () => {
        if (!authIsAdmin || authLoading) return;
        setLoading(true);
        try {
            const results = await Promise.allSettled([
                getProducts({ limit: 0, isAdmin: true }),
                getCombos(),
                authApi.getUsers(),
                orderApi.getAll(),
                emailApi.getAll(),
                discountApi.getAll()
            ]);

            if (results[0].status === 'fulfilled') setProducts(results[0].value.products || []);
            if (results[1].status === 'fulfilled') setCombos(results[1].value || []);
            if (results[2].status === 'fulfilled') setUsers(results[2].value.data || []);
            if (results[3].status === 'fulfilled') setOrders(results[3].value.data || []);
            if (results[4].status === 'fulfilled') setSubscribers(results[4].value.data || []);
            if (results[5].status === 'fulfilled') setDiscounts(results[5].value.data || []);

            results.forEach((res, i) => {
                if (res.status === 'rejected') {
                    console.warn(`Admin Fetch Error [${i}]:`, res.reason);
                }
            });

        } catch (error) {
            console.error('Critical internal error during fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [authIsAdmin, authLoading]);

    // Handler functions
    const handleDeleteProduct = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await deleteProduct(id);
                showNotification('Producto eliminado correctamente');
                fetchData();
            } catch (error) {
                showNotification('Error al eliminar producto', 'error');
            }
        }
    };

    const handleDeleteCombo = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este combo?')) {
            try {
                await deleteCombo(id);
                showNotification('Combo eliminado correctamente');
                fetchData();
            } catch (error) {
                showNotification('Error al eliminar combo', 'error');
            }
        }
    };

    const generateCouponCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCouponData(prev => ({ ...prev, code }));
    };

    const handleAssignCoupon = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await discountApi.create({
                ...couponData,
                assignedTo: selectedUser._id,
                usageLimit: 1
            });
            showNotification(`Cupón ${couponData.code} asignado correctamente a ${selectedUser.nombre}`);
            setIsCouponModalOpen(false);
            setCouponData({
                code: '',
                type: 'percentage',
                value: 10,
                minPurchase: 0
            });
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error al asignar cupón', 'error');
        } finally {
            setLoading(true);
            fetchData();
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await orderApi.updateStatus(orderId, status);
            showNotification('Estado actualizado correctamente');
            fetchData();
        } catch (error) {
            showNotification('Error al actualizar estado', 'error');
        }
    };

    const handleAssignExistingCoupon = async (discountId) => {
        setLoading(true);
        try {
            await discountApi.update(discountId, { assignedTo: selectedUser._id });
            showNotification('Cupón asignado correctamente');
            setIsCouponModalOpen(false);
            fetchData();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error al asignar cupón', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDiscount = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cupón?')) {
            try {
                await discountApi.delete(id);
                showNotification('Cupón eliminado correctamente');
                fetchData();
            } catch (error) {
                showNotification('Error al eliminar cupón', 'error');
            }
        }
    };

    const handleCreateGenericCoupon = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await discountApi.create({
                ...couponData,
                usageLimit: couponData.usageLimit || null
            });
            showNotification('Cupón genérico creado correctamente');
            setIsGenericCouponModalOpen(false);
            setCouponData({
                code: '',
                type: 'percentage',
                value: 10,
                minPurchase: 0
            });
            fetchData();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error al crear cupón', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openAssignCouponModal = (user) => {
        setSelectedUser(user);
        setIsCouponModalOpen(true);
    };

    const openGenericCouponModal = () => {
        setCouponData({ code: '', type: 'percentage', value: 10, minPurchase: 0 });
        setIsGenericCouponModalOpen(true);
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1 className={styles.title}>Panel de Administración</h1>
                    <div className={styles.actions}>
                        <Link to="/admin/crear-producto" className="premium-btn">
                            <FiPlus /> Producto
                        </Link>
                        <Link to="/admin/crear-combo" className="outline-btn">
                            <FiPlus /> Combo
                        </Link>
                    </div>
                </div>

                <div className={styles.tabs}>
                    <NavLink
                        to="/admin/productos"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiBox /> Productos ({products.length})
                    </NavLink>
                    <NavLink
                        to="/admin/combos"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiPackage /> Combos ({combos.length})
                    </NavLink>
                    <NavLink
                        to="/admin/comercios"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiUsers /> Comercios ({users.length})
                    </NavLink>
                    <NavLink
                        to="/admin/usuarios"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiUsers /> Usuarios ({users.length})
                    </NavLink>
                    <NavLink
                        to="/admin/pedidos"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiShoppingBag /> Pedidos ({orders.length})
                    </NavLink>
                    <NavLink
                        to="/admin/emails"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiMail /> Emails ({subscribers.length})
                    </NavLink>
                    <NavLink
                        to="/admin/cupones"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiTag /> Cupones ({discounts.length})
                    </NavLink>
                    {/* <NavLink
                        to="/admin/configuracion"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiSettings /> Configuración
                    </NavLink> */}
                    <NavLink
                        to="/admin/reportes"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiPieChart /> Reportes
                    </NavLink>
                    <NavLink
                        to="/admin/proveedores"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
                    >
                        <FiTruck /> Proveedores
                    </NavLink>
                </div>

                <div className={styles.tableContainer}>
                    <Outlet context={{
                        products,
                        combos,
                        users,
                        orders,
                        subscribers,
                        discounts,
                        loading,
                        adminSearch,
                        setAdminSearch,
                        adminCategory,
                        setAdminCategory,
                        onDeleteProduct: handleDeleteProduct,
                        onDeleteCombo: handleDeleteCombo,
                        onAssignCoupon: openAssignCouponModal,
                        onUpdateStatus: handleUpdateStatus,
                        onDeleteDiscount: handleDeleteDiscount,
                        onCreateCoupon: openGenericCouponModal,
                        onOpenHistory: (product) => {
                            setSelectedUser(product); // Reusing state var or creating new one? Better create new one.
                            // Actually wait, I need to add state for this.
                            // Let's use setSelectedProductForHistory defined below.
                            setSelectedProductForHistory(product);
                            setHistoryModalOpen(true);
                        },
                        refreshData: fetchData
                    }} />
                </div>
            </div>

            <ProductHistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                product={selectedProductForHistory}
            />

            {/* Modal de Cupón con Animaciones */}
            <AnimatePresence>
                {isCouponModalOpen && (
                    <div className={styles.modalOverlay}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Asignar Cupón</h3>
                                <button className={styles.closeModal} onClick={() => setIsCouponModalOpen(false)}>
                                    <FiX />
                                </button>
                            </div>

                            <div className={styles.userCard}>
                                <div className={styles.userAvatar}>
                                    {selectedUser?.nombre.charAt(0)}
                                </div>
                                <div className={styles.userData}>
                                    <strong>{selectedUser?.nombre}</strong>
                                    <span>{selectedUser?.email}</span>
                                </div>
                            </div>

                            <div className={styles.modalSelector}>
                                <button
                                    type="button"
                                    className={couponAssignmentMode === 'new' ? styles.activeSelector : ''}
                                    onClick={() => setCouponAssignmentMode('new')}
                                >
                                    Crear Nuevo
                                </button>
                                <button
                                    type="button"
                                    className={couponAssignmentMode === 'existing' ? styles.activeSelector : ''}
                                    onClick={() => setCouponAssignmentMode('existing')}
                                >
                                    Elegir Existente
                                </button>
                            </div>

                            {couponAssignmentMode === 'new' ? (
                                <form onSubmit={handleAssignCoupon}>
                                    <div className={styles.formGroup}>
                                        <label>Código del Cupón</label>
                                        <div className={styles.inputWithAction}>
                                            <input
                                                type="text"
                                                value={couponData.code}
                                                onChange={e => setCouponData({ ...couponData, code: e.target.value.toUpperCase() })}
                                                placeholder="EJ: BIENVENIDO10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className={styles.actionBtn}
                                                onClick={generateCouponCode}
                                                title="Generar código aleatorio"
                                            >
                                                <FiRefreshCw />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.row}>
                                        <div className={styles.formGroup}>
                                            <label>Tipo</label>
                                            <select
                                                value={couponData.type}
                                                onChange={e => setCouponData({ ...couponData, type: e.target.value })}
                                            >
                                                <option value="percentage">Porcentaje (%)</option>
                                                <option value="fixed">Monto Fijo ($)</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Valor ({couponData.type === 'percentage' ? '%' : '$'})</label>
                                            <input
                                                type="number"
                                                value={couponData.value}
                                                onChange={e => setCouponData({ ...couponData, value: Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Compra Mínima ($)</label>
                                        <input
                                            type="number"
                                            value={couponData.minPurchase}
                                            onChange={e => setCouponData({ ...couponData, minPurchase: Number(e.target.value) })}
                                        />
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={() => setIsCouponModalOpen(false)}>Cancelar</button>
                                        <button type="submit" className="premium-btn">Crear y Asignar</button>
                                    </div>
                                </form>
                            ) : (
                                <div className={styles.existingCoupons}>
                                    <label>Seleccionar un cupón existente:</label>
                                    <div className={styles.couponGrid}>
                                        {discounts.filter(d => !d.assignedTo && d.isActive).map(discount => (
                                            <div
                                                key={discount._id}
                                                className={styles.couponItem}
                                                onClick={() => handleAssignExistingCoupon(discount._id)}
                                            >
                                                <div className={styles.couponInfo}>
                                                    <strong>{discount.code}</strong>
                                                    <span>{discount.type === 'percentage' ? `${discount.value}%` : discount.type === 'fixed' ? `$${discount.value}` : 'Envío Gratis'}</span>
                                                </div>
                                                <FiPlus />
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={() => setIsCouponModalOpen(false)}>Cerrar</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Cupón Genérico */}
            <AnimatePresence>
                {isGenericCouponModalOpen && (
                    <div className={styles.modalOverlay}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className={styles.modalHeader}>
                                <h3>Crear Cupón Genérico</h3>
                                <button className={styles.closeModal} onClick={() => setIsGenericCouponModalOpen(false)}>
                                    <FiX />
                                </button>
                            </div>

                            <form onSubmit={handleCreateGenericCoupon}>
                                <div className={styles.formGroup}>
                                    <label>Código del Cupón</label>
                                    <div className={styles.inputWithAction}>
                                        <input
                                            type="text"
                                            value={couponData.code}
                                            onChange={e => setCouponData({ ...couponData, code: e.target.value.toUpperCase() })}
                                            placeholder="EJ: VERANO2026"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={styles.actionBtn}
                                            onClick={generateCouponCode}
                                        >
                                            <FiRefreshCw />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>Tipo</label>
                                        <select
                                            value={couponData.type}
                                            onChange={e => setCouponData({ ...couponData, type: e.target.value })}
                                        >
                                            <option value="percentage">Porcentaje (%)</option>
                                            <option value="fixed">Monto Fijo ($)</option>
                                            <option value="shipping">Envío Gratis</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Valor</label>
                                        <input
                                            type="number"
                                            value={couponData.value}
                                            onChange={e => setCouponData({ ...couponData, value: Number(e.target.value) })}
                                            disabled={couponData.type === 'shipping'}
                                            required={couponData.type !== 'shipping'}
                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.formGroup}>
                                        <label>Compra Mínima ($)</label>
                                        <input
                                            type="number"
                                            value={couponData.minPurchase}
                                            onChange={e => setCouponData({ ...couponData, minPurchase: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Límite de Uso</label>
                                        <input
                                            type="number"
                                            value={couponData.usageLimit || ''}
                                            onChange={e => setCouponData({ ...couponData, usageLimit: e.target.value ? Number(e.target.value) : null })}
                                            placeholder="Vacío = Ilimitado"
                                        />
                                    </div>
                                </div>

                                <div className={styles.modalActions}>
                                    <button type="button" onClick={() => setIsGenericCouponModalOpen(false)}>Cancelar</button>
                                    <button type="submit" className="premium-btn">Crear Cupón</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;
