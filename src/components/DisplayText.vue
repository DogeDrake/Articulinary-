<template>
  <div>
    <h1>Texto enviado</h1>
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: ["text"],
};
</script>