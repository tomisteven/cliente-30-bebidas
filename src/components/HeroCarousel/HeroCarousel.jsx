import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HeroCarousel.module.css';

import bannerCoca from '../../assets/banners/banner_coca_cola_premium_1770950818819.png';
import bannerFernet from '../../assets/banners/banner_fernet_branca_premium_1770950799228.png';
import bannerDistri from '../../assets/banners/hero_distribution_v2_1770950893353.png';
import bannerMain from '../../assets/banners/hero_main.png';

const images = [
    {
        url: bannerCoca,
        tag: 'LO MEJOR EN GASEOSAS',
        title: 'COCA-COLA ORIGINAL',
        subtitle: 'El sabor que todos prefieren, siempre disponible y al mejor precio mayorista.',
        buttonText: 'COMPRAR COCA',
        link: '/productos?categoria=Gaseosas'
    },
    {
        url: bannerFernet,
        tag: 'EL CLÁSICO DE SIEMPRE',
        title: 'FERNET BRANCA',
        subtitle: 'Especialistas en la bebida favorita de los argentinos. Stock permanente para comercios.',
        buttonText: 'VER FERNET',
        link: '/productos?categoria=Vinos'
    },
    {
        url: bannerMain,
        tag: 'VARIEDAD COMPLETA',
        title: 'BEBIDAS PREMIUM',
        subtitle: 'Explorá nuestro catálogo de marcas nacionales e importadas con entrega inmediata.',
        buttonText: 'CATÁLOGO',
        link: '/productos'
    },
    {
        url: bannerDistri,
        tag: 'DISTRIBUCIÓN DIRECTA',
        title: 'LOGÍSTICA RÁPIDA',
        subtitle: 'Abastecemos tu negocio en Malvinas Argentinas y alrededores con flota propia.',
        buttonText: 'MÁS INFO',
        link: '/nosotros'
    }
];

const HeroCarousel = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 8000);
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
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className={styles.tag}
                        >
                            {images[index].tag}
                        </motion.span>
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
