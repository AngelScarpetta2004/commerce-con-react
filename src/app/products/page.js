"use client"; // Requerido para usar hooks en Next.js
import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { useCart } from "@/context/CartContext"; // Importa el contexto del carrito
import api from "../api/axiosConfig";
import styles from "@/styles/Products.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]); // Estado para los productos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const { addToCart } = useCart(); // Usa el contexto del carrito
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('Todos');

  const PRODUCTS_PER_PAGE = 30;

  // 📌 useEffect para obtener productos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Obtener tipos únicos de productos para los filtros
  const tipos = ['Todos', ...Array.from(new Set(products.map(p => p.tipo)))];

  // Filtrar productos según el tipo seleccionado
  const filteredProducts = selectedType === 'Todos'
    ? products
    : products.filter(p => p.tipo === selectedType);

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

  // Cambiar página
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Cambiar filtro y resetear página
  const handleFilter = (tipo) => {
    setSelectedType(tipo);
    setCurrentPage(1);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Catálogo de Vehículos</h1>

      {/* Filtros por tipo */}
      <div className="mb-4" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
        {tipos.map(tipo => (
          <Button
            key={tipo}
            variant={selectedType === tipo ? 'info' : 'outline-info'}
            onClick={() => handleFilter(tipo)}
            style={{fontWeight: 'bold'}}
          >
            {tipo}
          </Button>
        ))}
      </div>

      {/* Mostrar error si ocurre */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mostrar spinner mientras carga */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Row>
            {paginatedProducts.map((product) => (
              <Col key={product._id} md={4} className="mb-4">
                <Card className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    <Card.Img
                      variant="top"
                      src={product.imagenes[0]}
                      className={styles.productImage}
                    />
                    {product.destacado && (
                      <Badge bg="warning" text="dark" className={styles.badge}>
                        Destacado
                      </Badge>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className={styles.title}>
                      {product.marca} {product.modelo} {product.año}
                    </Card.Title>
                    <div className={styles.details}>
                      <div><strong>Tipo:</strong> {product.tipo}</div>
                      <div><strong>Transmisión:</strong> {product.transmision}</div>
                      <div><strong>Color:</strong> {product.color}</div>
                      <div><strong>Kilometraje:</strong> {product.kilometraje.toLocaleString()} km</div>
                      <div className={styles.price}>${product.precio.toLocaleString()}</div>
                    </div>
                    <div className={styles.description}>{product.descripcion}</div>
                    <div className={styles.buttonGroup}>
                      <Button 
                        variant="primary" 
                        onClick={() => addToCart({ 
                          ...product, 
                          id: product._id, 
                          title: `${product.marca} ${product.modelo} ${product.año}`,
                          image: product.imagenes[0],
                          price: product.precio
                        })}
                        disabled={!product.disponible}
                      >
                        {product.disponible ? '🛒 Agregar al carrito' : 'No disponible'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Paginación */}
          <div className="d-flex justify-content-center align-items-center mt-4" style={{gap: '1rem'}}>
            <Button 
              variant="outline-info" 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span style={{color: '#00fff7', fontWeight: 'bold', fontFamily: 'Orbitron'}}>Página {currentPage} de {totalPages}</span>
            <Button 
              variant="outline-info" 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}




