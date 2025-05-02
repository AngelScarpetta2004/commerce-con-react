'use client';

import React, { useState } from 'react';
import styles from '@/styles/Cart.module.css';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

const ITEMS_PER_PAGE = 10;

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = cartItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>🛒 Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p className={styles.empty}>Tu carrito está vacío.</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {currentItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className={styles.productImage}
                />
                <div className={styles.itemDetails}>
                  <h3>{item.title}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <div className={styles.controls}>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  <p className={styles.subtotal}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                  >
                    ❌ Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de paginación */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Página anterior
            </button>

            <span>Página {currentPage} de {totalPages}</span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Página siguiente →
            </button>
          </div>

          <div className={styles.total}>
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <button className={styles.checkoutBtn}>Proceder al pago</button>
          </div>
        </>
      )}
    </div>
  );
}
