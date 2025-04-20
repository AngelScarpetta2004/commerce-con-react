'use client';

import React from 'react';
import destacados from '../../data/destacados.json';
import styles from '@/styles/Destacados.module.css';

const ProductosDestacados = ({ agregarAlCarrito }) => {
  return (
    <section className={styles.destacados}>
      <h2>🚗 Carros Futuristas Destacados</h2>
      <div className={styles.grid}>
        {destacados.map((producto) => (
          <div key={producto.id} className={styles.card}>
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p><strong>${producto.precio}</strong></p>
            <button onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductosDestacados;
