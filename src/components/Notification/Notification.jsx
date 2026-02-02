import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import styles from './Notification.module.css';

const Notification = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <FiCheckCircle className={styles.icon} />,
        error: <FiAlertCircle className={styles.icon} />
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`${styles.notification} ${styles[type]}`}
            style={{ pointerEvents: 'auto' }}
        >
            <div className={styles.content}>
                {icons[type]}
                <p className={styles.message}>{message}</p>
            </div>
            <button onClick={onClose} className={styles.closeBtn}>
                <FiX />
            </button>
        </motion.div>
    );
};

export default Notification;
