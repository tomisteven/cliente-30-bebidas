import React, { useState, useEffect } from 'react';
import styles from './CommerceFormModal.module.css';

const CommerceFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        commerceName: '',
        address: '',
        phone: '',
        locality: '',
        commerceType: 'Particular'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                email: initialData.email || '',
                password: '', // Password is not populated for security
                commerceName: initialData.commerceName || '',
                address: initialData.address || '',
                phone: initialData.phone || '',
                locality: initialData.locality || '',
                commerceType: initialData.commerceType || 'Particular'
            });
        } else {
            setFormData({
                nombre: '',
                email: '',
                password: '',
                commerceName: '',
                address: '',
                phone: '',
                locality: '',
                commerceType: 'Particular'
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{initialData ? 'Editar Comercio/Usuario' : 'Nuevo Comercio/Usuario'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Nombre de Contacto *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Juan Perez"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email (Usuario) *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="usuario@email.com"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Contraseña {initialData && '(Dejar en blanco para mantener)'}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={initialData ? "******" : "Contraseña"}
                                required={!initialData}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nombre del Comercio</label>
                            <input
                                type="text"
                                name="commerceName"
                                value={formData.commerceName}
                                onChange={handleChange}
                                placeholder="Kiosco El Paso"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Av. Principal 123"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="11 1234 5678"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Localidad / Zona</label>
                            <input
                                type="text"
                                name="locality"
                                value={formData.locality}
                                onChange={handleChange}
                                placeholder="San Miguel"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tipo de Comercio</label>
                            <select
                                name="commerceType"
                                value={formData.commerceType}
                                onChange={handleChange}
                            >
                                <option value="Particular">Particular</option>
                                <option value="Almacen">Almacén</option>
                                <option value="Kiosco">Kiosco</option>
                                <option value="Supermercado">Supermercado</option>
                                <option value="Revendedor">Revendedor</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" className={styles.submitBtn}>Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommerceFormModal;
