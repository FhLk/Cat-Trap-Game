<script setup>
import { ref } from "vue";

const information = ref([
  { tile: "CAT", img: "./hexagon-red.svg" },
  { tile: "WAY", img: "./hexagon.svg" },
  { tile: "BLOCK", img: "./hexagon-grey.svg" },
]);
</script>

<template>
  <div class="bg-white rounded-lg p-10 py-3 space-y-3">
    <h1 class="text-lg font-medium">How To Play</h1>
    <div class="text-center">
      <p class="text-base font-medium">
        Don't let the cat get away, By placing blocks to keep the cat away in 60
        second, By placing a block 1 time, the cat moves 1 time.
      </p>
      <p class="text-base font-bold">
        {{ ">>" }}
        <span class="underline"> {{ "Left-click is to place a block." }}</span>
        {{ "<<" }}
      </p>
    </div>
    <div>
      <div class="flex justify-center">
        <img src="../assets/example.png" class="board-example rounded-lg" />
      </div>
      <p class="font-medium">Area of Cat (11x11)</p>
    </div>
    <div class="flex justify-evenly">
      <div v-for="(info, index) in information" :key="index">
        <div class="flex justify-around">
          <img :src="info.img" class="hexagon" />
        </div>
        <p class="font-medium">{{ info.tile }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-example {
  width: 250px;
  height: 200px;
}

.text-lg {
  font-size: 200%;
}

.hexagon {
  width: 50px;
  height: 50px;
}

@media (min-width: 768px) {
  .hexagon {
    width:  70px;
    height: 70px;
  }
}
</style>
