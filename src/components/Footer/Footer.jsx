import React from 'react';
import { FiInstagram, FiFacebook, FiYoutube, FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Distributor",
        "name": "30 Bebidas",
        "image": "https://30bebidas.com/logo.png",
        "@id": "https://30bebidas.com",
        "url": "https://30bebidas.com",
        "telephone": "+5491122921805",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Distribuidora San Miguel",
            "addressLocality": "San Miguel",
            "addressRegion": "Buenos Aires",
            "postalCode": "1663",
            "addressCountry": "AR"
        },
        "sameAs": [
            "https://www.instagram.com/30bebidas"
        ]
    };

    return (
        <footer className={styles.footer}>
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <h2 className={styles.logo}>30 Bebidas</h2>
                        <p className={styles.desc}>
                            Distribuidora integral de bebidas. Especialistas en abastecimiento mayorista y minorista de cervezas, gaseosas y destilados con logística propia.
                        </p>
                        <div className={styles.social}>
                            <a href="https://www.instagram.com/30bebidas" target="_blank" rel="noopener noreferrer" title="Seguinos en Instagram"><FiInstagram /></a>
                            <a href="#" aria-label="Facebook"><FiFacebook /></a>
                            <a href="#" aria-label="YouTube"><FiYoutube /></a>
                        </div>
                    </div>

                    <div className={styles.links}>
                        <h3>Distribución</h3>
                        <ul>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/productos">Catálogo Completo</Link></li>
                            <li><Link to="/productos?categoria=Cervezas">Cervezas</Link></li>
                            <li><Link to="/about">Quiénes Somos</Link></li>
                            <li><Link to="/faq">Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contact}>
                        <h3>Centro de Distribución</h3>
                        <ul>
                            <li>San Miguel, Buenos Aires</li>
                            <li>Atención Mayorista y Minorista</li>
                            <li>ventas@30bebidas.com</li>
                            <li>+54 9 11 2292 1805</li>
                        </ul>
                        <a
                            href="https://wa.me/5491122921805"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsapp}
                        >
                            <FiMessageCircle /> <span>WhatsApp Ventas</span>
                        </a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} 30 Bebidas. Distribución Logística</p>
                    <div className={styles.dev}>
                        Brand Redesign by <span className={styles.gold}>Antigravity</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
