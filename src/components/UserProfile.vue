<template>
    <div class="user-actions">
        <div class="options-button" @click="toggleOptions">
            <i class="fas fa-ellipsis-v"></i>
        </div>
        <div v-if="showOptions" class="options-dropdown">
            <button @click="deleteAccount" class="delete-account-button">Borrar cuenta</button>
        </div>
    </div>
    <div class="user-profile">
        <div class="user-info">
            <div class="user-header">
                <h1>{{ user.username }}</h1>
                <a @click="openEditModal">
                    <i class="fas fa-pencil-alt edit-icon"></i>
                </a>
            </div>
            <img :src="user.UserImg" alt="User image">
            <ul>
                <li>Email: {{ user.email }}</li>
                <li>Fecha de registro: {{ user.createdAt }}</li>
            </ul>

            <div class="button-group">
                <button @click="logout" class="logout-button">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>

                <button v-if="isAdmin" class="admin-button">
                    <router-link to="/Admin" class="back-link">
                        <i class="fas fa-cog"></i> Panel de Administrador
                    </router-link>
                </button>
            </div>
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
        <!-- Edit Modal -->
        <div v-if="showEditModal" class="modal">
            <div class="modal-content edit-modal">
                <h3>Editar usuario</h3>

                <div class="profile-image-container">
                    <img :src="editUserImg" alt="Profile image" class="profile-image">
                    <div>
                        <input ref="profileImage" type="file" accept="image/*" @change="uploadProfileImage">
                        <button @click="clearProfileImage">Borrar imagen</button>
                    </div>
                </div>
                <input v-model="editUsername" placeholder="Nombre de usuario" type="text">
                <input v-model="RealName" placeholder="Nombre" type="text">
                <input v-model="editEmail" placeholder="Email" type="text">
                <div class="modal-buttons">
                    <button @click="UpdateDataUser" class="save-button">Aceptar</button>
                    <button @click="cancelEdit" class="cancel-button">Cancelar</button>
                </div>
            </div>
        </div>
        <!-- Delete Account Modal -->
        <div v-if="showDeleteAccountModal" class="modal">
            <div class="modal-content">
                <h3>¿Estás seguro de que quieres eliminar tu cuenta?</h3>
                <p>Si eliminas tu cuenta, no podrás volver a acceder y se borrarán todas tus recetas.</p>
                <div class="modal-buttons">
                    <button @click="confirmDeleteAccount" class="delete-button">Sí</button>
                    <button @click="cancelDeleteAccount" class="cancel-button">No</button>
                </div>
                <p>Si tienes alguna duda, consulta con <a
                        href="mailto:moderation@articulinary.com">moderation@articulinary.com</a>.</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
var userIdLogin = localStorage.getItem("UserId");
import { storage } from "../firebase";
var userId = localStorage.getItem("UserId");
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default {
    computed: {
        ...mapState(['userId']) // obtenemos el userId del store
    },
    data() {
        return {
            user: {},
            showModal: false,
            recipeToDeleteId: null,
            showEditModal: false,
            editUsername: '',
            editEmail: '',
            editUserImg: '',
            RealName: '',
            profileImage: null,
            profileImageUrl: null,
            showOptions: false, // Nueva propiedad
            showDeleteAccountModal: false,
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
                    this.RealName = this.user.RealName;
                    console.log(this.user)
                    console.log(this.userId)
                    console.log(this.user.recetas)

                    // Verificar si el usuario es administrador
                    this.isAdmin = this.user.id === 1;
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
        },
        toggleOptions() {
            this.showOptions = !this.showOptions;
        },
        cancelDeleteAccount() {
            this.showDeleteAccountModal = false;
        },
        deleteAccount() {
            this.showDeleteAccountModal = true;
        },
        confirmDeleteAccount() {
            // Eliminar todas las recetas del usuario
            this.user.recetas.forEach(receta => {
                axios.delete(`http://localhost:1337/api/Recetas/${receta.id}`)
                    .then(response => {
                        console.log("Receta eliminada:", response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });

            // Realizar la solicitud de eliminación de la cuenta usando Axios y el ID del usuario
            axios.delete(`http://localhost:1337/api/Users/${this.user.id}`)
                .then(response => {
                    console.log("Cuenta eliminada:", response.data);
                    // Cerrar sesión
                    this.logout();
                })
                .catch(error => {
                    console.log(error);
                });
                this.showDeleteAccountModal = false;
        },
        openEditModal() {
            this.editUsername = this.user.username;
            this.editEmail = this.user.email;
            this.editRealName = this.user.RealName;
            this.editUserImg = this.user.UserImg;
            this.showEditModal = true;
        },
        cancelEdit() {
            this.showEditModal = false;

        },
        saveChanges() {
            // Aquí puedes enviar los cambios al servidor mediante una solicitud HTTP
            // Por simplicidad, aquí solo actualizaremos los valores en el componente
            this.user.username = this.editUsername;
            this.user.email = this.editEmail;
            this.editRealName = this.user.RealName;
            this.user.UserImg = this.editUserImg;


        },
        UpdateDataUser() {
            const user = {
                username: this.editUsername,
                RealName: this.RealName,
                email: this.editEmail,
                role: 1,
                UserImg: this.profileImageUrl ? this.profileImageUrl : this.editUserImg,
            };

            axios
                .put(`http://localhost:1337/api/Users/${userId}`, user)
                .then((response) => {
                    console.log(response.data);
                    this.showEditModal = false;
                    this.getUser();
                    // Handle successful response
                })
                .catch((error) => {
                    console.log(error);

                    // Handle error
                });

        },
        uploadProfileImage() {
            const profileImageFile = this.$refs.profileImage.files[0];
            const storageRef = ref(storage, `notes/images/${profileImageFile.name}`);
            uploadBytes(storageRef, profileImageFile)
                .then((snapshot) => {
                    console.log("Profile image uploaded");
                    return getDownloadURL(snapshot.ref);
                })
                .then((downloadURL) => {
                    console.log("Profile image URL:", downloadURL);
                    this.profileImageUrl = downloadURL;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        clearProfileImage() {
            this.editUserImg = ''
            this.$refs.profileImage.value = ''
        },

    },
    mounted() {
        this.getUser();
    }
}
</script>


<style scoped>
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

.edit-modal input {
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.edit-modal .modal-buttons {
    justify-content: flex-end;
}

.edit-modal .profile-image-container {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.edit-modal .profile-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 1rem;
}

.edit-modal button {
    margin-left: 1rem;
}

.save-button {
    background-color: #4caf50;
}

.button-group {
    display: flex;
    align-items: center;
}

.admin-button {
    margin-left: 10px;
    background-color: blue;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.user-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
}

.options-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #808080;
    font-size: 1.5rem;
    margin-right: 10px;
    margin-top: 150px;
}

.options-dropdown {
    position: absolute;
    margin-top: 150px;
    top: 30px;
    right: 0;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    z-index: 999;
}

.options-dropdown button {
    background-color: #ff0000;
    color: #fff;
    border: none;

    border-radius: 5px;
    padding: 0.5rem 1rem;
    margin-bottom: 5px;
    cursor: pointer;
}

.options-dropdown button:hover {
    background-color: #cc0000;
}
</style>
