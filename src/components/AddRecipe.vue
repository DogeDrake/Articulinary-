<template>
    <div class="upload-recipe-container">
        <h2>Añadir una nueva receta</h2>
        <form @submit.prevent="submitForm">
            <div class="upload-form-group">
                <label for="title">Título</label>
                <input type="text" id="title" v-model="recipe.title" required>
            </div>
            <div class="upload-form-group">
                <label for="people">Personas</label>
                <input type="number" id="people" v-model="recipe.people" required>
            </div>
            <div class="upload-form-group">
                <label for="time">Tiempo de cocinado (min)</label>
                <input type="number" id="time" v-model="recipe.time" required>
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
                <input type="file" id="image" @change="uploadImage">
            </div>
            <button class="upload-button" type="submit">Enviar</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import 'firebase/auth';
//import { app } from '../main.js'
import 'firebase/storage';

var userId = localStorage.getItem("UserId");


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
                imageUrl: null // Referencia de la imagen en Firebase
            },
            storageRef: null // Referencia al servicio de almacenamiento de Firebase
        }
    },
    methods: {
        addIngredient() {
            this.recipe.ingredients.push('')
        },
        removeIngredient(index) {
            this.recipe.ingredients.splice(index, 1)
        },
        addProcedure() {
            this.recipe.procedures.push('')
        },
        removeProcedure(index) {
            this.recipe.procedures.splice(index, 1)
        },
        async uploadImage(event) {
            var file = event.target.files[0]
            // Subir imagen a Firebase
            this.storageRef = app.storage().ref(`images/${file.name}`)
            await this.storageRef.put(file)
            // Obtener la referencia de la imagen en Firebase
            const url = await this.storageRef.getDownloadURL()
            this.recipe.imageUrl = url
            // Guardar la imagen en la propiedad de la receta
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                this.recipe.image = reader.result
            }
            reader.onerror = (error) => {
                console.log(error)
            }
        },
        submitForm() {
            let proceduresStr = ''
            for (let i = 0; i < this.recipe.procedures.length; i++) {
                proceduresStr += `${i + 1} - ${this.recipe.procedures[i]}\n`
            }
            var ingredientsStr = this.recipe.ingredients.join('\n')
            const data = {
                Gente: this.recipe.people,
                Imagen: this.recipe.imageUrl, // Usar la referencia de la imagen en Firebase
                IngredientesTexto: ingredientsStr,
                PasosTexto: proceduresStr,
                Tiempo: this.recipe.time,
                Titulo: this.recipe.title,
                user: userId
            }
            console.log(data)

            axios.post('http://localhost:1337/api/Recetas', { data }, {
                params: {
                    populate: '*'
                }
            })
                .then(response => {
                    console.log(response.data)
                    this.recipe.imageUrl = response.data.Imagen.url;
                })
                .catch(error => {
                    console.log(error.response.data)
                })
        }
    }
}
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

.upload-ingredients-container button,
.upload-procedures-container button {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    background-color: salmon;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.upload-ingredients-container button.upload-remove-button,
.upload-procedures-container button.upload-remove-button {
    background-color: red;
    margin: 10px;
}

.upload-ingredients-container button:hover,
.upload-procedures-container button:hover {
    background-color: #ff7f50;
}

.upload-ingredients-container input[type="text"],
.upload-procedures-container input[type="text"],
.upload-ingredients-container button,
.upload-procedures-container button {
    vertical-align: middle;
}

.upload-button {
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    height: 60px;
    width: 200px;
    background-color: salmon;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.upload-button:hover {
    background-color: #ff7f50;
}

.upload-form-group:nth-child(2),
.upload-form-group:nth-child(3) {
    display: inline-block;
    width: 45%;
    margin-right: 10px;
}
</style>
