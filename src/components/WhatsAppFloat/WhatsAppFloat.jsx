import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppFloat.module.css';

const WhatsAppFloat = () => {
    const whatsappUrl = 'https://wa.me/5491132939545';

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.floatBtn}
            aria-label="Contáctanos por WhatsApp"
        >
            <FaWhatsapp className={styles.icon} />
            <span className={styles.tooltip}>¡Contáctanos por WhatsApp!</span>
        </a>
    );
};

export default WhatsAppFloat;
