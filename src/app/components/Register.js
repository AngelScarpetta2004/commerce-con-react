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
        confirmPassword: ""
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
                password: formData.password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                router.push('/profile');
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