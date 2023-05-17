<template>
    <div class="upload-recipe-container">
        <h2>Añadir una nueva receta</h2>
        <form @submit.prevent="submitForm">
            <div class="upload-form-group">
                <label for="title">Título</label>
                <input type="text" id="title" v-model="recipe.title" required>
            </div>
            <div class="upload-form-group upload-inline-group">
                <div>
                    <label for="people">Personas</label>
                    <input type="number" id="people" v-model="recipe.people" required>
                </div>
                <div>
                    <label for="time">Tiempo de cocinado (min)</label>
                    <input type="number" id="time" v-model="recipe.time" required>
                </div>
            </div>
            <div class="upload-form-group">
                <label>Ingredientes</label>
                <div class="upload-ingredients-container">
                    <div v-for="(ingredient, index) in recipe.ingredients" :key="index">
                        <input type="text" v-model="recipe.ingredients[index]" required>
                        <button type="button" class="upload-remove-button"
                            @click="removeIngredient(index)">Eliminar</button>
                    </div>
                    <button class="upload-add-button" type="button" @click="addIngredient">Añadir ingrediente</button>
                </div>
            </div>
            <div class="upload-form-group">
                <label>Procedimientos</label>
                <div class="upload-procedures-container">
                    <div v-for="(procedure, index) in recipe.procedures" :key="index">
                        <input type="text" v-model="recipe.procedures[index]" required>
                        <button type="button" class="upload-remove-button" @click="removeProcedure(index)">Eliminar</button>
                    </div>
                    <button type="button" @click="addProcedure">Añadir procedimiento</button>
                </div>
            </div>
            <div class="upload-form-group">
                <label for="image">Imagen</label>
                <input type="file" id="image" ref="myimage" @change="uploadImage($event)">
                <!--<button @click="uploadImage">subir imagen</button>-->
            </div>

            <div class="upload-form-group">
                <button class="upload-toggle-button" type="button" @click="toggleDropdown">
                    <label class=" upload-toggle-block">Contenido Extra</label>
                    <span class="upload-toggle-icon" :class="{ open: dropdownOpen }"></span>
                </button>
                <transition name="fade">
                    <div class="upload-dropdown" v-if="dropdownOpen">

                        <label>
                            <input type="checkbox" v-model="recipe.IsVegano" value="Vegano">
                            Vegano
                        </label>
                        <label>
                            <input type="checkbox" v-model="recipe.IsVegetariano" value="Vegetariano">
                            Vegetariano
                        </label>
                        <label>
                            <input type="checkbox" v-model="recipe.IsSinGluten" value="Sin Gluten">
                            Sin Gluten
                        </label>
                        <label>
                            <input type="checkbox" v-model="recipe.IsSinLactosa" value="Sin Lactosa">
                            Sin Lactosa
                        </label>
                        <label>
                            <input type="checkbox" v-model="recipe.IsBajoEnAzucar" value="Bajo en Azúcar">
                            Bajo en Azúcar
                        </label>
                    </div>
                </transition>
            </div>
            <button class="upload-button" type="submit">Enviar</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
var userIdLogin = localStorage.getItem("UserId");
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage"

