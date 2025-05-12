"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../api/axiosConfig";
import styles from "@/styles/Auth.module.css";

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        confirmPassword: "",
        rol: "usuario" // Por defecto es usuario normal
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password,
                rol: formData.rol
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Redirigir según el rol
                if (formData.rol === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/profile');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrar usuario");
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBox}>
                <h2 className={styles.title}>Crear Cuenta</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            className={styles.input}
                        >
                            <option value="usuario">Usuario Normal</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button type="submit" className={styles.button}>
                        Registrarse
                    </button>

                    <p className={styles.switchText}>
                        ¿Ya tienes una cuenta?{" "}
                        <span 
                            className={styles.switchLink}
                            onClick={() => router.push('/login')}
                        >
                            Iniciar sesión
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register; 