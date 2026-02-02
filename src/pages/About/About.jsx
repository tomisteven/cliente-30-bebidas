import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiShield, FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import styles from './About.module.css';
import distriWarehouse from '../../assets/banners/hero_main.png';
import distriBottles from '../../assets/banners/hero_beers.png';
import distriShowroom from '../../assets/banners/hero_spirits.png';

const About = () => {
    return (
        <div className={styles.aboutPage}>
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
                    <p>Eficiencia y escala en logística de bebidas para todo el país.</p>
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
                            <span className={styles.tag}>NUESTRA TRAYECTORIA</span>
                            <h2>Expertos en Distribución</h2>
                            <p>
                                En <strong>30 Bebidas</strong>, nos consolidamos como referentes en el abastecimiento mayorista y minorista de bebidas en Argentina.
                                Nuestra infraestructura nos permite manejar grandes volúmenes de stock con una logística ágil y precisa.
                            </p>
                            <p>
                                No solo entregamos productos; brindamos soluciones de abastecimiento para comercios, eventos y consumidores exigentes.
                                Contamos con alianzas directas con las principales marcas de cervezas, gaseosas y destilados premium.
                            </p>

                            <div className={styles.featuresList}>
                                <div className={styles.feature}>
                                    <FiCheckCircle className={styles.icon} />
                                    <span>Logística Propia de Gran Escala</span>
                                </div>
                                <div className={styles.feature}>
                                    <FiCheckCircle className={styles.icon} />
                                    <span>Precios Directos de Fábrica</span>
                                </div>
                                <div className={styles.feature}>
                                    <FiCheckCircle className={styles.icon} />
                                    <span>Atención Corporativa y Minorista</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Confianza & Local Section */}
                <section className={`${styles.section} ${styles.reversed}`}>
                    <div className={styles.grid}>
                        <motion.div
                            className={styles.textContent}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className={styles.tag}>INFRAESTRUCTURA</span>
                            <h2>Compromiso y Confiabilidad</h2>
                            <p>
                                Operamos con un centro de distribución optimizado para garantizar que cada pedido llegue en condiciones impecables.
                                Nuestra red de distribución cubre todo el país, asegurando tiempos de entrega competitivos tanto para packs como para pallets completos.
                            </p>
                            <p>
                                La transparencia en nuestras operaciones y el respaldo de miles de clientes satisfechos nos avalan como el socio estratégico ideal para tu negocio.
                            </p>

                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <h3>+10k</h3>
                                    <p>Pedidos Entregados</p>
                                </div>
                                <div className={styles.statItem}>
                                    <h3>24hs</h3>
                                    <p>Despacho Rápido</p>
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
                            <img src={distriShowroom} alt="Showroom 30 Bebidas" />
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
                        <h3>Calidad Premium</h3>
                        <p>Solo trabajamos con productos auténticos y sellados. La excelencia es innegociable.</p>
                    </motion.div>
                    <motion.div
                        className={styles.valueCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className={styles.valueIcon}><FiShield /></div>
                        <h3>Seguridad Total</h3>
                        <p>Tus compras están protegidas. Operamos con total transparencia y respaldo.</p>
                    </motion.div>
                    <motion.div
                        className={styles.valueCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={styles.valueIcon}><FiTruck /></div>
                        <h3>Envíos a todo el País</h3>
                        <p>Llegamos a cada rincón de Argentina con embalajes seguros y tiempos rápidos.</p>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default About;
