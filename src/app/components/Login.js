import React, {useState} from "react";
import axios from "axios";

const Login = ({setToken}) => {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handlelLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post("http://localhost:5000/api/auth/login", {email, password});
            const token = response.data.token;
            setToken(token); // guardarlo en el estado global (localstorare)
            localStorage.setItem("token", token);
        }catch (error){
            setError("Credenciales invalidas");
        }
    };

    //TODO: CREAR EL COMPONENTE DE REGISTRO -> RETURN Y HTML
    return (
        <div>
            <h2>Iniciar Sesion Admin</h2>
            <form onSubmit={handlelLogin}>
                <div>
                    <input
                     type="email"
                     placeholder="Email" 
                     value={email} 
                     onChange={(e) => setEmail(e.target.value)} 
                    />  
                </div>
                <div>
                     {/* input para password */}
                     <input 
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                    />  
                </div>
                {error && <p>{error}</p>}

                {/* Button to submit al form */}
                <button type="submit">Login</button>
            </form>

        </div>
    );
};

export default Login;