export default {
    data() {
        return {
            recipe: {
                title: '',
                people: null,
                time: null,
                ingredients: [],
                procedures: [],
                image: null,
                imageUrl: '', // Referencia de la imagen en Firebase
                IsVegano: false,
                IsVegetariano: false,
                IsSinGluten: false,
                IsSinLactosa: false,
                IsBajoEnAzucar: false,
                dietaryRestrictions: [],
            },
            dropdownOpen: false,
        };
    },
    methods: {
        addIngredient() {
            this.recipe.ingredients.push('');
        },
        removeIngredient(index) {
            this.recipe.ingredients.splice(index, 1);
        },
        addProcedure() {
            this.recipe.procedures.push('');
        },
        removeProcedure(index) {
            this.recipe.procedures.splice(index, 1);
        },
        uploadImage() {
            const file = this.$refs.myimage.files[0];
            const storageRef = ref(storage, `notes/images/${file.name}`);

            uploadBytes(storageRef, file)
                .then((snapshot) => {
                    return getDownloadURL(snapshot.ref);
                })
                .then((url) => {
                    console.log("URL de la imagen:", url);
                    // Guardar la URL en la propiedad de la receta o en la base de datos
                    this.recipe.imageUrl = url;
                })
                .catch((error) => {
                    console.log("Error al subir la imagen:", error);
                });
        },
        submitForm() {
            let proceduresStr = '';
            for (let i = 0; i < this.recipe.procedures.length; i++) {
                proceduresStr += `${i + 1} - ${this.recipe.procedures[i]}\n`;
            }
            var ingredientsStr = this.recipe.ingredients.join('\n');
            const data = {
                Gente: this.recipe.people,
                Imagen: this.recipe.imageUrl, // Usar la referencia de la imagen en Firebase
                IngredientesTexto: ingredientsStr,
                PasosTexto: proceduresStr,
                Tiempo: this.recipe.time,
                Titulo: this.recipe.title,
                user: userIdLogin,
                IsVegano: this.recipe.IsVegano,
                IsVegetariano: this.recipe.IsVegetariano,
                IsSinGluten: this.recipe.IsSinGluten,
                IsSinLactosa: this.recipe.IsSinLactosa,
                IsBajoEnAzucar: this.recipe.IsBajoEnAzucar,
            };
            console.log(data);

            axios
                .post('http://localhost:1337/api/Recetas', { data }, {
                    params: {
                        populate: '*',
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    this.recipe.imageUrl = response.data.Imagen.url;
                    this.$router.push({ name: 'UserList' });
                })
                .catch((error) => {
                    console.log(error.response.data);
                });
        },
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
    },
};
</script>


<style>
.upload-recipe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}

.upload-form-group input[type="text"],
.upload-form-group input[type="number"],
.upload-form-group input[type="file"] {
    width: 100%;
    margin-bottom: 20px;
    height: 30px;
    border: none;
    border-bottom: 2px solid salmon;
    outline: none;
}

.upload-form-group label {
    font-size: 24px;
    margin-bottom: 20px;
}

.upload-inline-group {
    display: flex;
    justify-content: space-between;
}

.upload-inline-group div {
    width: 40%;
}

.upload-ingredients-container,
.upload-procedures-container {
    margin-bottom: 20px;
    width: 100%;
}

.upload-ingredients-container input[type="text"],
.upload-procedures-container input[type="text"] {
    width: 80%;
    margin-bottom: 10px;
    height: 30px;
    border: none;
    border-bottom: 2px solid salmon;
    outline: none;
}

.upload-ingredients-container .upload-remove-button,
.upload-procedures-container .upload-remove-button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: salmon;
    border: none;
    color: white;
}

.upload-ingredients-container .upload-remove-button:hover,
.upload-procedures-container .upload-remove-button:hover {
    background-color: red;
}

.upload-button {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px 20px;
    border: none;
    height: 60px;
    width: 200px;
    background-color: salmon;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.upload-ingredients-container .upload-add-button,
.upload-procedures-container button[type="button"] {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: salmon;
    border: none;
    color: white;
}

.upload-ingredients-container .upload-add-button:hover,
.upload-procedures-container button[type="button"]:hover {
    background-color: #ff9900;
}

.upload-dropdown {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
}

.upload-dropdown label {
    margin-bottom: 5px;
}

.upload-toggle-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.upload-toggle-block {
    background-color: salmon;
    padding: 5px;
    border-radius: 5px;
}

.upload-toggle-icon {
    display: inline-block;
    width: 10px;
    margin: 10px;
    height: 10px;
    border-top: 2px solid salmon;
    border-right: 2px solid salmon;
    transform: rotate(135deg);
    transition: transform 0.3s;
}

.upload-toggle-icon.open {
    transform: rotate(0deg);
}

.slide-enter-active,
.slide-leave-active {
    transition: max-height 0.3s ease-out;
}

.slide-enter,
.slide-leave-to {
    max-height: 0;
    overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>