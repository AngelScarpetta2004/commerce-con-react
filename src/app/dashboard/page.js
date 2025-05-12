"use client";

import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Table, Modal, Form } from "react-bootstrap";
import styles from "@/styles/Dashboard.module.css";
import destacados from "@/data/destacados.json";

export default function Dashboard() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: ""
    });
    const [mounted, setMounted] = useState(false);

    // Refs para scroll suave
    const usuariosRef = useRef(null);
    const productosRef = useRef(null);
    const ordenesRef = useRef(null);
    const ingresosRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        setProductos(destacados);
        setLoading(false);
    }, []);

    const handleShowModal = (product = null) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                nombre: product.nombre,
                descripcion: product.descripcion,
                precio: product.precio,
                imagen: product.imagen
            });
        } else {
            setSelectedProduct(null);
            setFormData({
                nombre: "",
                descripcion: "",
                precio: "",
                imagen: ""
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para guardar el producto
        handleCloseModal();
    };

    // Scroll suave a la sección
    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!mounted) {
        return null;
    }

    if (loading) {
        return (
            <Container fluid className={styles.dashboardContainer}>
                <div className={styles.loading}>Cargando...</div>
            </Container>
        );
    }

    return (
        <Container fluid className={styles.dashboardContainer}>
            <Row className="mb-4">
                <Col>
                    <h1 className={styles.title}>Panel de Control</h1>
                </Col>
            </Row>

            {/* Tarjetas de estadísticas como enlaces */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className={`${styles.statCard} ${styles.futurCard}`} onClick={() => scrollToSection(usuariosRef)} style={{cursor: 'pointer'}}>
                        <Card.Body>
                            <h3>Usuarios</h3>
                            <p className={styles.statNumber}>1,234</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={`${styles.statCard} ${styles.futurCard}`} onClick={() => scrollToSection(productosRef)} style={{cursor: 'pointer'}}>
                        <Card.Body>
                            <h3>Productos</h3>
                            <p className={styles.statNumber}>{productos.length}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={`${styles.statCard} ${styles.futurCard}`} onClick={() => scrollToSection(ordenesRef)} style={{cursor: 'pointer'}}>
                        <Card.Body>
                            <h3>Órdenes</h3>
                            <p className={styles.statNumber}>567</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={`${styles.statCard} ${styles.futurCard}`} onClick={() => scrollToSection(ingresosRef)} style={{cursor: 'pointer'}}>
                        <Card.Body>
                            <h3>Ingresos</h3>
                            <p className={styles.statNumber}>$45,678</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Sección Usuarios */}
            <Row className="mb-4" ref={usuariosRef} id="usuarios">
                <Col>
                    <Card className={styles.futurSectionCard}>
                        <Card.Header className={styles.futurSectionHeader}>
                            <h2 className="mb-0">Gestión de Usuarios</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>Próximamente: Listado y gestión de usuarios.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Sección Productos */}
            <Row className="mb-4" ref={productosRef} id="productos">
                <Col>
                    <Card className={styles.futurSectionCard}>
                        <Card.Header className={styles.futurSectionHeader}>
                            <h2 className="mb-0">Gestión de Productos</h2>
                            <Button className={styles.futurButton} onClick={() => handleShowModal()}>
                                Agregar Producto
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Table striped hover responsive className={styles.futurTable}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((producto) => (
                                        <tr key={producto.id}>
                                            <td>{producto.id}</td>
                                            <td>
                                                <img 
                                                    src={producto.imagen} 
                                                    alt={producto.nombre} 
                                                    style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', boxShadow: 'var(--shadow-neon)'}}
                                                />
                                            </td>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.descripcion}</td>
                                            <td>${producto.precio}</td>
                                            <td>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className={styles.futurButtonOutline}
                                                    onClick={() => handleShowModal(producto)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button variant="outline-danger" size="sm" className={styles.futurButtonOutline}>
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Sección Órdenes */}
            <Row className="mb-4" ref={ordenesRef} id="ordenes">
                <Col>
                    <Card className={styles.futurSectionCard}>
                        <Card.Header className={styles.futurSectionHeader}>
                            <h2 className="mb-0">Gestión de Órdenes</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>Próximamente: Listado y gestión de órdenes.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Sección Ingresos */}
            <Row className="mb-4" ref={ingresosRef} id="ingresos">
                <Col>
                    <Card className={styles.futurSectionCard}>
                        <Card.Header className={styles.futurSectionHeader}>
                            <h2 className="mb-0">Ingresos</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>Próximamente: Gráficas y reportes de ingresos.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para agregar/editar producto */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton className={styles.futurSectionHeader}>
                    <Modal.Title>
                        {selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                required
                                className={styles.futurInput}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                required
                                className={styles.futurInput}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                name="precio"
                                value={formData.precio}
                                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                required
                                className={styles.futurInput}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL de la Imagen</Form.Label>
                            <Form.Control
                                type="text"
                                name="imagen"
                                value={formData.imagen}
                                onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                                required
                                className={styles.futurInput}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className={styles.futurButtonOutline} onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" className={styles.futurButton}>
                                {selectedProduct ? 'Guardar Cambios' : 'Agregar Producto'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
} 