<template>
    <div class="login-container">
        <div class="login-form">
            <div class="inline">
                <h2>Login</h2>
                <div>
                    <a class="faq-button" href="FAQ">
                        <i class="fas fa-question-circle"></i>
                    </a>
                </div>
            </div>
            <form>
                <div>
                    <label for="email">Email/Username</label>
                    <input type="text" id="email" v-model="email">
                </div>
                <div>
                    <label for="password">Password</label>
                    <div class="password-input-container">
                        <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" />
                        <i class="toggle-password fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                            @click="showPassword = !showPassword"></i>
                    </div>
                </div>

                <button @click.prevent="login">Log In</button>
                <span class="error-message" v-if="errorMessage">{{ errorMessage }}</span>
            </form>
            <a>No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></a>
            <a>o</a>
            <a><router-link to="/home">Entrar como invitado</router-link></a>
        </div>


    </div>
</template>


<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';

export default {
    data() {
        return {
            email: '',
            password: '',
            showPassword: false,
            errorMessage: '',
        }
    },
    mounted() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('UserId');

        /*
                axios.get('http://localhost:1337/api/Users')
                    .then(response => {
                        this.users = response.data
                        console.log(this.users)
                    })
                    .catch(error => {
                        console.log(error)
                    })
        
                $(document).ready(function () {
                    $('.carousel').carousel();
                });
                */


    },
    methods: {
        ...mapMutations(['setUserId']),
        loginAsGuest() {
            // Realizar cualquier lógica necesaria antes de redirigir al usuario
            this.$router.push('/home');
        },
        login() {
            let correo = document.getElementById("email").value;
            let contrasena = document.getElementById("password").value;
            let UserIdLogin = null
            if (correo === "" || contrasena === "") {
                this.errorMessage = "RELLENE TODOS LOS CAMPOS";
            } else {
                console.log(correo + contrasena)
                let usuarioEncontrado = false;
                axios.post('http://localhost:1337/api/auth/local', {
                    identifier: correo,
                    password: contrasena
                })
                    .then(response => {
                        // Aquí se ejecuta si la solicitud de inicio de sesión es exitosa
                        console.log(response.data);
                        localStorage.setItem('isAuthenticated', true);
                        localStorage.setItem('UserId', response.data.user.id);
                        this.setUserId(response.data.user.id);
                        this.$router.push({ name: 'UserList' });
                    })
                    .catch(error => {
                        // Aquí se ejecuta si hay un error en la solicitud de inicio de sesión
                        console.log(error);
                        this.errorMessage = 'CREDENCIALES INCORRECTAS';
                    });
            }
        }
    }
}
</script>



<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow-y: hidden;
    background-image: url('../assets/kitchenbackground.png');
    background-size: cover;
  background-position: center;
background-color: rgba(0, 0, 255, 0.397);

}


.login-container::before {
  background-color: blue; /* Cambia el tono de fondo a azul */
  opacity: 0.5; /* Ajusta la opacidad del color de fondo */
}

.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    width: 25%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
}


.login-form h2 {
    margin-bottom: 1rem;
    font-size: 2rem;
    font-weight: 700;
}

.login-form form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.login-form label {
    font-size: 1.2rem;
    font-weight: 700;
}

.login-form input[type="text"],
.login-form input[type="password"] {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #BDBDBD;
    border-radius: 4px;
}

.login-form button {
    background-color: #e9810a;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.login-form button:hover {
    background-color: #d4850d;
}

.login-form p {
    margin-top: 2rem;
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
}

.login-form p router-link {
    color: #c18e2e;
    text-decoration: underline;
}

.password-input-container {
    position: relative;
}

.password-input-container .toggle-password {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #aaa;
    cursor: pointer;
}

.password-input-container .toggle-password:hover {
    color: #777;
}

.error-message {
    color: red;
}

.inline {
    display: inline-block;
}
</style>



