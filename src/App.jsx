import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './components/Toast/Toast';
// import CurrencyBanner from './components/CurrencyBanner/CurrencyBanner';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import WhatsAppFloat from './components/WhatsAppFloat/WhatsAppFloat';
/* import DiscountPopup from './components/DiscountPopup/DiscountPopup'; */

// Pages
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Combos from './pages/Combos/Combos';
import Checkout from './pages/Checkout/Checkout';
import Profile from './pages/Profile/Profile';
import AdminLayout from './pages/Admin/AdminLayout';
import Nicho from './pages/Nicho/Nicho';
import Miniaturas from './pages/Miniaturas/Miniaturas';
import FAQ from './pages/FAQ/FAQ';
import About from './pages/About/About';
import ProductForm from './pages/Admin/ProductForm';
import ComboForm from './pages/Admin/ComboForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Admin Tab Components
import ProductsTab from './pages/Admin/components/ProductsTab';
import CombosTab from './pages/Admin/components/CombosTab';
import UsersTab from './pages/Admin/components/UsersTab';
import OrdersTab from './pages/Admin/components/OrdersTab';
import EmailsTab from './pages/Admin/components/EmailsTab';
import DiscountsTab from './pages/Admin/components/DiscountsTab';
import SettingsTab from './pages/Admin/components/SettingsTab';
import SuppliersTab from './pages/Admin/components/SuppliersTab';
import SupplierDetail from './pages/Admin/components/SupplierDetail';

import AdminReports from './pages/Admin/AdminReports';
import AdminCommerces from './pages/Admin/AdminCommerces';
import AdminOrderCreate from './pages/Admin/AdminOrderCreate';

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <AuthProvider>
            <CurrencyProvider>
                <ThemeProvider>
                    <CartProvider>
                        <ToastProvider>
                            <NotificationProvider>
                                <Router>
                                    <div className="app">
                                        {/* <CurrencyBanner /> */}
                                        <Header toggleCart={() => setIsCartOpen(true)} />
                                        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

                                        <main style={{ minHeight: '80vh' }}>
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/productos" element={<Products />} />
                                                <Route path="/combos" element={<Combos />} />
                                                <Route path="/checkout" element={<Checkout />} />
                                                <Route path="/perfil" element={<Profile />} />
                                                <Route path="/nicho" element={<Nicho />} />
                                                <Route path="/miniaturas" element={<Miniaturas />} />
                                                <Route path="/faq" element={<FAQ />} />
                                                <Route path="/nosotros" element={<About />} />
                                                <Route path="/comercio" element={<Navigate to="/admin/comercios" replace />} />

                                                {/* Admin Routes - Nested */}
                                                <Route path="/admin" element={
                                                    <ProtectedRoute adminOnly>
                                                        <AdminLayout />
                                                    </ProtectedRoute>
                                                }>
                                                    <Route index element={<Navigate to="/admin/productos" replace />} />
                                                    <Route path="productos" element={<ProductsTab />} />
                                                    <Route path="combos" element={<CombosTab />} />
                                                    <Route path="comercios" element={<AdminCommerces />} />
                                                    <Route path="comercio" element={<Navigate to="/admin/comercios" replace />} />
                                                    <Route path="usuarios" element={<UsersTab />} />
                                                    <Route path="pedidos" element={<OrdersTab />} />
                                                    <Route path="emails" element={<EmailsTab />} />
                                                    <Route path="cupones" element={<DiscountsTab />} />
                                                    <Route path="configuracion" element={<SettingsTab />} />
                                                    <Route path="proveedores" element={<SuppliersTab />} />
                                                    <Route path="proveedores/:id" element={<SupplierDetail />} />
                                                    <Route path="reportes" element={<AdminReports />} />
                                                </Route>

                                                <Route path="/admin/pedidos/nuevo" element={
                                                    <ProtectedRoute adminOnly>
                                                        <AdminOrderCreate />
                                                    </ProtectedRoute>
                                                } />

                                                {/* Admin Forms - Standalone */}
                                                <Route path="/admin/crear-producto" element={
                                                    <ProtectedRoute adminOnly>
                                                        <ProductForm />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/admin/editar-producto/:id" element={
                                                    <ProtectedRoute adminOnly>
                                                        <ProductForm />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/admin/crear-combo" element={
                                                    <ProtectedRoute adminOnly>
                                                        <ComboForm />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/admin/editar-combo/:id" element={
                                                    <ProtectedRoute adminOnly>
                                                        <ComboForm />
                                                    </ProtectedRoute>
                                                } />

                                                <Route path="*" element={
                                                    <div style={{ padding: '200px 0', textAlign: 'center' }}>
                                                        <h1>404</h1>
                                                        <p>Página no encontrada</p>
                                                    </div>
                                                } />
                                            </Routes>
                                        </main>

                                        <Footer />
                                        <WhatsAppFloat />
                                        {/* <DiscountPopup /> */}
                                    </div>
                                </Router>
                            </NotificationProvider>
                        </ToastProvider>
                    </CartProvider>
                </ThemeProvider>
            </CurrencyProvider>
        </AuthProvider>
    );
}

export default App;
