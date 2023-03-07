<script setup>
import { ref } from "vue";
const isPlaying = ref(false)

const playAnimation =()=>{
  isPlaying.value = true
}
</script>

<template>
<div class="container">
  <button @click="playAnimation">Play Animation</button>
  <div v-if="isPlaying" class="box"></div>
</div>
  <!-- <RouterView></RouterView> -->
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(9, 50px);
  grid-template-rows: repeat(9, 50px);
  width: 450px;
  height: 450px;
  border: 1px solid #ccc;
}

.box {
  width: 50px;
  height: 50px;
  background-color: red;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  animation-name: move;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

@keyframes move {
  0% {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
  100% {
    grid-column: 9 / 10;
    grid-row: 9 / 10;
  }
}

</style>
