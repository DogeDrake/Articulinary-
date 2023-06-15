<template>
    <div>
        <div class="tab-buttons">
            <button @click="activeTab = 'recetas'" :class="{ active: activeTab === 'recetas' }">Recetas</button>
            <button @click="activeTab = 'usuarios'" :class="{ active: activeTab === 'usuarios' }">Usuarios</button>
        </div>

        <div v-if="activeTab === 'recetas'" class="tab-content">
            <h2>Recetas</h2>
            <div class="search-bar">
                <label for="receta-search">Buscar receta por nombre:</label>
                <input type="text" id="receta-search" v-model="recetaSearch" />
            </div>
            <div class="recetas-table">
                <div class="receta" v-for="receta in filteredRecetas" :key="receta.id">
                    <div class="receta-image">
                        <img :src="receta.attributes.Imagen" alt="Receta" />
                    </div>
                    <div class="receta-details">
                        <h3>{{ receta.attributes.Titulo }}</h3>
                        <p>Autor: {{ receta.attributes.user.data.attributes.RealName }}</p>
                        <button @click="mostrarModal(receta, 'receta')">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'usuarios'" class="tab-content">
            <h2>Usuarios</h2>
            <div class="search-bar">
                <label for="usuario-search">Buscar usuario por nombre, username o email:</label>
                <input type="text" id="usuario-search" v-model="usuarioSearch" />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Imagen de perfil</th>
                        <th>Username</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in filteredUsuarios" :key="usuario.id">
                        <td>
                            <div>
                                <img :src="usuario.UserImg" class="user-image" alt="Imagen de Usuario" />
                            </div>
                        </td>
                        <td>{{ usuario.username }}</td>
                        <td>{{ usuario.RealName }}</td>
                        <td>{{ usuario.email }}</td>
                        <td><button @click="mostrarModal(usuario, 'usuario')">Eliminar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="modal" v-if="mostrarModalEliminar">
            <div class="modal-content">
                <p>¿Estás seguro de que deseas eliminar este {{ tipoEliminar }}?</p>
                <div class="modal-buttons">
                    <button @click="eliminarElemento">Sí</button>
                    <button @click="mostrarModalEliminar = false">No</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
var userIdLogin = localStorage.getItem("UserId");
export default {
    data() {
        return {
            activeTab: 'recetas',
            recetas: [],
            usuarios: [],
            mostrarModalEliminar: false,
            elementoEliminar: null,
            tipoEliminar: '',
            recetaSearch: '',
            usuarioSearch: '',
        };
    },
    created() {
        if (userIdLogin !== '1') {
            this.$router.push('/home');
        }
        if (userIdLogin === '1') {
            const usuario = prompt('Ingresa el usuario:');
            const contraseña = prompt('Ingresa la contraseña:');
            if (usuario !== 'admin' || contraseña !== 'admin') {
                this.$router.push('/home');
            } else {
                alert('Bienvenido, administrador!');
            }
        }
        this.obtenerRecetas();
        this.obtenerUsuarios();
    },
    computed: {
        filteredRecetas() {
            return this.recetas.filter((receta) => {
                const searchTerm = this.recetaSearch.toLowerCase();
                const usuarioNombre = receta.attributes.user.data.attributes.RealName.toLowerCase();
                const recetaNombre = receta.attributes.Titulo.toLowerCase();
                return usuarioNombre.includes(searchTerm) || recetaNombre.includes(searchTerm);
            });
        },
        filteredUsuarios() {
            return this.usuarios.filter((usuario) => {
                const searchTerm = this.usuarioSearch.toLowerCase();
                const nombreReal = usuario.RealName ? usuario.RealName.toLowerCase() : '';
                const username = usuario.username ? usuario.username.toLowerCase() : '';
                const email = usuario.email ? usuario.email.toLowerCase() : '';
                return nombreReal.includes(searchTerm) || username.includes(searchTerm) || email.includes(searchTerm);
            });
        },
    },
    methods: {
        obtenerRecetas() {
            axios
                .get('http://localhost:1337/api/Recetas', {
                    params: {
                        populate: '*',
                        'pagination[limit]': 80,
                    },
                })
                .then((response) => {
                    this.recetas = response.data.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        obtenerUsuarios() {
            axios
                .get('http://localhost:1337/api/Users')
                .then((response) => {
                    this.usuarios = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        mostrarModal(elemento, tipo) {
            this.elementoEliminar = elemento;
            this.tipoEliminar = tipo;
            this.mostrarModalEliminar = true;
        },
        eliminarElemento() {
            const id = this.elementoEliminar.id;
            if (this.tipoEliminar === 'receta') {
                axios
                    .delete(`http://localhost:1337/api/Recetas/${id}`)
                    .then((response) => {
                        console.log('Receta eliminada:', id);
                        this.actualizarRecetas();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (this.tipoEliminar === 'usuario') {
                axios
                    .delete(`http://localhost:1337/api/Users/${id}`)
                    .then((response) => {
                        console.log('Usuario eliminado:', id);
                        this.actualizarUsuarios();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            this.mostrarModalEliminar = false;
        },
        actualizarRecetas() {
            this.recetas = this.recetas.filter((receta) => receta.id !== this.elementoEliminar.id);
            this.elementoEliminar = null;
        },
        actualizarUsuarios() {
            this.usuarios = this.usuarios.filter((usuario) => usuario.id !== this.elementoEliminar.id);
            this.elementoEliminar = null;
        },
    },
};
</script>

<style>
.tab-buttons {
    display: flex;
    gap: 10px;
}

.tab-buttons button {
    background-color: #e0e0e0;
    padding: 10px;
    border: none;
    cursor: pointer;
}

.tab-buttons button.active {
    background-color: #ccc;
}

.tab-content {
    margin-top: 20px;
}

.search-bar {
    margin-bottom: 10px;
}

.search-bar label {
    display: block;
    margin-bottom: 5px;
}

.search-bar input {
    padding: 5px;
    width: 100%;
}

.recetas-table {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.receta {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
}

.receta-image img {
    max-width: 100%;
    height: auto;
}

.receta-details {
    margin-top: 10px;
    text-align: center;
}

.receta-details h3 {
    margin: 0;
}

.receta-details p {
    margin: 0;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table th,
table td {
    border: 1px solid #ddd;
    padding: 8px;
}

table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

table td {
    text-align: center;
}

table button {
    background-color: #e0e0e0;
    padding: 5px;
    border: none;
    cursor: pointer;
}

table button:hover {
    background-color: #ccc;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    width: 300px;
}

.modal p {
    margin: 0;
}

.modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.user-image {
    width: 100px;
    height: 100px;
}
</style>
