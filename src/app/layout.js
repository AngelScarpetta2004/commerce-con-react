import React from 'react'
import "../styles/Navbar.module.css"
import Navbar from './components/Navbar'
import '../styles/globals.css';

import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from '@/context/CartContext';
import styles from '@/styles/footer.module.css';



export default function RootLayout({ children }) {
  return (

    <html lang='es'>
      <body>

        <CartProvider>
          <header>
            <Navbar/>
          </header>

          {/* Main */}
          <main className='mainContet' style={{ paddingTop: '50px' }}>{children}</main>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>© 2025 - Todos los derechos reservados</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}




