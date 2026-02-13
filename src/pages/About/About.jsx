import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiShield, FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import styles from './About.module.css';
import SEO from '../../components/SEO/SEO';
import distriWarehouse from '../../assets/banners/hero_main.png';
import distriBottles from '../../assets/banners/hero_beers.png';
import distriShowroom from '../../assets/banners/hero_spirits.png';

const About = () => {
    return (
        <div className={styles.aboutPage}>
            <SEO
                title="Nosotros | Distribuidora 30 Bebidas"
                description="Conocé la historia detrás de 30 Bebidas. Dos emprendedores de Malvinas Argentinas abasteciendo a kioscos y almacenes con la mejor logística."
                keywords="nosotros distribuidora, 30 bebidas historia, emprendedores malvinas argentinas, distribucion bebidas polvorines"
            />
            {/* Hero Section */}
            <div className={styles.hero} style={{ backgroundImage: `url(${distriWarehouse})` }}>
                <div className={styles.overlay}></div>
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Distribuidora 30 Bebidas</h1>
                    <p>Potenciando los comercios de nuestra zona con logística eficiente y precios directos.</p>
                </motion.div>
            </div>

            <div className="container">
                {/* Quiénes Somos Section */}
                <section className={styles.section}>
                    <div className={styles.grid}>
                        <motion.div
                            className={styles.imageWrapper}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <img src={distriBottles} alt="Stock 30 Bebidas" />
                            <div className={styles.imageDecor}></div>
                        </motion.div>
                        <motion.div
                            className={styles.textContent}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className={styles.tag}>NUESTRA HISTORIA</span>
                            <h2>Dos Emprendedores, Una Misión</h2>
                            <p>
                                Somos de <strong>Malvinas Argentinas</strong>, específicamente de la zona de Los Polvorines.
                                Nacimos como un proyecto de dos emprendedores que vieron la necesidad de brindar una logística más humana y eficiente a los comercios de barrio.
                            </p>
                            <p>
                                Entendemos el esfuerzo de cada kiosquero y almacenero porque compartimos ese mismo espíritu.
                                Por eso, nuestra misión es ser el socio estratégico que necesitás, garantizando stock constante de las principales marcas y una entrega que no te falla.
                            </p>

                            <div className={styles.featuresList}>
                                <div className={styles.feature}>
                                    <FiCheckCircle className={styles.icon} />
                                    <span>Atención Directa y Personalizada</span>
                                </div>
                                <div className={styles.feature}>
                                    <FiCheckCircle className={styles.icon} />
                                    <span>Entrega Gratuita en Zonas de Cercanía</span>
                                </div>
                                <div className={styles.feature}>
                                    <FiCheckCircle className={styles.icon} />
                                    <span>Apoyo al Comercio Local</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Compromiso Section */}
                <section className={`${styles.section} ${styles.reversed}`}>
                    <div className={styles.grid}>
                        <motion.div
                            className={styles.textContent}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className={styles.tag}>NUESTRO COMPROMISO</span>
                            <h2>Creciendo Junto a Tu Negocio</h2>
                            <p>
                                No solo distribuimos bebidas; construimos relaciones. Abastecemos a cientos de puntos de venta con la seriedad que el rubro exige.
                                Ya sea que necesites packs para tu heladera o pallets completos para tu depósito, en <strong>30 Bebidas</strong> encontrás el respaldo que buscás.
                            </p>
                            <p>
                                Seguimos innovando en nuestra logística desde Los Polvorines hacia toda la zona, incorporando tecnología para que hagas tus pedidos de la forma más rápida y sencilla.
                            </p>

                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <h3>Villa de Mayo</h3>
                                    <p>Envío Gratis</p>
                                </div>
                                <div className={styles.statItem}>
                                    <h3>Polvorines</h3>
                                    <p>Zona Centro</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className={styles.imageWrapper}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <img src={distriShowroom} alt="Distribución 30 Bebidas" />
                            <div className={styles.imageDecorReversed}></div>
                        </motion.div>
                    </div>
                </section>

                {/* Values Section */}
                <section className={styles.valuesSection}>
                    <motion.div
                        className={styles.valueCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className={styles.valueIcon}><FiAward /></div>
                        <h3>Precios Competitivos</h3>
                        <p>Trabajamos para que tu margen de ganancia sea el mejor, con precios por pack y pallet imbatibles.</p>
                    </motion.div>
                    <motion.div
                        className={styles.valueCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className={styles.valueIcon}><FiShield /></div>
                        <h3>Confianza Total</h3>
                        <p>Somos vecinos de la zona. Nuestra mayor garantía es el cumplimiento y la palabra.</p>
                    </motion.div>
                    <motion.div
                        className={styles.valueCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={styles.valueIcon}><FiTruck /></div>
                        <h3>Logística Ágil</h3>
                        <p>Repartos coordinados para que nunca te quedes sin stock en los días de mayor venta.</p>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default About;
