<script setup>
import Music from './components/Music.vue';


</script>

<template>
  <RouterView>
  </RouterView>
  <Music class="music"/>
</template>

<style scoped>
.music{
  position: absolute;
  top: 5%;
  left: 5%;
}
</style>
