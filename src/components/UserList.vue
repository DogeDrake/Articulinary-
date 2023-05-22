<template>
    <div class="HomePage">
        <div class="HomePage-section">
            <h2 class="HomePage-section-title">
                Últimas Recetas
            </h2>
            <div class="HomePage-recipe-cards-container">
                <div class="HomePage-arrow" @click="prevRecetas('ultimasRecetas')">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div class="HomePage-recipe-cards">
                    <div v-for="receta in getUltimasRecetasOrdenadas()" :key="receta.id" class="HomePage-cardMain">
                        <router-link class="custom-link" :to="{ name: 'UserDetails', params: { id: receta.id } }">
                            <div class="HomePage-card-content">
                                <h2 class="HomePage-title">{{ receta.attributes.Titulo }}</h2>
                                <p class="HomePage-username">{{ receta.attributes.user.data.attributes.username }}</p>
                            </div>
                            <div class="HomePage-card-image">
                                <img :src="receta.attributes.Imagen" alt="Imagen de la receta" />
                            </div>
                        </router-link>
                        <div class="dialogue-box">
                            <div class="HomePage-dialogue-box-content">
                                <h3 style="color:red">Ingredientes: </h3>
                                <pre>{{ receta.attributes.IngredientesTexto }}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="HomePage-arrow" @click="nextRecetas('ultimasRecetas')">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        </div>

        <div class="HomePage-section">
            <h2 class="HomePage-section-title">
                Recetas más gustadas
            </h2>
            <div class="HomePage-recipe-cards-container">
                <div class="HomePage-arrow" @click="prevRecetas('recetasGustadas')">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div class="HomePage-recipe-cards">
                    <div v-for="receta in getRecetasGustadas()" :key="receta.id" class="HomePage-cardMain">
                        <router-link class="custom-link" :to="{ name: 'UserDetails', params: { id: receta.id } }">
                            <div class="HomePage-card-content">
                                <h2 class="HomePage-title">{{ receta.attributes.Titulo }}</h2>
                                <p class="HomePage-likes">{{ receta.likes }} Likes</p>
                                <!-- Mostrar número de Likes -->
                            </div>
                            <div class="HomePage-card-image">
                                <img :src="receta.attributes.Imagen" alt="Imagen de la receta" />
                            </div>
                        </router-link>

                        <div class="dialogue-box">
                            <div class="HomePage-dialogue-box-content">
                                <h3 style="color:red">Ingredientes: </h3>
                                <pre>{{ receta.attributes.IngredientesTexto }}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="HomePage-arrow" @click="nextRecetas('recetasGustadas')">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            recetas: [], // Arreglo para todas las recetas
            recetasFiltradas: [], // Arreglo para las recetas filtradas
            ultimasRecetas: [], // Arreglo para las últimas recetas
            recetasGustadas: [], // Arreglo para las recetas más gustadas
            ultimasRecetasIndex: 0,
            recetasGustadasIndex: 0,
        };
    },
    mounted() {
        axios
            .get("http://localhost:1337/api/Recetas", {
                params: {
                    populate: "*",
                    "pagination[limit]": 80,
                },
            })
            .then((response) => {
                this.recetas = response.data.data;
                this.recetasFiltradas = response.data.data;
                this.getUltimasRecetasOrdenadas();
                this.ordenarRecetasGustadas();
            })
            .catch((error) => {
                console.log(error);
            });
    },
    methods: {
        getUltimasRecetas() {
            return this.ultimasRecetas.slice(
                this.ultimasRecetasIndex,
                this.ultimasRecetasIndex + 6
            );
        },
        getRecetasGustadas() {
            return this.recetasGustadas.slice(
                this.recetasGustadasIndex,
                this.recetasGustadasIndex + 6
            );
        },
        prevRecetas(section) {
            if (section === "ultimasRecetas") {
                if (this.ultimasRecetasIndex > 0) {
                    this.ultimasRecetasIndex -= 6;
                }
            } else if (section === "recetasGustadas") {
                if (this.recetasGustadasIndex > 0) {
                    this.recetasGustadasIndex -= 6;
                }
            }
        },
        getUltimasRecetasOrdenadas() {
            const ultimasRecetas = this.recetas.slice(
                this.ultimasRecetasIndex,
                this.ultimasRecetasIndex + 6
            );
            this.ultimasRecetas = ultimasRecetas; // Actualiza el arreglo de últimas recetas
            return this.ultimasRecetas; // Agregar el retorno del arreglo ordenado
        },
        nextRecetas(section) {
            if (section === "ultimasRecetas") {
                if (this.ultimasRecetasIndex + 6 < this.recetasFiltradas.length) {
                    this.ultimasRecetasIndex += 6;
                }
            } else if (section === "recetasGustadas") {
                if (this.recetasGustadasIndex + 6 < this.recetasGustadas.length) {
                    this.recetasGustadasIndex += 6;
                }
            }
        },
        ordenarRecetasGustadas() {
            // Filtra las recetas que tienen LikesID definido
            const recetasConLikes = this.recetasFiltradas.filter(
                (receta) => receta.attributes.LikesID
            );

            // Calcula el número de likes para cada receta
            recetasConLikes.forEach((receta) => {
                const likesArray = receta.attributes.LikesID.split(",");
                receta.likes = likesArray.length;
            });

            // Ordena las recetas según el número de likes de mayor a menor
            recetasConLikes.sort((a, b) => b.likes - a.likes);

            // Actualiza el arreglo de recetas más gustadas
            this.recetasGustadas = recetasConLikes;
        },
    },
};
</script>

<style>
.HomePage {
    background-color: #ffd0cb;
    padding: 50px 0;
    overflow-x: hidden;
}

.HomePage-section {
    margin-bottom: 20px;
}

.HomePage-section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.HomePage-recipe-cards-container {
    display: flex;
    align-items: center;
    overflow-x: auto;
}

.HomePage-recipe-cards {
    display: flex;
    flex-wrap: nowrap;
    padding: 20px;
    scroll-behavior: smooth;
}

.HomePage-cardMain {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-right: 10px;
    width: 290px;
    height: 375px;
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

.HomePage-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    width: 30px;
    height: 100px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: background-color 0.3s;
}

.HomePage-arrow i {
    color: #000;
}

.HomePage-arrow:hover {
    background-color: #616161;
}

.dialogue-box {
    width: 100%;
    position: absolute;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    z-index: 1;
    visibility: hidden;
}

.HomePage-cardMain:hover .dialogue-box {
    visibility: visible;
}
</style>
