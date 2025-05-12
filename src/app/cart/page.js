'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Cart.module.css';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Script from "next/script";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = cartItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );

  const [showPayPal, setShowPayPal] = useState(false);
  const router = useRouter();

  // Renderizar botones de PayPal cuando se active
  useEffect(() => {
    if (showPayPal && typeof window !== "undefined" && window.paypal) {
      // Limpiar el contenedor antes de renderizar para evitar duplicados
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalPrice.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            const message = `¡Pago aprobado! Gracias ${details.payer.name.given_name} por su compra`;
            alert(message);
            router.push('/');
          });
        },
        onError: function(err) {
          console.error("Error en PayPal:", err);
          alert("Error en PayPal");
        },
      }).render("#paypal-button-container");
    }
  }, [showPayPal, totalPrice, router]);

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>🛒 Carrito de Compras</h1>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center' }}>
        {/* Columna izquierda: productos */}
        <div style={{ flex: 2, minWidth: 0 }}>
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
                      <p>
                        {typeof item.price === 'number'
                          ? `$${item.price.toFixed(2)}`
                          : 'Precio no disponible'}
                      </p>
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
            </>
          )}
        </div>
        {/* Columna derecha: total y pasarelas */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 350, background: 'rgba(20,20,40,0.85)', borderRadius: 12, padding: '2rem 1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: 120 }}>
          <h2 style={{ color: '#00fff7', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Resumen</h2>
          <div style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '2rem', textAlign: 'center' }}>
            Total: <span style={{ color: '#00fff7', fontWeight: 'bold', fontSize: '1.5rem' }}>${totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <button className={styles.checkoutBtn} onClick={() => setShowPayPal(true)}>
              Pagar con PayPal
            </button>
            <button className={styles.checkoutBtn} onClick={() => window.location.href = "/api/payments/payu-redirect"}>
              Pagar con PayU
            </button>
          </div>
          <Script
            src="https://www.paypal.com/sdk/js?client-id=test&buyer-country=US&currency=USD&components=buttons&enable-funding=venmo,paylater,card"
            strategy="afterInteractive"
          />
          {showPayPal && (
            <div className="mt-4 text-center" style={{ width: '100%' }}>
              <div id="paypal-button-container" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
