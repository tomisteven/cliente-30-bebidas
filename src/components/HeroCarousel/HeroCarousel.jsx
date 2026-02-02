import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HeroCarousel.module.css';

import bannerSodas from '../../assets/banners/hero_sodas.png';
import bannerDistri from '../../assets/banners/hero_distribution.png';
import bannerVodka from '../../assets/banners/hero_vodka.png';

const images = [
    {
        url: bannerSodas,
        title: 'TU BEBIDA FAVORITA',
        subtitle: 'Coca-Cola, Fanta, Manaos y mucho más al mejor precio',
        buttonText: 'VER GASEOSAS',
        link: '/productos?categoria=Gaseosas'
    },
    {
        url: bannerDistri,
        title: 'VENTA MAYORISTA',
        subtitle: 'Abastecemos tu negocio con logística rápida en todo San Miguel',
        buttonText: 'PRECIOS POR PACK',
        link: '/productos'
    },
    {
        url: bannerVodka,
        title: 'PREVIA Y EVENTOS',
        subtitle: 'Vodkas, Aperitivos y Energizantes para tus mejores momentos',
        buttonText: 'VER ALCOHOL',
        link: '/productos?categoria=Vinos'
    }
];

const HeroCarousel = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    const handleButtonClick = (slide) => {
        if (slide.action === 'popup') {
            window.dispatchEvent(new CustomEvent('openDiscountPopup'));
        } else if (slide.isExternal) {
            window.open(slide.link, '_blank', 'noopener,noreferrer');
        } else if (slide.link) {
            window.location.href = slide.link;
        }
    };

    return (
        <div className={styles.carousel}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    className={styles.slide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                >
                    <div
                        className={styles.image}
                        style={{ backgroundImage: `url(${images[index].url})` }}
                    />
                    <div className={styles.overlay} />
                    <div className={styles.content}>

                        <motion.h2
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className={styles.title}
                        >
                            {images[index].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className={styles.subtitle}
                        >
                            {images[index].subtitle}
                        </motion.p>
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.1 }}
                            className={styles.ctaBtn}
                            onClick={() => handleButtonClick(images[index])}
                        >
                            {images[index].buttonText}
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className={styles.indicators}>
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`${styles.dot} ${index === i ? styles.active : ''}`}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
