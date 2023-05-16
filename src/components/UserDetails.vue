<template>
    <div class="card-container">
        <div v-for="receta in recetas" :key="receta.id" class="card">
            <div class="card-header">
                <h1 class="card-title">{{ receta.attributes.Titulo }}</h1>
                <button @click="toggleLike(receta.id)" class="card-heart-button">
                    <span v-if="isLiked(receta.id)">
                        <i class="fas fa-heart card-icon-large" style="color: #ff0000;"></i>
                    </span>
                    <span v-else>
                        <i class="far fa-heart card-icon-large"></i>
                    </span>
                </button>
            </div>
            <p>{{ receta.attributes.user.data.attributes.username }}</p>
            <div class="card-details">
                <div class="card-column">
                    <div>
                        <h2>Ingredientes</h2>
                        <pre class="card-detail">{{ receta.attributes.IngredientesTexto }}</pre>
                    </div>
                    <div>
                        <h2>Pasos</h2>
                        <pre class="card-detail">{{ receta.attributes.PasosTexto }}</pre>
                    </div>
                </div>
                <div class="card-column">
                    <div class="card-image">
                        <img :src="receta.attributes.Imagen" alt="Imagen de la receta" />
                    </div>
                </div>
            </div>
            <router-link to="/home">Volver a Home</router-link>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
var userIdLogin = localStorage.getItem("UserId");

export default {
    data() {
        return {
            recetas: [],
            likedPosts: [], // Lista de IDs de publicaciones que han sido marcadas
            LikedVar: null
        }
    },
    created() {
        const recipeId = this.$route.params.id
        this.getRecipe(recipeId)
    },
    methods: {
        toggleLike(postId) {
            if (this.isLiked(postId)) {
                this.unlikePost(postId);
                this.getRecipe(postId, () => {
                    this.desgustar(postId);
                    this.getRecipe(postId);
                });
            } else {
                this.likePost(postId);
                this.gustar(postId);
                this.getRecipe(postId);
            }
        },
        likePost(postId) {
            // Realizar acciones para marcar la publicación como 'liked'
            this.likedPosts.push(postId)
        },
        unlikePost(postId) {
            // Realizar acciones para desmarcar la publicación como 'liked'
            const index = this.likedPosts.indexOf(postId)
            if (index > -1) {
                this.likedPosts.splice(index, 1)
            }
        },
        isLiked(postId) {
            const likedVarString = this.LikedVar;
            if (likedVarString) {
                const likedVarArray = likedVarString.split(",").map(Number);
                return likedVarArray.includes(Number(userIdLogin));
            }
            return false;
        },
        gustar(postId) {
            var likedVarString = this.LikedVar;
            console.log(likedVarString)
            if (likedVarString !== "") {
                console.log("Entra en el IF")
                var likedVarArray = likedVarString.split(",").map(Number);
                var uniqueLikedVarArray = Array.from(new Set(likedVarArray));
                uniqueLikedVarArray.push(userIdLogin)
                likedVarString = uniqueLikedVarArray.join(",");
            } else {
                console.log("Pasa al ELSE")
                likedVarString = userIdLogin
            }

            const data = {
                LikesID: likedVarString,
            };
            axios.put(`http://localhost:1337/api/Recetas/${postId}`, { data })
                .then(response => {
                    /*
                    this.getRecipe(postId)
                    */
                    console.log(response.data);
                    console.log(userIdLogin);
                    // Handle successful response
                })
                .catch(error => {
                    console.log(error);
                    console.log(userIdLogin);
                    // Handle error
                });
        },
        desgustar(postId) {
            console.log("Desgustar marcado , llegan datos: " + this.LikedVar)
            var likedVarString = this.LikedVar;
            var likedVarArray = likedVarString.split(",").map(Number);
            var uniqueLikedVarArray = Array.from(new Set(likedVarArray));
            console.log("Los datos que se van a purgar son: " + uniqueLikedVarArray)
            console.log("El dato que los va a purgar es:" + userIdLogin)
            var updatedArray = uniqueLikedVarArray.filter(function (number) {
                return number !== Number(userIdLogin);
            });
            uniqueLikedVarArray = updatedArray;
            likedVarString = uniqueLikedVarArray.join(",");

            console.log("Datos que se mandan a la API: " + likedVarString)


            const data = {
                LikesID: likedVarString,
            };

            axios.put(`http://localhost:1337/api/Recetas/${postId}`, { data })
                .then(response => {
                    console.log(response.data);
                    console.log(userIdLogin);
                    // Handle successful response
                })
                .catch(error => {
                    console.log(error);
                    console.log(userIdLogin);
                    // Handle error
                });
        },

        getRecipe(recipeId, callback) {
            axios
                .get("http://localhost:1337/api/Recetas", {
                    params: {
                        filters: {
                            id: recipeId,
                        },
                        populate: "*",
                    },
                })
                .then((response) => {
                    this.recetas = response.data.data;
                    console.log(this.recetas);
                    this.LikedVar = this.recetas[0].attributes.LikesID;
                    console.log("Datos LikedVar en GET " + this.LikedVar);
                    if (typeof callback === "function") {
                        callback();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
}
</script>
  

<style>
html {
    font-family: 'Roboto', sans-serif;
    background-color: #ffd0cb;
    text-decoration: none;
}

.card-container {
    background-color: #ffd0cb;
    padding: 10px;
    box-sizing: border-box;
}

.card {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-title {
    margin: 0;
    margin-right: 1rem;
}

.card-heart-button {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    margin-left: 1rem;
}

.card-icon-large {
    font-size: 50px;
}

.card-details {
    display: flex;
    margin-top: 1rem;
}

.card-column {
    flex-basis: 50%;
}

.card-image {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.card-image img {
    max-width: 90%;
    height: auto;
    border-radius: 5px;
}

.card-detail {
    border-radius: 5px;
    white-space: pre-wrap;
    line-height: 25px;
    padding: 20px;
    background-color: #ffd0cb;
}

.router-link {
    color: blue;
}
</style>