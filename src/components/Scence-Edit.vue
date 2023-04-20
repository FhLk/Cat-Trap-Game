<script setup>
import { onBeforeMount, ref, onBeforeUpdate } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

const props = defineProps({
  level: {
    type: Number,
    require: true,
  },
  language: String,
  reset: Boolean,
});

onBeforeUpdate(() => {
  if (props.reset) {
    resetGame();
    gameSetup();
    path.value = aStar(start.value, end.value);
    if (path.value.length === 0) {
      path.value = aStar(start.value, end.value);
    }
    emit("reset", false);
  }
});

const level = ref(props.level);

const emit = defineEmits(["loseGame", "winGame", "reset"]);

const time = ref(10);
const hexagon_normal = "./hexagon-pre-test.svg";
const hexagon_disable = "./hexagon-pre-test.svg";
// Generate Board 11x11
// attribute ->
// x: Position on X
// y: Position on Y
// hexagon: (img)
// block: Is block ?
// cat: Is cat ?
const generateBoard = () => {
  return new Array(11).fill().map((_, i) =>
    new Array(11).fill().map((_, j) => ({
      x: i,
      y: j,
      hexagon: hexagon_normal,
      block: false,
      cat: false,
    }))
  );
};

const gameBoard = ref(generateBoard())


</script>

<template>
  <div class="game-board bg-white">
    <!-- <div v-for="(row,rowIndex) in gameBoard" :key="rowIndex" :class="`flex ${rowIndex % 2 !== 0 ? 'translate-y-odd':''}`">
      <div v-for="(hexagon,index) in row" class="hexagon-body"></div>
    </div> -->
    <div class="flex">
      <div v-for="(hexagon, index) in 11" :key="index" class="hexagon-body"></div>
    </div>
    <div class="translate-y-odd flex">
      <div v-for="(hexagon, index) in 11" :key="index" class="hexagon-body"></div>
    </div>
    <div class="flex translate-y-even">
      <div v-for="(hexagon, index) in 11" :key="index" class="hexagon-body "></div>
    </div>
    <div class="flex translate-y-odd">
      <div v-for="(hexagon, index) in 11" :key="index" class="hexagon-body"></div>
    </div>
    <!-- <div class="game-board pr-4 h-fit">
              <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex"
                :class="`board-row flex ${rowIndex % 2 !== 0 ? 'translate-x' : ''}`">
                <div v-for="(hexagon, index) in row" :key="index">
                  <button class="hexagon bg-sky-400 scale-hexagon" :disabled="hexagon.block || hexagon.cat">
                    <img :src="hexagon.hexagon" @click="" />
                  </button>
                </div>
              </div>
            </div> -->
  </div>
</template>

<style scoped>

.game-board {
  width: 100%;
  height: 440px;
}

.hexagon-body {
  background-image: url(../assets/hexagon-pre-test.svg);
  background-size: cover;
  width:  80px;
  height: 80px;
  clip-path: polygon(50% 6%,
      50% 6%,
      50% 6%,
      90% 28%,
      90% 72%,
      50% 94%,
      50% 94%,
      10% 72%,
      10% 28%);
  margin-right: -10px;
  margin-left: -7px;
}

.translate-y-odd {
  transform: translate(31px, -35%)
}

.translate-y-even {
  /* transform: translate(0,-70%) */
}
</style>
