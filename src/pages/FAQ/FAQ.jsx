import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiSearch, FiShoppingBag, FiTruck, FiShield, FiStar, FiAward, FiInfo, FiKey, FiMail } from 'react-icons/fi';
import styles from './FAQ.module.css';
import SEO from '../../components/SEO/SEO';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: 'Guía de Compra',
            icon: <FiShoppingBag />,
            questions: [
                {
                    q: '¿Cómo realizo una compra?',
                    a: 'Es muy simple: navegá por nuestro catálogo, seleccioná tus bebidas favoritas (por unidad, pack o pallet) y añadilas al carrito. Una vez listo, hacé clic en el icono de la bolsa para iniciar el checkout. Si sos comerciante, no olvides registrarte para acceder a precios de volumen.'
                },
                {
                    q: '¿Cuáles son los métodos de pago?',
                    a: 'Para tu comodidad, aceptamos Efectivo y Transferencias bancarias. Los detalles para la transferencia se proporcionan al finalizar el pedido.'
                }
            ]
        },
        {
            category: 'Envíos y Entregas',
            icon: <FiTruck />,
            questions: [
                {
                    q: '¿Qué zonas tienen envío sin cargo?',
                    a: 'Contamos con envío SIN CARGO en las zonas de Villa de Mayo, Don Torcuato, Adolfo Sourdeaux y Los Polvorines.'
                },
                {
                    q: '¿Hacen repartos a otras zonas?',
                    a: 'Sí, realizamos repartos en otras zonas con tarifas mínimas que dependen de la cantidad de packs solicitados. Consultanos por tu zona específica para darte el mejor costo.'
                },
                {
                    q: '¿Venden por Pallet?',
                    a: '¡Claro que sí! Somos especialistas en bulto cerrado y venta por pallet para abastecer grandes consumos o comercios a los mejores precios del mercado.'
                }
            ]
        },
        {
            category: 'Comercios y Almacenes',
            icon: <FiAward />,
            questions: [
                {
                    q: '¿Venden a kioscos y almacenes?',
                    a: 'Ese es nuestro fuerte. Somos dos emprendedores dedicados a facilitar el stock de comercios de barrio, kioscos y almacenes de la zona con precios competitivos y logística confiable.'
                },
                {
                    q: '¿Tienen precios exclusivos para mayoristas?',
                    a: 'Sí, contamos con escalas de precios según el volumen de compra. Al registrarte como cliente mayorista podrás ver los descuentos por pack y por pallet en todo el catálogo.'
                }
            ]
        },
        {
            category: 'Soporte y Contacto',
            icon: <FiMail />,
            questions: [
                {
                    q: '¿Dónde están ubicados?',
                    a: 'Somos de Malvinas Argentinas, específicamente de la zona de Los Polvorines. Desde nuestro centro logístico distribuimos a toda la región.'
                },
                {
                    q: '¿Cómo puedo contactarlos?',
                    a: 'Podés escribirnos directamente por WhatsApp haciendo clic en el botón flotante de la web. Respondemos al toque para coordinar tu entrega.'
                }
            ]
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const filteredFaqs = faqs.map(section => ({
        ...section,
        questions: section.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.questions.length > 0);

    return (
        <div className={styles.faqPage}>
            <SEO
                title="Centro de Ayuda / FAQ | 30 Bebidas"
                description="Consultá las zonas de envío gratis, medios de pago y beneficios para comercios en nuestra distribuidora de bebidas en Malvinas Argentinas."
                keywords="preguntas frecuentes, ayuda, envios gratis polvorines, venta pallet bebidas, distribuidora malvinas argentinas"
            />
            <header className={styles.header}>
                <div className="container">
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Centro de Ayuda
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Todo lo que necesitás saber sobre Distribuidora 30 Bebidas
                    </motion.p>

                    <div className={styles.searchBox}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscá tu duda (ej: envíos, pallet, pagos)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            </header>

            <div className="container">
                <div className={styles.faqLayout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.quickHelp}>
                            <FiInfo />
                            <h3>¿Necesitás más?</h3>
                            <p>Si no encontrás lo que buscás, escribinos por WhatsApp para una atención directa.</p>
                            <button className="premium-btn">Chatea con nosotros</button>
                        </div>
                    </aside>

                    <main className={styles.content}>
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((section, sIdx) => (
                                <section key={sIdx} className={styles.section}>
                                    <h2 className={styles.sectionTitle}>
                                        <span className={styles.sectionIcon}>{section.icon}</span>
                                        {section.category}
                                    </h2>
                                    <div className={styles.accordionList}>
                                        {section.questions.map((item, qIdx) => {
                                            const globalIdx = `${sIdx}-${qIdx}`;
                                            const isOpen = activeIndex === globalIdx;
                                            return (
                                                <div
                                                    key={qIdx}
                                                    className={`${styles.accordionItem} ${isOpen ? styles.active : ''}`}
                                                >
                                                    <button
                                                        className={styles.accordionHeader}
                                                        onClick={() => toggleAccordion(globalIdx)}
                                                    >
                                                        <span>{item.q}</span>
                                                        <FiChevronDown className={styles.chevron} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                className={styles.accordionBody}
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <p>{item.a}</p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <p>No encontramos respuestas para "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="outline-btn">Ver todas las preguntas</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
