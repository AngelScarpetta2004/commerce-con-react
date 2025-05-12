import React from 'react'
import "../styles/Navbar.module.css"
import Navbar from './components/Navbar'
import '../styles/globals.css';
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from './components/ClientLayout';
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from '@/context/CartContext';
import styles from '@/styles/footer.module.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-commerce Admin",
  description: "Panel de administración para e-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <header>
              <Navbar/>
            </header>

            {/* Main */}
            <main className='mainContet' style={{ paddingTop: '50px' }}>
              {children}
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
              <p>© 2025 - Todos los derechos reservados</p>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}




