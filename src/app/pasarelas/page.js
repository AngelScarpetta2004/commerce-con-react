"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Pasarelas() {
    const [isClient, setIsClient] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);
    const { cartItems } = useCart();
    const router = useRouter();

    // Calcular el total del carrito
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + (item.price * item.quantity),
        0
    );

    useEffect(() => {
        // Si el carrito está vacío, redirigir al carrito
        if (cartItems.length === 0) {
            router.push('/cart');
        }
        setIsClient(true);
    }, [cartItems, router]);

    useEffect(() => {
        if (showPayPal && typeof window !== "undefined" && window.paypal) {
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
                        document.getElementById("result-message").innerText = message;
                        alert(message);
                        // Aquí podrías limpiar el carrito después de una compra exitosa
                        router.push('/');
                    });
                },
                onError: function(err) {
                    console.error("Error en PayPal:", err);
                    alert("Error en PayPal");
                },
            }).render("#paypal-button-container");
        }
    }, [showPayPal, totalPrice]);

    if (!isClient) {
        return null;
    }

    return (
        <div className="p-8">
            <Script
                src="https://www.paypal.com/sdk/js?client-id=test&buyer-country=US&currency=USD&components=buttons&enable-funding=venmo,paylater,card"
                strategy="afterInteractive"
            />
            <h1 className="text-2xl mb-4 text-center">Pasarelas de Pago</h1>
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold">Total a pagar: ${totalPrice.toFixed(2)}</h2>
            </div>
            <div className="grid grid-cols-1 md:grids-cols-2 gap-8 max-w-3xl mx-auto">
                <div 
                    className="border rounded-lg p-6 text-center cursor-pointer bg-white shadow hover:bg-gray-50 transition-colors" 
                    onClick={() => setShowPayPal(true)}
                >
                    <img 
                        src="/paypal.jpg"
                        alt="PayPal"
                        className="mx-auto mb-4"
                        style={{width: "100px", height: "auto"}}
                    />
                    <p className="text-lg">Pagar con PayPal</p>
                </div>

                <div 
                    className="border rounded-lg p-6 text-center cursor-pointer bg-white shadow hover:bg-gray-50 transition-colors" 
                    onClick={() => (window.location.href = "/api/payments/payu-redirect")}
                >
                    <img 
                        src="/payu.jpg"
                        alt="PayU"
                        className="mx-auto mb-4"
                        style={{width: "100px", height: "auto"}}
                    />
                    <p className="text-lg">Pagar con PayU</p>
                </div>
            </div>
        
            {showPayPal && (
                <div className="mt-10 text-center">
                    <div id="paypal-button-container"/>
                    <p id="result-message" className="mt-4 text-green-600"></p>
                </div>
            )}
        </div>
    );
}