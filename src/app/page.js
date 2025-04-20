'use client';


import HeroSection from '@/app/components/HeroSection';
import ProductosDestacados from '@/app/components/ProductosDestacados';

export default function Home() {
  const agregarAlCarrito = (producto) => {
    console.log('Producto agregado:', producto); // Luego conectas a tu store o context
  };

  return (
    <>
      <HeroSection />
      <ProductosDestacados agregarAlCarrito={agregarAlCarrito} />
    </>
  );
}
