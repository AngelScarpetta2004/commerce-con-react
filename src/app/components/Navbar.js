"use client";

import Link from 'next/link';
import React, { useEffect } from 'react';
import styles from "@/styles/Navbar.module.css";
import { useCart } from "@/context/CartContext";
import "bootstrap-icons/font/bootstrap-icons.min.css";

export default function Navbar() {
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(`.${styles.navbar}`);
      if (window.scrollY > 50) {
        navbar.classList.add(styles.scrolled);
      } else {
        navbar.classList.remove(styles.scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>FuturCars 🏎️</div>
      <ul className={styles.navLinks}>
        <li><Link href='/'>Inicio</Link></li>
        <li><Link href='/products'>Productos</Link></li>
        <li><Link href='/users'>Usuarios</Link></li>
        <li><Link href='/contact'>Contacto</Link></li>
        <li className={styles.cartContainer}>
          <Link href='/cart' className={styles.cartLink}>
            <i className='bi bi-cart3'></i>
            {cartItems.length > 0 && (
              <span className={styles.cartBadge}>{cartItems.length}</span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
