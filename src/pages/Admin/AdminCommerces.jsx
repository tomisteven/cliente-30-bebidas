import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiShoppingCart, FiPower } from 'react-icons/fi';
import authApi from '../../api/auth.api';
import CommerceFormModal from './components/CommerceFormModal';
import styles from './AdminCommerces.module.css';

const AdminCommerces = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await authApi.getUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUpdate = async (formData) => {
        try {
            if (selectedUser) {
                await authApi.updateUser(selectedUser._id, formData);
            } else {
                await authApi.createUser(formData);
            }
            fetchUsers();
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error al guardar: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este comercio/usuario?')) {
            try {
                await authApi.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await authApi.toggleUserStatus(id);
            fetchUsers();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleCreateOrder = (user) => {
        navigate('/admin/pedidos/nuevo', { state: { user } });
    };

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.commerceName && user.commerceName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Red de Comercios</h1>
                <button
                    className={styles.addBtn}
                    onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                >
                    <FiPlus /> Nuevo Comercio
                </button>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o comercio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Comercio</th>
                            <th>Contacto</th>
                            <th>Ubicación</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className={!user.isActive ? styles.inactiveRow : ''}>
                                <td className={styles.commerceCell}>
                                    <span className={styles.commerceName}>{user.commerceName || 'Sin Nombre'}</span>
                                    <span className={styles.userEmail}>{user.email}</span>
                                </td>
                                <td>
                                    <div className={styles.contactInfo}>
                                        <span>{user.nombre}</span>
                                        <small>{user.phone || '-'}</small>
                                    </div>
                                </td>
                                <td>{user.locality || user.address || '-'}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[user.commerceType?.toLowerCase() || 'particular']}`}>
                                        {user.commerceType || 'Particular'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className={styles.actionsCell}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => handleCreateOrder(user)}
                                        title="Crear Pedido"
                                    >
                                        <FiShoppingCart />
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                        title="Editar"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${!user.isActive ? styles.activateBtn : styles.deactivateBtn}`}
                                        onClick={() => handleToggleStatus(user._id)}
                                        title={user.isActive ? "Desactivar" : "Activar"}
                                    >
                                        <FiPower />
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        onClick={() => handleDelete(user._id)}
                                        title="Eliminar"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CommerceFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateUpdate}
                initialData={selectedUser}
            />
        </div>
    );
};

export default AdminCommerces;
