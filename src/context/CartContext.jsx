import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [appliedDiscount, setAppliedDiscount] = useState(null);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, type = 'product', unitType = 'unit') => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(i =>
                i._id === item._id &&
                i.type === type &&
                i.unitType === unitType
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += 1;
                return newCart;
            }

            return [...prevCart, { ...item, type, unitType, quantity: 1 }];
        });
    };

    const removeFromCart = (id, type, unitType = 'unit') => {
        setCart(prevCart => prevCart.filter(item =>
            !(item._id === id && item.type === type && item.unitType === unitType)
        ));
    };

    const updateQuantity = (id, type, quantity, unitType = 'unit') => {
        if (quantity < 1) return removeFromCart(id, type, unitType);

        setCart(prevCart => prevCart.map(item =>
            (item._id === id && item.type === type && item.unitType === unitType)
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
        setAppliedDiscount(null);
    };

    // Calcular el precio actual basado en la cantidad y el tipo de unidad
    const getItemPrice = (item) => {
        if (item.type === 'combo') return item.finalPrice;

        // Lógica de Precios Mayoristas de Bebidas
        const wholesale = item.wholesale || {};

        if (item.unitType === 'pack') {
            return wholesale.pack?.price || (item.precio * (wholesale.pack?.unitsPerPack || 6));
        }

        if (item.unitType === 'pallet') {
            return wholesale.pallet?.price || item.precio; // Depende de cómo se defina el precio del pallet
        }

        // Si es unidad, aplicar bulkPrices si existen
        if (!item.bulkPrices || item.bulkPrices.length === 0) {
            return wholesale.unit?.price || item.precio;
        }

        const applicablePrice = item.bulkPrices
            .filter(bp => item.quantity >= bp.minQuantity)
            .sort((a, b) => b.minQuantity - a.minQuantity)[0];

        return applicablePrice ? applicablePrice.price : (wholesale.unit?.price || item.precio);
    };

    const cartTotal = cart.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const getDiscountedTotal = () => {
        if (!appliedDiscount) return cartTotal;
        if (appliedDiscount.type === 'fixed') {
            return Math.max(0, cartTotal - appliedDiscount.value);
        } else if (appliedDiscount.type === 'percentage') {
            return cartTotal * (1 - appliedDiscount.value / 100);
        }
        return cartTotal;
    };

    const applyDiscount = (discountData) => setAppliedDiscount(discountData);
    const removeDiscount = () => setAppliedDiscount(null);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getItemPrice,
            cartTotal,
            cartCount,
            appliedDiscount,
            applyDiscount,
            removeDiscount,
            getDiscountedTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
