<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const isShow = ref(false)

const Router = useRouter();
const goToGame = (level) => {
  Router.push({ name: "Game", params: { level: level } });
};
</script>

<template>
  <div>
    <div class="play space-y-3">
      <button v-show="!isShow"
        type="button"
        @click="isShow = true"
        class="bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
      >
        Play
      </button>
      <div v-show="isShow">
        <button
          type="button"
          @click="goToGame(1)"
          class="bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
        >
          Level 1
        </button>
      </div>
      <div v-show="isShow">
        <button
          type="button"
          @click="goToGame(2)"
          class="bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
        >
          Level 2
        </button>
      </div>
      <div v-show="isShow">
        <button
          type="button"
          @click="goToGame(3)"
          class="bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
        >
          Level 3
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.play button {
  font-size: 100%;
  height: 60px;
  width: 100px;
  padding: 10px;
}
</style>
