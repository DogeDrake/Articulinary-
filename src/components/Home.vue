<template>
    <div>
        <h1>Escribir texto</h1>
        <input type="text" v-model="textInput">
        <button @click="sendText">Enviar</button>
    </div>
</template>


<script>
export default {
    data() {
        return {
            textInput: "",
        };
    },
    methods: {
        sendText() {
            //this.$router.push({ name: "displayText", params: { text: this.textInput } });
        },
    },
};
</script>