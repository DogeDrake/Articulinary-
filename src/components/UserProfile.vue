<template>
    <div class="user-profile">
        <div class="user-info">
            <div class="user-header">
                <h1>{{ user.username }}</h1>
                <a href="/editar">
                    <i class="fas fa-pencil-alt edit-icon"></i>
                </a>
            </div>
            <img :src="user.UserImg" alt="User image">
            <ul>
                <li>Email: {{ user.email }}</li>
                <li>Fecha de registro: {{ user.createdAt }}</li>
            </ul>

            <button @click="logout" class="logout-button">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
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
                    <button @click="showDeleteModal(receta.id)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>


                <div v-if="user && user.recetas && user.recetas.length === 0" class="no-recipes">
                    Empieza creando tu primera receta en
                    <router-link class="add-recipe-link" to="/nuevo">+ AÑADIR RECETA</router-link>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>¿Estás seguro de que quieres eliminar esta receta?</h3>
                <div class="modal-buttons">
                    <button @click="deleteRecipe" class="delete-button">Sí</button>
                    <button @click="cancelDelete" class="cancel-button">No</button>
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
            user: {},
            showModal: false,
            recipeToDeleteId: null
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
        },
        showDeleteModal(recipeId) {
            this.recipeToDeleteId = recipeId;
            this.showModal = true;
        },
        cancelDelete() {
            this.recipeToDeleteId = null;
            this.showModal = false;
        },
        deleteRecipe() {
            if (this.recipeToDeleteId) {
                axios.delete(`http://localhost:1337/api/Recetas/${this.recipeToDeleteId}`)
                    .then(response => {
                        console.log("Receta eliminada:", response.data);
                        // Actualizar la lista de recetas después de eliminar una
                        this.getUser();
                        this.cancelDelete();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
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

.user-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}


.user-header h1 {
    font-size: 2rem;
    margin-right: 0.5rem;
}

.edit-icon {
    color: #007bff;
    font-size: 1.5rem;
    cursor: pointer;
}

.logout-button {
    margin-left: 100px;
    background-color: #ff0000;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.logout-button i {
    margin-right: 0.5rem;
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
    position: relative;
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

.recipe-card button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    color: #ff0000;
    font-size: 1.5rem;
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

/* Modal styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
}

.modal-content {
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    /* Ajusta el ancho máximo del modal según tus necesidades */
    width: 100%;
}

.modal h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.modal-buttons button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal-buttons .delete-button {
    background-color: #ff0000;
    color: #fff;
}

.modal-buttons .cancel-button {
    background-color: #808080;
    color: #fff;
}
</style>
