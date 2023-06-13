<template>
    <div class="register-container">
        <div class="register-form">
            <h2>Registro</h2>
            <form>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="password-input">
                        <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" />
                        <span class="password-toggle" @click="togglePasswordVisibility">
                            <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                        </span>
                    </div>
                </div>
                <div class="password-strength-meter">
                        <div class="strength-bar" :style="{ width: passwordStrength + '%' }" :data-strength="passwordStrength">
                        </div>
                    </div>
                <div class="form-group">
                    <label for="rewrite-password">Rewrite Password</label>
                    <input type="password" id="rewrite-password" v-model="rewritePassword" />
                </div>
                <div class="form-group">
                        <div class="inline">
                            <input type="checkbox" id="terms" v-model="acceptTerms" />
                            <label for="terms">Acepto los <a href="Terminos"> Términos y Condiciones </a> </label>
                        </div>
                    </div>
                <button @click.prevent="register">Registrarse</button>
                <span class="error-message" v-if="errorMessage">{{ errorMessage }}</span>
            </form>
            <p>Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            rewritePassword: '',
            showPassword: false,
            errorMessage: '',
            acceptTerms: false,
        };
    },
    computed: {
        passwordStrength() {
            return this.calculatePasswordStrength(this.password);
        },
    },
    methods: {
        register() {
            if (!this.acceptTerms) {
                this.errorMessage = 'Debes aceptar los Términos y Condiciones.';
                return;
            }
            if (!this.username || !this.email || !this.password || !this.rewritePassword) {
                this.errorMessage = 'Por favor, completa todos los campos.';
                return;
            }

            if (this.password !== this.rewritePassword) {
                this.errorMessage = 'Las contraseñas no coinciden.';
                return;
            }

            if (!this.isPasswordValid(this.password)) {
                this.errorMessage = 'La contraseña debe tener al menos una mayúscula, una minúscula, un número y ser de al menos 8 caracteres.';
                return;
            }

            const data = {
                username: this.username,
                email: this.email,
                password: this.password,
                UserImg: 'https://firebasestorage.googleapis.com/v0/b/articullinary.appspot.com/o/notes%2Fimages%2Fuserimage.png?alt=media&token=dbf7c8dd-6759-4d20-a792-fc67eb9daea0&_gl=1*1ktfnw6*_ga*NjczMjI0NTY4LjE2NzY1MzU5NjA.*_ga_CW55HF8NVT*MTY4NjQ5MzA3NC4yMC4xLjE2ODY0OTMzOTkuMC4wLjA.',
                role: '',
            };

            axios
                .post('http://localhost:1337/api/auth/local/register', data)
                .then((response) => {
                    console.log(response.data);
                    this.$router.push({ name: 'Login' });
                    // Aquí puedes agregar la redirección a la pantalla de Login si el registro es exitoso
                })
                .catch((error) => {
                    console.log(error.response.data);
                    this.errorMessage = 'Error en el registro. Por favor, verifica los datos ingresados.';
                });
        },
        isPasswordValid(password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            return passwordRegex.test(password);
        },
        calculatePasswordStrength(password) {
            let strength = 0;
            if (password.match(/[a-z]/)) {
                strength += 25;
            }
            if (password.match(/[A-Z]/)) {
                strength += 25;
            }
            if (password.match(/\d/)) {
                strength += 25;
            }
            if (password.length >= 8) {
                strength += 25;
            }
            return strength;
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
    },
};
</script>

<style scoped>
.register-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #cbe3ff;
}

.register-form {
    padding: 20px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    width: 25%;
}

.register-form h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
}

.register-form form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.register-form .form-group {
    display: flex;
    flex-direction: column;
}

.register-form label {
    font-weight: 700;
}

.register-form input {
    padding: 10px;
    border-radius: 4px;
    border: 2px solid #bdbdbd;
    font-size: 16px;
}

.register-form button {
    background-color: rgb(115, 115, 255);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.register-form button:hover {
    background-color: blue;
}

.register-form p {
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
}

.register-form p a {
    color: #c18e2e;
    text-decoration: none;
}

.register-form p a:hover {
    text-decoration: underline;
}

.password-strength-meter {
    width: 100%;
    height: 10px;
    background-color: #eee;
    border-radius: 5px;
    margin-bottom: 10px;
}

.strength-bar {
    height:
        100%;
    border-radius: 5px;
    transition: width 0.3s ease;
}

/* Colors for password strength levels */
.strength-bar {
    background-color: #ff4d4d;
}

.strength-bar[data-strength="25"] {
    background-color: #ff4d4d;
}

.strength-bar[data-strength="50"] {
    background-color: #ffcc66;
}

.strength-bar[data-strength="75"] {
    background-color: #66ccff;
}

.strength-bar[data-strength="100"] {
    background-color: #66ff66;
}

.password-input {
    position: relative;
}

.password-input input {
    padding-right: 55%;
    /* Ajusta el espacio para el ícono */
}

.password-toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
}

.error-message {
    color: red;
}
.inline{
    display:inline-block;
    margin: 10px;
}
</style>