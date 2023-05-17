<template>
    <div class="HomePage">
        <div class="HomePage-search-container" v-if="isHome">
            <div class="HomePage-search-wrapper">
                <input type="text" v-model="searchTerm" placeholder="Buscar..." class="HomePage-search-input" />
                <button @click="search" class="HomePage-search-button">Buscar</button>
            </div>
        </div>
        <div v-for="receta in recetasFiltradas" :key="receta.id">
            <router-link class="custom-link" :to="{ name: 'UserDetails', params: { id: receta.id } }">
                <div class="HomePage-cardMain">
                    <div class="HomePage-card-content">
                        <h2 class="HomePage-title">{{ receta.attributes.Titulo }}</h2>
                        <p class="HomePage-username">{{ receta.attributes.user.data.attributes.username }}</p>
                    </div>
                    <div class="HomePage-card-image">
                        <img :src="receta.attributes.Imagen" alt="Imagen de la receta" />
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>



<script>
import axios from 'axios'

export default {
    data() {
        return {
            recetas: [],
            recetasFiltradas: [],
            isHome: true,
            searchTerm: ''
        }
    },
    mounted() {
        axios.get('http://localhost:1337/api/Recetas', {
            params: {
                populate: '*',
                'pagination[limit]': 80,
            }
        })
            .then(response => {
                this.recetas = response.data.data
                this.recetasFiltradas = response.data.data
            })
            .catch(error => {
                console.log(error)
            })
    },
    watch: {
        searchTerm() {
            this.search()
        }
    },
    methods: {
        search() {
            if (this.searchTerm === '') {
                this.recetasFiltradas = this.recetas
            } else {
                this.recetasFiltradas = this.recetas.filter(receta => {
                    return receta.attributes.Titulo.toLowerCase().includes(this.searchTerm.toLowerCase())
                })
            }
        }
    }
}
</script>


<style>
.HomePage {
    background-color: #ffd0cb;
    padding: 50px 0;
}

.HomePage-search-container {
    display: flex;
    justify-content: center;
    margin: 50px 0;
}

.HomePage-search-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 600px;
    background-color: #f5f5f5;
    border-radius: 25px;
    padding: 5px 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.HomePage-search-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    width: 600px;
    margin-right: 10px;
}

.HomePage-search-button {
    background-color: #af7c4c;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    padding: 10px 20px;
    cursor: pointer;
}

.HomePage-cardMain {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin: 20px;
    width: 300px;
    height: 400px;
    transition: transform 0.3s ease-in-out;
}

.HomePage-cardMain:hover {
    transform: scale(1.02);
}

.HomePage-card-content {
    padding: 10px;
}

.HomePage-title {
    font-size: 24px;
    margin: 0;
}

.HomePage-username {
    margin: 5px 0 0;
    font-size: 14px;
    color: #808080;
}

.HomePage-card-image {
    height: 300px;
    overflow: hidden;
}

.HomePage-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>