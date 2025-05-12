"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";
import api from "@/app/api/axiosConfig";
import styles from "@/styles/Dashboard.module.css";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/orders/recent')
                ]);

                setStats(statsRes.data);
                setRecentOrders(ordersRes.data);
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Cargando...</div>;
    }

    return (
        <Container className={styles.dashboardContainer}>
            <h1 className={styles.title}>Panel de Administración</h1>
            
            {/* Tarjetas de estadísticas */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <h3>Usuarios</h3>
                            <p className={styles.statNumber}>{stats.totalUsers}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <h3>Productos</h3>
                            <p className={styles.statNumber}>{stats.totalProducts}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className={styles.statCard}>
                        <Card.Body>
                            <h3>Órdenes</h3>
                            <p className={styles.statNumber}>{stats.totalOrders}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Tabla de órdenes recientes */}
            <Card className={styles.tableCard}>
                <Card.Header>
                    <h2>Órdenes Recientes</h2>
                </Card.Header>
                <Card.Body>
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user.nombre}</td>
                                    <td>${order.total}</td>
                                    <td>
                                        <span className={`badge bg-${order.estado === 'completado' ? 'success' : 'warning'}`}>
                                            {order.estado}
                                        </span>
                                    </td>
                                    <td>{new Date(order.fecha).toLocaleDateString()}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm">
                                            Ver Detalles
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Acciones rápidas */}
            <Row className="mt-4">
                <Col>
                    <Card className={styles.actionCard}>
                        <Card.Header>
                            <h2>Acciones Rápidas</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className={styles.actionButtons}>
                                <Button variant="primary" className={styles.actionButton}>
                                    Agregar Producto
                                </Button>
                                <Button variant="success" className={styles.actionButton}>
                                    Gestionar Usuarios
                                </Button>
                                <Button variant="info" className={styles.actionButton}>
                                    Ver Reportes
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
} 