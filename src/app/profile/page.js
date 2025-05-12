"use client";
import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import api from "../api/axiosConfig";
import styles from "@/styles/Profile.module.css";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        direccion: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
                setFormData({
                    nombre: response.data.nombre || "",
                    email: response.data.email || "",
                    telefono: response.data.telefono || "",
                    direccion: response.data.direccion || ""
                });
            } catch (err) {
                setError("Error al cargar el perfil");
                if (err.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', formData);
            setUser(response.data);
            setEditMode(false);
        } catch (err) {
            setError("Error al actualizar el perfil");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return <div className={styles.loading}>Cargando...</div>;
    }

    return (
        <Container className={styles.profileContainer}>
            <h1 className={styles.title}>Mi Perfil</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                <Col md={4}>
                    <Card className={styles.sidebar}>
                        <Card.Body>
                            <div className={styles.avatar}>
                                <img 
                                    src={user?.avatar || "/default-avatar.png"} 
                                    alt="Avatar"
                                    className={styles.avatarImage}
                                />
                            </div>
                            <h3 className={styles.userName}>{user?.nombre}</h3>
                            <p className={styles.userEmail}>{user?.email}</p>
                            <Button 
                                variant="outline-danger" 
                                onClick={handleLogout}
                                className={styles.logoutButton}
                            >
                                Cerrar Sesión
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className={styles.mainContent}>
                        <Card.Body>
                            <div className={styles.header}>
                                <h2>Información Personal</h2>
                                <Button 
                                    variant={editMode ? "secondary" : "primary"}
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    {editMode ? "Cancelar" : "Editar"}
                                </Button>
                            </div>

                            {editMode ? (
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Dirección</label>
                                        <textarea
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className={styles.textarea}
                                        />
                                    </div>
                                    <Button type="submit" variant="success">
                                        Guardar Cambios
                                    </Button>
                                </form>
                            ) : (
                                <div className={styles.info}>
                                    <div className={styles.infoItem}>
                                        <strong>Nombre:</strong> {user?.nombre}
                                    </div>
                                    <div className={styles.infoItem}>
                                        <strong>Email:</strong> {user?.email}
                                    </div>
                                    <div className={styles.infoItem}>
                                        <strong>Teléfono:</strong> {user?.telefono || "No especificado"}
                                    </div>
                                    <div className={styles.infoItem}>
                                        <strong>Dirección:</strong> {user?.direccion || "No especificada"}
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
} 