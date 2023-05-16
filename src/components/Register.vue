<template>
    <div class="register-container">
        <div class="register-form">
            <h2>Registro</h2>
            <form>
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email">
                </div>
                <div>
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username">
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password">
                </div>
                <button @click.prevent="register">Registrarse</button>
            </form>
            <p>Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
        </div>
        <div class="register-carousel">
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img class="d-block w-100" src="https://dummyimage.com/16:9x1080/" alt="First slide">
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
    </div>
</template>
  
<script>
import axios from 'axios'
export default {
    data() {
        return {
            username: '',
            email: ''
        }
    },
    methods: {
        register() {
            const data = {
                username: this.username,
                email: this.email,
                password: this.password,
                role: 1
            };

            axios.post('http://localhost:1337/api/Users', data)
                .then(response => {
                    console.log(response.data);
                    this.$router.push({ name: 'Login' })
                    // Aquí puedes agregar la redirección a la pantalla de Login si el registro es exitoso
                })
                .catch(error => {
                    console.log(error.response.data);
                });
        }
    }
}

</script>


<style>
.register-container {
    display: flex;
    align-items: center;
    height: 100vh;
}

.register-form {
    flex: 1;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    width: 25%;
    margin: 0 auto;
    height: 100%;
    padding-top: 15%;
}



.register-form h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
}

.register-form form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.register-form label {
    font-weight: bold;
}

.register-form input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
}

.register-form button {
    background-color: #0077FF;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.register-form button:hover {
    background-color: #005FE6;
}

.register-form p {
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
}

.register-form p a {
    color: #0077FF;
    text-decoration: none;
}

.register-form p a:hover {
    text-decoration: underline;
}

.register-carousel {
    flex: 3;
    width: 75%;
}

.carousel-item img {
    height: 300px;
    object-fit: cover;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #0077FF;
    border-radius: 50%;
    padding: 5px;
    color: white;
    transition: background-color 0.3s ease;
}

.carousel-control-prev-icon:hover,
.carousel-control-next-icon:hover {
    background-color: #005FE6;
}

.carousel-indicators li {
    background-color: #ccc;
    border-radius: 50%;
    width: 10px;
    height: 10px;
}

.carousel-indicators .active {
    background-color: #0077FF;
}
</style>