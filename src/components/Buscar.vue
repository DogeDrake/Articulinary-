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
                    <input type="range" id="people" v-model="Gente" min="0" max="20">
                    <span>Para {{ Gente }} personas (o menos)</span>
                </div>
                <div class="search-filter-option">
                    <label for="time">Tiempo de Cocinado (Máximo)</label><br>
                    <input type="range" id="time" v-model="Tiempo" min="0" max="300">
                    <span>{{ Tiempo }} min (o menos)</span>
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
                <div class="search-recipe-horizontal">
                    <button @click="applyFilters" class="submit-filters-button">Aplicar Filtros</button>
                    <div v-if="filterApplied">
                        <button @click="clearFilters" class="clear-filters-button">Eliminar Filtros</button>
                    </div>
                </div>
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
            Gente: 20,
            Tiempo: 300,
            vegan: false,
            vegetarian: false,
            glutenFree: false,
            lactoseFree: false,
            lowSugar: false,
            recetas: [],
            filteredRecetas: [],
            filterApplied: false,
        };
    },
    computed: {
        filteredRecipes() {
            return this.filteredRecetas.length > 0 ? this.filteredRecetas : this.recetas;
        },
    },
    methods: {
        searchRecipes() {
            axios
                .get('http://localhost:1337/api/Recetas', {
                    params: {
                        populate: '*',
                        'pagination[limit]': 80,
                    },
                })
                .then((response) => {
                    this.recetas = response.data.data;
                    this.applySearchFilters();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        applySearchFilters() {
            this.filteredRecetas = this.recetas.filter((recipe) => {
                const lowerCaseSearchQuery = this.searchQuery.toLowerCase();
                const includesTitle = recipe.attributes.Titulo.toLowerCase().includes(lowerCaseSearchQuery);
                const includesIngredients = recipe.attributes.IngredientesTexto.toLowerCase().includes(lowerCaseSearchQuery);

                return (
                    this.searchQuery === '' || includesTitle || includesIngredients
                );
            });
        },
        applyFilters() {
            this.filteredRecetas = this.filteredRecetas.filter((recipe) => {
                return (
                    recipe.attributes.Gente <= this.Gente &&
                    recipe.attributes.Tiempo <= this.Tiempo &&
                    (!this.vegan || recipe.attributes.IsVegano) &&
                    (!this.vegetarian || recipe.attributes.IsVegetariano) &&
                    (!this.glutenFree || recipe.attributes.IsSinGluten) &&
                    (!this.lactoseFree || recipe.attributes.IsSinLactosa) &&
                    (!this.lowSugar || recipe.attributes.IsBajoEnAzucar)
                );
            });
            this.filterApplied =
                this.Gente > 1 ||
                this.Tiempo > 1 ||
                this.vegan ||
                this.vegetarian ||
                this.glutenFree ||
                this.lactoseFree ||
                this.lowSugar;
        },
        clearFilters() {
            this.Gente = 20;
            this.Tiempo = 300;
            this.vegan = false;
            this.vegetarian = false;
            this.glutenFree = false;
            this.lactoseFree = false;
            this.lowSugar = false;

            this.applyFilters();
        },
    },
    mounted() {
        this.searchRecipes();
    },
};
</script>


<style scoped>
.search-recipe-horizontal {
    display: flex;
    align-items: center;
}

.recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
}

.clear-filters-button {
    background-color: red;
}

.submit-filters-button {
    margin-right: 10px;
    background-color: #007bff;
}

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
    border-radius: 0 20px 0 0;
    background-color: white;
    margin-right: 20px;
    border: 1px solid rgba(0, 0, 0, 0.438);
}

.search-filter-options h3 {
    font-size: 35px;
    margin-bottom: 15px;
    color: #333;
    font-family: 'Work Sans', sans-serif;
    font-weight: 900;
    justify-content: space-between;
    margin-bottom: 20px;
    color: white;
    text-shadow: -1px 1px 0 #000,
        1px 1px 0 #000,
        1px -1px 0 #000,
        -1px -1px 0 #000;
}

.search-filter-options button {
    margin-top: auto;
    padding: 10px 20px;
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
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
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
    height: 200px;
    /* Ajusta aquí el tamaño de altura deseado */
    object-fit: contain;
    object-position: center;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    /* Agregamos display flex */
    align-items: center;
    /* Centramos verticalmente */
    justify-content: center;
    /* Centramos horizontalmente */
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
