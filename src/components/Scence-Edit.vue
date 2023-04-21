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
  <div>
    <div class="time-level flex items-center space-x-7">
      <div class="time-div flex justify-evenly items-center font-semibold text-2xl"> <span class="time-text"> 00:00
        </span> </div>
      <div class="level-div flex justify-center items-center text-white"> Level: {{ level }}</div>
    </div>
    <div class="game-board">
      <!-- <div class="cat-stand absolute z-10">
        </div> -->
      <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex"
          :class="`board-row flex w-max ${rowIndex % 2 !== 0 ? 'translate-x' : ''}`">
          <!-- <div class="cat-stand absolute z-10"></div> -->
          <div v-for="(hexagon, index) in row" class="">
            <div @click="$emit('loseGame')" class="hexagon-body"></div>
          </div>
        </div>

    </div>
  </div>
</template>

<style scoped>
.time-level {
  position: absolute;
  top: 12%;
  right: 5%;
}

.level-div {
  background-image: url(../assets/trapthecat_asset/level_ic.svg);
  width: 92px;
  height: 34px;
  top: 87px;
  left: 270px;
  font: normal normal normal 26px/32px DBHeavent;
  box-shadow: inset 0px 3px 6px #000000CC;
  border-radius: 32px;
  opacity: 1;
}

.time-div {
  background-image: url(../assets/trapthecat_asset/time_bar_ic.svg);
  width: 148px;
  height: 63px;
  top: 15%;
  left: 50%;
}

.time-text {
  transform: translate(40%, -10%);
  font: normal normal 20px/25px HelveticaNeue;
}

.game-board {
  max-width: 100%;
}

.board-row {
  margin-bottom: -30px;
  margin-left: 4px;
}

.cat-stand {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 80px;
  height: 69px;
  background-position-x: -88px;
  background-position-y: 105px;
  /* animation: play .8s steps(8) infinite */
  /* transform: scale(.4); */
}

@keyframes play {
  100% {
    background-position-x: -625px;
  }
}

.hexagon-body {
  background-image: url(../assets/hexagon-pre-test.svg);
  background-size: cover;
  width: 80px;
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

.translate-x {
  transform: translate(31px, 0%);
}

@media (min-width: 320px) {
  .game-board {
    transform: translate(0%, 35%);
  }

  .board-row {
    margin-bottom: -14px;
  }

  .hexagon-body {
    margin-right: -5px;
    margin-left: -3px;
    width: 35px;
    height: 35px;
  }

  .translate-x {
    transform: translate(14px, 0%)
  }
}

@media (min-width: 360px) {
  .game-board {
    transform: translate(0%, 40%);
  }

  .board-row {
    margin-bottom: -15px;
  }

  .hexagon-body {
    margin-right: -6px;
    margin-left: -3px;
    width: 41px;
    height: 41px;
  }

  .translate-x {
    transform: translate(16px, 0%)
  }
}



@media (min-width: 375px) {
  .game-board {
    transform: translate(0%, 40%);
  }

  .board-row {
    margin-bottom: -16px;
  }

  .hexagon-body {
    margin-right: -6px;
    margin-left: -4px;
    width: 45px;
    height: 45px;
  }

  .translate-x {
    transform: translate(18px, 0%)
  }
}

@media (min-width: 390px) {
  .game-board {
    transform: translate(0%, 45%);
  }

  .board-row {
    margin-bottom: -16px;
  }

  .hexagon-body {
    margin-right: -6px;
    margin-left: -4px;
    width: 43px;
    height: 43px;
  }

  .translate-x {
    transform: translate(17px, 0%)
  }
}

@media (min-width: 414px) {
  .game-board {
    transform: translate(0%, 50%);
  }

  .board-row {
    margin-bottom: -17px;
  }

  .hexagon-body {
    margin-right: -7px;
    margin-left: -3px;
    width: 45px;
    height: 45px;
  }

  .translate-x {
    transform: translate(17px, 0%)
  }
}

@media (min-width: 425px) {
  .game-board {
    transform: translate(0%, 20%);
  }

  .board-row {
    margin-bottom: -17px;
  }

  .hexagon-body {
    margin-right: -7px;
    margin-left: -4px;
    width: 47px;
    height: 47px;
  }

  .translate-x {
    transform: translate(18px, 0%)
  }
}
</style>
