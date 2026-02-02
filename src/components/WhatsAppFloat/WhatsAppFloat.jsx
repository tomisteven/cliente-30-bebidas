import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppFloat.module.css';

const WhatsAppFloat = () => {
    const channelUrl = 'https://whatsapp.com/channel/0029VbBKXH8HFxP7qVpbCx1I';

    return (
        <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.floatBtn}
            aria-label="Únete al grupo de WhatsApp"
        >
            <FaWhatsapp className={styles.icon} />
            <span className={styles.tooltip}>¡Únete al canal mayorista!</span>
        </a>
    );
};

export default WhatsAppFloat;
