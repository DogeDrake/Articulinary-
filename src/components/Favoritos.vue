<template>
    <div>
        <div class="Favoritos-search-container" v-if="isHome">
            <div class="Favoritos-search-wrapper">
                <input type="text" v-model="searchTerm" placeholder="Buscar entre tus favoritos..."
                    class="Favoritos-search-input" />
                <button @click="search" class="Favoritos-search-button">Buscar</button>
            </div>
        </div>
        <div class="Favoritos-grid">
            <div v-for="receta in recetasFiltradas" :key="receta.id">
                <router-link class="custom-link" :to="{ name: 'UserDetails', params: { id: receta.id } }">
                    <div class="Favoritos-cardMain">
                        <div class="Favoritos-card-content">
                            <h2 class="Favoritos-title">{{ receta.attributes.Titulo }}</h2>
                            <p>{{ receta.attributes.LikesID }}</p>
                            <p class="Favoritos-username">{{ receta.attributes.user.data.attributes.username }}</p>
                        </div>
                        <div class="Favoritos-card-image">
                            <img :src="receta.attributes.Imagen" alt="Imagen de la receta" />
                        </div>
                    </div>
                </router-link>
            </div>
            <div v-if="recetasFiltradas.length === 0" class="Favoritos-no-recipes">
                Añade recetas a favoritos y empezarán a aparecer aquí.
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
var userIdLogin = localStorage.getItem('UserId');

export default {
    data() {
        return {
            recetas: [],
            recetasFiltradas: [],
            isHome: true,
            LikedVar: null,
            searchTerm: ''
        };
    },
    mounted() {
        axios
            .get('http://localhost:1337/api/Recetas', {
                params: {
                    populate: '*',
                    'pagination[limit]': 80,
                }
            })
            .then(response => {
                this.recetas = response.data.data;
                this.filterRecetasByLikedUser();
            })
            .catch(error => {
                console.log(error);
            });
    },
    watch: {
        searchTerm() {
            this.search();
        }
    },
    methods: {
        search() {
            if (this.searchTerm === '') {
                this.filterRecetasByLikedUser();
            } else {
                this.recetasFiltradas = this.recetasFiltradas.filter(receta => {
                    return receta.attributes.Titulo
                        .toLowerCase()
                        .includes(this.searchTerm.toLowerCase());
                });
            }
        },
        filterRecetasByLikedUser() {
            this.recetasFiltradas = this.recetas.filter(receta => {
                const likesID = receta.attributes.LikesID;
                return likesID && likesID.split(',').includes(userIdLogin.toString());
            });
        }
    }
};
</script>
  
<style>
.Favoritos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px;
}

.Favoritos-search-container {
    display: flex;
    justify-content: center;
    margin: 50px 0;
}

.Favoritos-search-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 600px;
    background-color: #f5f5f5;
    border-radius: 25px;
    padding: 5px 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.Favoritos-search-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    width: 100%;
    margin-right: 10px;
}

.Favoritos-search-button {
    background-color: #af4c8e;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    padding: 10px 20px;
    cursor: pointer;
}

.Favoritos-cardMain {
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

.Favoritos-cardMain:hover {
    transform: scale(1.02);
}

.Favoritos-card-content {
    padding: 10px;
}

.Favoritos-title {
    font-size: 24px;
    margin: 0;
}

.Favoritos-username {
    margin: 5px 0 0;
    font-size: 14px;
    color: #808080;
}

.Favoritos-card-image {
    height: 300px;
    overflow: hidden;
}

.Favoritos-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.Favoritos-no-recipes {
    text-align: center;
    margin-top: 20px;
    font-style: italic;
    color: #808080;
}
</style>