import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import supplierApi from '../../../api/supplier.api';
import { FiPlus, FiTruck, FiEdit, FiTrash2, FiExternalLink, FiSearch } from 'react-icons/fi';
import styles from '../AdminDashboard.module.css';

const SuppliersTab = () => {
    const { loading: contextLoading } = useOutletContext();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        notes: ''
    });

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await supplierApi.getAll();
            setSuppliers(response.data || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleCreateSupplier = async (e) => {
        e.preventDefault();
        try {
            await supplierApi.create(newSupplier);
            setIsModalOpen(false);
            setNewSupplier({ name: '', contactPerson: '', phone: '', email: '', notes: '' });
            fetchSuppliers();
        } catch (error) {
            alert('Error al crear proveedor');
        }
    };

    const handleDeleteSupplier = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
            try {
                await supplierApi.delete(id);
                fetchSuppliers();
            } catch (error) {
                alert('Error al eliminar proveedor');
            }
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contactPerson?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <div className={styles.searchBar}>
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Buscar proveedor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="premium-btn" onClick={() => setIsModalOpen(true)}>
                    <FiPlus /> Nuevo Proveedor
                </button>
            </div>

            {loading ? (
                <div className={styles.loader}>Cargando proveedores...</div>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Proveedor</th>
                            <th>Contacto</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Productos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map(supplier => (
                            <tr key={supplier._id}>
                                <td>
                                    <div className={styles.productInfo}>
                                        <div className={styles.supplierIcon}><FiTruck /></div>
                                        <span>{supplier.name}</span>
                                    </div>
                                </td>
                                <td>{supplier.contactPerson || '-'}</td>
                                <td>{supplier.phone || '-'}</td>
                                <td>{supplier.email || '-'}</td>
                                <td>{supplier.products?.length || 0} items</td>
                                <td>
                                    <div className={styles.tableActions}>
                                        <Link to={`/admin/proveedores/${supplier._id}`} className={styles.editBtn} title="Ver lista de precios">
                                            <FiExternalLink />
                                        </Link>
                                        <button onClick={() => handleDeleteSupplier(supplier._id)} className={styles.deleteBtn}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '500px' }}>
                        <div className={styles.modalHeader}>
                            <h3>Registrar Proveedor</h3>
                            <button onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateSupplier} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>Nombre de la Empresa</label>
                                <input
                                    type="text"
                                    required
                                    value={newSupplier.name}
                                    onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Persona de Contacto</label>
                                <input
                                    type="text"
                                    value={newSupplier.contactPerson}
                                    onChange={e => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                                />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Teléfono</label>
                                    <input
                                        type="text"
                                        value={newSupplier.phone}
                                        onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={newSupplier.email}
                                        onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Notas / Comentarios</label>
                                <textarea
                                    rows="3"
                                    value={newSupplier.notes}
                                    onChange={e => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                                ></textarea>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="premium-btn">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuppliersTab;
