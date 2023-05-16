<template>
    <div class="container">
        <h2>{{ userId }}</h2>
        <div v-for="receta in recetas" :key="receta.id">
            <h1 class="card-orange">{{ receta.attributes.Titulo }}</h1>
            <p>{{ receta.attributes.user.data.attributes.username }}</p>
            <div style="display: flex; align-items: center; justify-content: center;">
                <p style="margin-right: 1rem">{{ receta.attributes.Gente + " Personas" }}</p>
                <p style="margin-left: 1rem">{{ receta.attributes.Tiempo + " º" }}</p>
            </div>
            <div>
                <h2> Ingredientes </h2>
                <pre class="cardDetail">{{ receta.attributes.IngredientesTexto }}</pre>
            </div>
            <div>
                <h2> Pasos </h2>
                <pre class="cardDetail">{{ receta.attributes.PasosTexto }}</pre>
            </div>
            <button @click="toggleLike(receta.id)">
                {{ isLiked(receta.id) ? 'Desmarcar' : 'Marcar' }}
            </button>
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
                });
            } else {
                this.likePost(postId);
                this.gustar(postId);
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
            // Verificar si la publicación ha sido marcada como 'liked'
            return this.likedPosts.includes(postId)
        },
        gustar(postId) {
            var likedVarString = this.LikedVar;
            console.log(likedVarString)
            if (likedVarString !== null) {
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
            console.log("Desgustar marcado , llegan datos: "+ this.LikedVar)
            var likedVarString = this.LikedVar;
            var likedVarArray = likedVarString.split(",").map(Number);
            var uniqueLikedVarArray = Array.from(new Set(likedVarArray));
            console.log("Los datos que se van a purgar son: " + uniqueLikedVarArray)
            console.log("El dato que los va a purgar es:" + userIdLogin )
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
  

<style >
/* ESTILOS ANDROID STUDIO*/
/* Estilos generales */

html {
    font-family: 'Roboto', sans-serif;
    background-color: #FFD0CB;
}

.container {
    background-color: #FFD0CB;
    padding: 10px;
    box-sizing: border-box;
}

/* Estilos del texto */
.text-center {
    text-align: center;
}

.text-black {
    color: black;
}

.text-bold {
    font-weight: bold;
}

.text-medium {
    font-size: 20px;
}

.text-large {
    font-size: 30px;
}

/* Estilos del LinearLayout */
.flex-column {
    flex-direction: column;
}

/* Estilos del CardView */
.cardDetail {
    border-radius: 5px;
    margin: 20px;
    overflow: hidden;
    background-color: white;
    width: 50%;
    white-space: pre-wrap;
    height: 80%;
    line-height: 25px;
    padding: 20px;
}

.card-orange {
    background-color: #FFBAB3;
}

/* Estilos del NestedScrollView */
.scroll {
    overflow-y: scroll;
}

/* Estilos del CoordinatorLayout */
.fill {
    height: 100%;
}

/* Estilos del LinearLayout dentro del CardView */
.wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px;
}

.wrap p {
    line-height: 20px;
}
</style>