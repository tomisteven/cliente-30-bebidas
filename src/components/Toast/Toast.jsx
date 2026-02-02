import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiCheck, FiX, FiShoppingCart } from 'react-icons/fi';
import styles from './Toast.module.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
                        <div className={styles.iconWrapper}>
                            {toast.type === 'cart' ? <FiShoppingCart /> : <FiCheck />}
                        </div>
                        <span className={styles.message}>{toast.message}</span>
                        <button className={styles.closeBtn} onClick={() => removeToast(toast.id)}>
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
