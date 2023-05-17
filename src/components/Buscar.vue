<template>
    <div class="search-container">
        <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="Buscar...">
            <button @click="searchRecipes">Buscar</button>
        </div>
        <div class="search-content">
            <div class="search-filter-options">
                <h3>Filtros</h3>
                <div class="search-filter-option">
                    <label for="people">Gente</label><br>
                    <input type="range" id="people" v-model="Gente" min="1" max="20">
                    <span>Para {{ Gente }} personas</span>
                </div>
                <div class="search-filter-option">
                    <label for="time">Tiempo de Cocinado(Maximo)</label><br>
                    <input type="range" id="time" v-model="Tiempo" min="1" max="300">
                    <span>{{ Tiempo }} min</span>
                </div>
                <div class="search-filter-option">
                    <label>Opciones Extra</label><br>
                    <label>
                        <input type="checkbox" v-model="vegan"> Vegano
                    </label><br>
                    <label>
                        <input type="checkbox" v-model="vegetarian"> Vegetariano
                    </label><br>
                    <label>
                        <input type="checkbox" v-model="glutenFree"> Sin Gluten
                    </label><br>
                    <label>
                        <input type="checkbox" v-model="lactoseFree"> Sin Lactosa
                    </label><br>
                    <label>
                        <input type="checkbox" v-model="lowSugar"> Bajo en Azúcar
                    </label><br>
                </div>
                <button @click="applyFilters">Aplicar Filtros</button>
            </div>
            <div class="search-recipe-list">
                <div class="search-recipe-card" v-for="recipe in filteredRecipes" :key="recipe.id">
                    <router-link class="search-custom-link" :to="{ name: 'UserDetails', params: { id: recipe.id } }">
                        <img class="search-recipe-image" :src="recipe.attributes.Imagen" alt="Recipe Image">
                        <h3 class="search-recipe-title">{{ recipe.attributes.Titulo }}</h3>
                        <p class="search-recipe-author">{{ recipe.attributes.user.data.attributes.username }}</p>
                        <p class="search-recipe-time">Tiempo: {{ recipe.attributes.Tiempo }} min</p>
                        <p class="search-recipe-people">Personas: {{ recipe.attributes.Gente }}</p>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            searchQuery: '',
            Gente: 1,
            Tiempo: 1,
            vegan: false,
            vegetarian: false,
            glutenFree: false,
            lactoseFree: false,
            lowSugar: false,
            recetas: [],
            filteredRecetas: []
        };
    },
    computed: {
        filteredRecipes() {
            if (this.filteredRecetas.length > 0) {
                return this.filteredRecetas;
            } else {
                return this.recetas;
            }
        }
    },
    methods: {
        searchRecipes() {
            axios
                .get('http://localhost:1337/api/Recetas', {
                    params: {
                        populate: '*',
                        'pagination[limit]': 80,
                    }
                })
                .then(response => {
                    this.recetas = response.data.data;

                    this.filteredRecetas = this.recetas.filter(recipe => {
                        return recipe.attributes.Titulo.toLowerCase().includes(this.searchQuery.toLowerCase());
                    });

                })
                .catch(error => {
                    console.log(error);
                });
        },
        applyFilters() {
            this.filteredRecetas = this.recetas.filter(recipe => {
                const lowerCaseSearchQuery = this.searchQuery.toLowerCase();
                const includesSearchQuery = recipe.attributes.Titulo.toLowerCase().includes(lowerCaseSearchQuery);

                return (
                    (lowerCaseSearchQuery === '' || includesSearchQuery) &&
                    recipe.attributes.Gente >= this.Gente &&
                    recipe.attributes.Tiempo <= this.Tiempo &&
                    (!this.vegan || recipe.attributes.IsVegano) &&
                    (!this.vegetarian || recipe.attributes.IsVegetariano) &&
                    (!this.glutenFree || recipe.attributes.IsSinGluten) &&
                    (!this.lactoseFree || recipe.attributes.IsSinLactosa) &&
                    (!this.lowSugar || recipe.attributes.IsBajoEnAzucar)
                );
            });
        }
    },
    mounted() {
        this.searchRecipes();
    }
};
</script>

<style>
.search-custom-link {
    text-decoration: none;
}

.search-container {
    display: flex;
    flex-direction: column;
}

.search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f2f2f2;
}

.search-bar input[type="text"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 90%;
}

.search-bar button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-content {
    display: flex;
    margin-top: 20px;
}

.search-filter-options {
    flex-shrink: 0;
    width: 25%;
    padding: 20px;
    background-color: #f9f9f9;
    margin-right: 20px;
}

.search-filter-options h3 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333;
}

.search-filter-options button {
    margin-top: auto;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-filter-option {
    margin-bottom: 10px;
}

.search-filter-option label {
    display: block;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}

.search-filter-option input[type="range"] {
    width: 100%;
}

.search-recipe-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
}

.search-recipe-card {
    flex-basis: 400px;
    max-width: 300px;
    background-color: #f2f2f2;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-recipe-image {
    width: 100%;
    height: 200px; /* Ajusta aquí el tamaño de altura deseado */
    object-fit: contain;
    object-position: center;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex; /* Agregamos display flex */
    align-items: center; /* Centramos verticalmente */
    justify-content: center; /* Centramos horizontalmente */
    object-fit: cover;
}

.search-recipe-title {
    font-size: 18px;
    margin-bottom: 5px;
}

.search-recipe-author {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.search-recipe-time,
.search-recipe-people {
    font-size: 14px;
    margin-bottom: 5px;
}

.search-recipe-people:last-child {
    margin-bottom: 0;
}
</style>
