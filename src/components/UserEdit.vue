<template>
    <div class="user-profile-edit">
        <h2>Edit Profile</h2>
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="form.username" required>
        </div>
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="form.name" required>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" required>
        </div>
        <div class="form-group">
            <label for="password">New Password</label>
            <input type="password" id="password" v-model="form.password" required>
        </div>
        <div class="form-group">
            <label for="oldPassword">Old Password</label>
            <input type="password" id="oldPassword" v-model="form.oldPassword" required>
        </div>
        <div class="form-group">
            <label for="profileImage">Profile Image</label>
            <input type="file" id="profileImage" ref="profileImage" @change="uploadProfileImage">
        </div>
        <button type="button" @click="submitForm">Save Changes</button>
    </div>
</template>

<script>
import axios from "axios";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

var oldpass;
var userId = localStorage.getItem("UserId");

export default {
    name: "UserProfileEdit",
    data() {
        return {
            form: {
                username: "",
                name: "",
                email: "",
                password: "",
                Oldimg: "",
                oldPassword: "",
            },
            profileImage: null,
            profileImageUrl: null,
        };
    },
    mounted() {
        // Hacer una solicitud GET para obtener los datos del usuario
        axios
            .get(`http://localhost:1337/api/Users/${userId}`)
            .then((response) => {
                const user = response.data;
                // Asignar los datos del usuario a las propiedades del objeto form
                this.form.username = user.username;
                this.form.name = user.RealName;
                this.form.email = user.email;
                this.form.password = user.password;
                this.form.Oldimg = user.UserImg;
                oldpass = user.password;
            })
            .catch((error) => {
                console.log(error);
            });
    },
    methods: {
        uploadProfileImage() {
            const profileImageFile = this.$refs.profileImage.files[0];
            const storageRef = ref(storage, `profile-images/${profileImageFile.name}`);
            uploadBytes(storageRef, profileImageFile)
                .then((snapshot) => {
                    console.log("Profile image uploaded");
                    return getDownloadURL(snapshot.ref);
                })
                .then((downloadURL) => {
                    console.log("Profile image URL:", downloadURL);
                    this.profileImageUrl = downloadURL;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        submitForm() {
            // Verificar si la contraseña antigua es igual a la contraseña obtenida de la API
            if (this.form.oldPassword === oldpass) {
                const user = {
                    username: this.form.username,
                    RealName: this.form.name,
                    email: this.form.email,
                    password: this.form.password,
                    role: 1,
                    UserImg: this.profileImageUrl ? this.profileImageUrl : this.form.Oldimg,
                };

                axios
                    .put(`http://localhost:1337/api/Users/${userId}`, user, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("Token")}`,
                        },
                    })
                    .then((response) => {
                        console.log(response.data);

                        
                        // Handle successful response
                    })
                    .catch((error) => {
                        console.log(error);
                        // Handle error
                    });
            } else {
                // La contraseña antigua ingresada es incorrecta
                console.log("La contraseña antigua ingresada es incorrecta");
            }
        },
    },
};
</script>



<style scoped>
.user-profile-edit {
    max-width: 600px;
    margin: 0 auto;
}

h2 {
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
}

input {
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

button[type="submit"] {
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

button[type="submit"]:hover {
    background-color: #0062cc;
}
</style>
