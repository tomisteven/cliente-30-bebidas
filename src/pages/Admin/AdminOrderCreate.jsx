import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiSearch, FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiSave, FiShoppingCart } from 'react-icons/fi';
import { getProducts } from '../../api/product.api';
import orderApi from '../../api/order.api';
import authApi from '../../api/auth.api';
import { formatCurrency } from '../../utils/currencyFormatter';
import styles from './AdminOrderCreate.module.css';

const AdminOrderCreate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(location.state?.user || null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        paymentMethod: 'Efectivo',
        observations: ''
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [usersRes, productsRes] = await Promise.all([
                    authApi.getUsers(),
                    getProducts({ limit: 0, isAdmin: true })
                ]);

                if (usersRes.success) setUsers(usersRes.data);
                const productsData = productsRes.products || productsRes.data || productsRes;
                setProducts(Array.isArray(productsData) ? productsData : []);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadInitialData();
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                ...product,
                name: product.nombre || product.name,
                price: product.precio || product.price,
                quantity: 1,
                type: 'product',
                unitType: 'unit'
            }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item._id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleSubmit = async () => {
        if (!selectedUser) return alert('Seleccione un usuario');
        if (cart.length === 0) return alert('El carrito está vacío');

        try {
            setLoading(true);
            const total = calculateTotal();
            const orderPayload = {
                userId: selectedUser._id,
                items: cart.map(item => ({
                    product: item._id,
                    nombre: item.name,
                    precio: item.price,
                    quantity: item.quantity,
                    unitType: item.unitType,
                    type: item.type
                })),
                subtotal: total,
                total: total,
                shippingData: {
                    name: selectedUser.nombre,
                    phone: selectedUser.phone,
                    email: selectedUser.email,
                    city: selectedUser.locality || selectedUser.address
                },
                paymentMethod: formData.paymentMethod,
                observations: formData.observations,
                status: 'procesando'
            };

            await orderApi.create(orderPayload);
            alert('Pedido creado exitosamente');
            navigate('/admin/pedidos');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error al crear pedido');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        (p.nombre || p.name)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                {/* Page Header */}
                <header className={styles.pageHeader}>
                    <button className={styles.backBtn} onClick={() => navigate('/admin/comercios')}>
                        <FiArrowLeft /> Volver
                    </button>
                    <h1 className={styles.pageTitle}>Nuevo Pedido Manual</h1>
                </header>

                {/* Main Content */}
                <div className={styles.content}>
                    {/* Left Column - Products */}
                    <div className={styles.productsColumn}>
                        {/* Client Selection Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FiUser className={styles.cardIcon} />
                                <h2>Cliente</h2>
                            </div>
                            <div className={styles.cardBody}>
                                {!selectedUser ? (
                                    <select
                                        className={styles.select}
                                        onChange={(e) => setSelectedUser(users.find(u => u._id === e.target.value))}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Seleccionar Cliente...</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id}>
                                                {u.commerceName ? `${u.commerceName} (${u.nombre})` : u.nombre}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className={styles.clientInfo}>
                                        <div className={styles.clientDetails}>
                                            <strong>{selectedUser.commerceName || selectedUser.nombre}</strong>
                                            <span>{selectedUser.email}</span>
                                            <span>{selectedUser.address} - {selectedUser.locality}</span>
                                        </div>
                                        <button className={styles.changeBtn} onClick={() => setSelectedUser(null)}>
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Products Search Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FiSearch className={styles.cardIcon} />
                                <h2>Productos</h2>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.searchInput}>
                                    <FiSearch />
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className={styles.productGrid}>
                                    {filteredProducts.slice(0, 12).map(product => (
                                        <div
                                            key={product._id}
                                            className={styles.productCard}
                                            onClick={() => addToCart(product)}
                                        >
                                            <img
                                                src={(product.imagenes?.[0]) || (product.images?.[0]) || 'https://via.placeholder.com/80'}
                                                alt={product.nombre || product.name}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                                            />
                                            <div className={styles.productDetails}>
                                                <span className={styles.productName}>{product.nombre || product.name}</span>
                                                <span className={styles.productPrice}>{formatCurrency(product.precio || product.price || 0)}</span>
                                                {product.stock <= 0 && <span className={styles.outOfStock}>Sin stock</span>}
                                            </div>
                                            <button className={styles.addProductBtn}><FiPlus /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Cart */}
                    <div className={styles.cartColumn}>
                        <div className={styles.cartCard}>
                            <div className={styles.cartHeader}>
                                <FiShoppingCart className={styles.cardIcon} />
                                <h2>Resumen del Pedido</h2>
                                <span className={styles.cartCount}>{cart.length}</span>
                            </div>

                            <div className={styles.cartBody}>
                                {cart.length === 0 ? (
                                    <div className={styles.emptyCart}>
                                        <FiShoppingCart />
                                        <p>Carrito vacío</p>
                                    </div>
                                ) : (
                                    <div className={styles.cartList}>
                                        {cart.map(item => (
                                            <div key={item._id} className={styles.cartItem}>
                                                <div className={styles.cartItemInfo}>
                                                    <span className={styles.cartItemName}>{item.name}</span>
                                                    <span className={styles.cartItemPrice}>{formatCurrency(item.price)} x {item.quantity}</span>
                                                </div>
                                                <div className={styles.cartItemActions}>
                                                    <button onClick={() => updateQuantity(item._id, -1)}><FiMinus /></button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item._id, 1)}><FiPlus /></button>
                                                    <button className={styles.removeItem} onClick={() => removeFromCart(item._id)}>
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={styles.cartFooter}>
                                <div className={styles.formField}>
                                    <label>Método de Pago</label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia">Transferencia</option>
                                    </select>
                                </div>
                                <div className={styles.formField}>
                                    <label>Observaciones</label>
                                    <textarea
                                        value={formData.observations}
                                        onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                                        placeholder="Notas internas..."
                                        rows="2"
                                    />
                                </div>
                                <div className={styles.totalSection}>
                                    <span>Total:</span>
                                    <span className={styles.totalAmount}>{formatCurrency(calculateTotal())}</span>
                                </div>
                                <button
                                    className={styles.submitOrder}
                                    onClick={handleSubmit}
                                    disabled={loading || cart.length === 0 || !selectedUser}
                                >
                                    <FiSave /> {loading ? 'Creando...' : 'Crear Pedido'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderCreate;
