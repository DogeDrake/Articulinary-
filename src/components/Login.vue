<template>
    <div class="login-container">
        <div class="login-form">
            <h2>Login</h2>
            <form>
                <div>
                    <label for="email">Email/Username</label>
                    <input type="text" id="email" v-model="email">
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password">
                </div>
                <button @click.prevent="login">Log In</button>
            </form>
            <p>No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
        </div>

        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
            </ol>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img class="d-block w-100" src="https://loremflickr.com/320/240" alt="First slide">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100" src="https://loremflickr.com/320/240/dog" alt="Second slide">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100" src="https://loremflickr.com/320/240/paris" alt="Third slide">
                </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
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
            users: []
        }
    },
    mounted() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('UserId');
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
    },
    methods: {
        ...mapMutations(['setUserId']),
        login() {
            let correo = document.getElementById("email").value;
            let contrasena = document.getElementById("password").value;
            let UserIdLogin = null
            if (correo === "" || contrasena === "") {
                // document.getElementById("txtError").textContent = "RELLENE TODOS LOS CAMPOS";
            } else {
                console.log(correo + contrasena)
                let usuarioEncontrado = false;
                this.users.forEach(user => {
                    if (user.username === correo && user.password === contrasena) {
                        usuarioEncontrado = true;
                        UserIdLogin = user.id
                        console.log(usuarioEncontrado)
                        // Aquí va la lógica para redirigir al usuario si el log in es exitoso
                    }
                });
                if (usuarioEncontrado) {
                    localStorage.setItem('isAuthenticated', true);
                    console.log(UserIdLogin);
                    localStorage.setItem('UserId', UserIdLogin);
                    this.setUserId(UserIdLogin); // llamamos a la acción setUserId y pasamos el UserIdLogin
                    this.$router.push({ name: 'UserList' })
                } else {
                    // document.getElementById("txtError").textContent = "CREDENCIALES INCORRECTAS";
                }
            }
        }
    }
}
</script>


<style>
.login-container {
    display: flex;
    height: 100vh;
    overflow-y: hidden;
    background-color: #F7F7F7;
}

.login-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    width: 25%;
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

.carousel {
    width: 75%;
    margin: auto;
    margin-left: 3rem;
}

.carousel-indicators li {
    background-color: #BDBDBD;
    border: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.carousel-indicators li.active {
    background-color: #db8310;
}

.carousel-control-prev,
.carousel-control-next {
    width: 5%;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #d68316;
    border-radius: 50%;
}

.carousel-control-prev-icon {
    margin-right: 1rem;
}

.carousel-control-next-icon {
    margin-left: 1rem;
}
</style>



