<script setup>
import Tutorial from "../components/Tutorrial.vue";
import LevelButton from "../components/Level-Button.vue";
import { onBeforeUnmount, onBeforeMount, ref, onBeforeUpdate, computed } from "vue";
import Music from "../components/Music.vue";
import { Howl, Howler } from "howler";

const isOpen = ref(false);
const openHtp = () => {
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
};
</script>

<template>
  <button ref="button" style="display: none"></button>
  <div class="body text-center">
    <Tutorial v-if="isOpen" @closed="openHtp()" />
    <div class="title space-y-7">
      <div class="title-name uppercase font-bold">
        <h1>Trap The Cat</h1>
      </div>
      <div class="play space-y-10">
        <LevelButton />
        <div>
          <button
            @click="openHtp()"
            class="bg-blue-600 p-1 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
          >
            How to play
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 100%;
}

.title {
  transform: translate(0, 25%);
}

.title-name {
  font-size: 50px;
}

.play button {
  font-size: 100%;
  height: 60px;
  width: fit-content;
  padding: 10px;
}

</style>
