<template>
    <div class="faq-container">
        <h2>Preguntas Frecuentes</h2>
        <div class="faq-accordion">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
                <div class="faq-question" :class="{ active: faq.isActive }" @click="toggleAccordion(index)">
                    <span class="faq-icon">+</span>
                    <span class="faq-title">{{ faq.question }}</span>
                </div>
                <div class="faq-answer" v-show="faq.isActive">
                    <p>{{ faq.answer }}</p>
                    <p v-if="faq.creator">
                        Creado por <strong>{{ faq.creator.name }}</strong>. Puedes encontrar más información y contactarlo
                        en los siguientes enlaces:
                        <br>
                        <a :href="faq.creator.twitter" target="_blank">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                        <a :href="faq.creator.github" target="_blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            faqs: [
                {
                    question: "¿Cómo subir una receta en ArtiCilinary?",
                    answer:
                        "Para subir una receta en ArtiCilinary, ve a la sección de 'Recetas' en el menú principal y haz clic en el botón 'Subir Receta'. Luego, completa los detalles de la receta, como el título, los ingredientes y los pasos de preparación. También puedes agregar imágenes para ilustrar la receta. Una vez completado, simplemente guarda la receta y estará disponible para que otros usuarios la vean.",
                    isActive: false,
                },
                {
                    question: "¿Es seguro compartir mis recetas en ArtiCilinary?",
                    answer:
                        "Sí, ArtiCilinary se preocupa por la seguridad de tus recetas. Todas las recetas que se suben a la plataforma se almacenan de forma segura y solo son accesibles para los usuarios registrados. Además, puedes controlar la visibilidad de tus recetas y elegir si deseas que sean públicas o solo visibles para ti y tus seguidores.",
                    isActive: false,
                },
                {
                    question: "¿Puedo editar o eliminar mis recetas en ArtiCilinary?",
                    answer:
                        "Sí, en ArtiCilinary tienes el control total sobre tus recetas. Puedes editar cualquier detalle de tus recetas en cualquier momento. Si deseas eliminar una receta, también tienes la opción de hacerlo. Sin embargo, ten en cuenta que una vez eliminada, la receta ya no estará disponible en la plataforma.",
                    isActive: false,
                },
                {
                    question: "¿Cómo funciona el sistema de likes en ArtiCilinary?",
                    answer:
                        "En ArtiCilinary, puedes darle 'me gusta' a las recetas de otros usuarios. Al hacer clic en el botón de 'me gusta' en una receta, se incrementará el contador de likes de esa receta. Esto permite a los usuarios mostrar aprecio por las recetas que les gustan y también ayuda a clasificar las recetas populares en la plataforma.",
                    isActive: false,
                },
                {
                    question: "¿Quién ha creado ArtiCilinary?",
                    answer:
                        "ArtiCilinary ha sido creado por Luis Gonzalez. Puedes encontrar más información y contactarlo en los siguientes enlaces:",
                    isActive: false,
                    creator: {
                        name: "Luis Gonzales",
                        twitter: "https://twitter.com/2Dogedrake",
                        github: "https://github.com/DogeDrake",
                    },
                },
            ],
        };
    },
    methods: {
        toggleAccordion(index) {
            this.faqs.forEach((faq, i) => {
                if (i === index) {
                    faq.isActive = !faq.isActive;
                } else {
                    faq.isActive = false;
                }
            });
        },
    },
};
</script>

<style scoped>
.faq-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.faq-accordion {
    margin-top: 20px;
}

.faq-item {
    margin-bottom: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    overflow: hidden;
}

.faq-question {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.faq-question.active {
    background-color: #eaeaea;
}

.faq-icon {
    margin-right: 10px;
    font-weight: bold;
}

.faq-title {
    font-weight: bold;
}

.faq-answer {
    padding: 10px 20px;
    background-color: #ffffff;
}
</style>
