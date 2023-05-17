<template>
    <div class="user-profile">
        <div class="user-info">
            <h1>{{ user.username }}</h1>
            <img :src="user.UserImg" alt="User image">
            <ul>
                <li>Email: {{ user.email }}</li>
                <li>Fecha de registro: {{ user.createdAt }}</li>
                <!--<li>Rol: {{ user.role.name }}</li>-->
            </ul>

            <a href="/editar">Editar Usuario</a>
            <button @click="logout">Cerrar Sesión</button>
        </div>
        <div class="recipes">
            <h2>Recetas</h2>
            <div class="recipe-cards">
                <div v-for="receta in user.recetas" :key="receta.id" class="recipe-card">
                    <router-link class="search-custom-link" :to="{ name: 'UserDetails', params: { id: receta.id } }">
                        <h3>{{ receta.Titulo }}</h3>
                        <img :src="receta.Imagen" alt="Receta image">
                        <p>{{ receta.Descripcion }}</p>
                    </router-link>
                </div>
                <div v-if="user && user.recetas && user.recetas.length === 0" class="no-recipes">
                    Empieza creando tu primera receta en
                    <router-link class="add-recipe-link" to="/nuevo">+ AÑADIR RECETA</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
var userIdLogin = localStorage.getItem("UserId");

export default {
    computed: {
        ...mapState(['userId']) // obtenemos el userId del store
    },
    data() {
        return {
            user: {}
        }
    },
    methods: {
        getUser() {
            axios.get(`http://localhost:1337/api/Users/${userIdLogin}`, {
                params: {
                    populate: '*'
                }
            })
                .then(response => {
                    this.user = response.data
                    console.log(this.user)
                    console.log(this.userId)
                    console.log(this.user.recetas)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        logout() {
            // Aquí puedes agregar la lógica para cerrar sesión del usuario
            // y redireccionar a la página de inicio de sesión
            this.$router.push('/login');
        }
    },
    mounted() {
        this.getUser();
    }
}
</script>

<style>
.user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
}

.user-info {
    text-align: center;
    margin-bottom: 2rem;
}

.user-info h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.user-info img {
    border-radius: 50%;
    width: 150px;
    height: 150px;
    object-fit: cover;
    object-position: center;
    margin-bottom: 1rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.user-info ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.user-info li {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.recipes {
    width: 100%;
    max-width: 800px;
}

.recipe-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.recipe-card {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    cursor: pointer;
}

.recipe-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
}

.recipe-card h3 {
    font-size: 1.5rem;
    margin: 0;
    padding: 1rem;
}

.recipe-card img {
    width: 100%;
}

.no-recipes {
    text-align: center;
    margin-top: 20px;
    font-style: italic;
    color: #808080;
}

.add-recipe-link {
    color: #4caf50;
    text-decoration: none;
    font-weight: bold;
}
</style>
