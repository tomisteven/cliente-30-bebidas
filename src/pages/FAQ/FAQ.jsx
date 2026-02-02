import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiSearch, FiShoppingBag, FiTruck, FiShield, FiStar, FiAward, FiInfo, FiKey, FiMail } from 'react-icons/fi';
import styles from './FAQ.module.css';

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
                    a: 'Es muy simple: navegá por nuestro catálogo, añadí tus fragancias favoritas al carrito y hacé clic en el icono de la bolsa para iniciar el checkout. Seguí los pasos para completar tus datos de envío y pago.'
                },
                {
                    q: '¿Cuáles son los métodos de pago aceptados?',
                    a: 'Aceptamos transferencias bancarias, tarjetas de crédito/débito a través de plataformas seguras y efectivo para retiros coordinados.'
                }
            ]
        },
        {
            category: 'Envíos y Seguimiento',
            icon: <FiTruck />,
            questions: [
                {
                    q: '¿Realizan envíos a todo el país?',
                    a: 'Sí, llegamos a cada rincón de Argentina a través de Correo Argentino y Andreani. El costo de envío se calcula automáticamente al ingresar tu código postal en el checkout.'
                },
                {
                    q: '¿Cómo puedo seguir mi pedido?',
                    a: 'Una vez que tu pedido sea despachado, recibirás un correo electrónico con el número de seguimiento y un enlace directo para monitorear el trayecto de tu paquete.'
                }
            ]
        },
        {
            category: 'Productos y Calidad',
            icon: <FiShield />,
            questions: [
                {
                    q: '¿Son originales los perfumes?',
                    a: 'Absolutamente. En Al Vuelo Importados solo trabajamos con productos 100% originales importados directamente de los Emiratos Árabes y las casas de perfumería más prestigiosas.'
                },
                {
                    q: '¿Qué es un perfume de "Nicho"?',
                    a: 'Los perfumes nicho son creaciones artísticas producidas en menor escala, con ingredientes de altísima calidad y composiciones únicas que no encontrarás en la perfumería comercial masiva.'
                },
                {
                    q: '¿Cómo busco productos específicos?',
                    a: 'Podés usar la barra de búsqueda en la parte superior para buscar por marca o nombre. También contamos con filtros por categoría (Nicho, Miniaturas, Lattafa, etc.) para facilitar tu búsqueda.'
                }
            ]
        },
        {
            category: 'Mayoristas',
            icon: <FiAward />,
            questions: [
                {
                    q: '¿Qué beneficios tengo como mayorista?',
                    a: 'Los clientes registrados como mayoristas acceden a una lista de precios preferencial (Zona Mayorista), stock exclusivo y atención personalizada para compras por bulto.'
                },
                {
                    q: '¿Hay un monto mínimo de compra mayorista?',
                    a: 'Sí, para mantener la condición de mayorista existe un monto mínimo de compra inicial. Ponete en contacto con nuestro equipo para recibir la tabla de condiciones vigente.'
                }
            ]
        },
        {
            category: 'Soporte',
            icon: <FiMail />,
            questions: [
                {
                    q: '¿Cómo puedo contactarlos por otra duda?',
                    a: 'Podés escribirnos a nuestro WhatsApp de atención al cliente o enviarnos un mail a través de nuestra sección de contacto. Respondemos todas las consultas en menos de 24hs hábiles.'
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
                title="Centro de Ayuda / FAQ"
                description="¿Tenes dudas sobre cómo comprar, envíos o medios de pago? Consultá nuestra sección de preguntas frecuentes."
                keywords="preguntas frecuentes, ayuda, como comprar, envios argentina, pagos"
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
                        Todo lo que necesitas saber sobre Al Vuelo Importados
                    </motion.p>

                    <div className={styles.searchBox}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscá tu duda (ej: envíos, mayoristas, pagos)..."
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
                            <p>Si no encontrás lo que buscás, nuestro equipo está listo para ayudarte.</p>
                            <button className="premium-btn">Contactar Soporte</button>
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
