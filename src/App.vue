<script setup>
import { ref } from "vue";
const isRight = ref(false);
const isLeft = ref(false);
const isUp = ref(false);
const isDown = ref(false);
const isAnimate = ref(false);
const getIndex = ref(13);
const moveUp = () => {
  if (getIndex.value - 5 > 0) {
    isUp.value = true;
    isAnimate.value = true;
    const isPlay = setInterval(() => {
      getIndex.value = getIndex.value - 5;
      isUp.value = false;
      isAnimate.value = false;
      clearInterval(isPlay);
    }, 500);
  }
};

const moveDown = () => {
  if (getIndex.value + 5 < 26) {
    isDown.value = true;
    isAnimate.value = true;
    const isPlay = setInterval(() => {
      getIndex.value = getIndex.value + 5;
      isDown.value = false;
      isAnimate.value = false;
      clearInterval(isPlay);
    }, 500);
  }
};

const moveLeft = () => {
  isLeft.value = true;
  isAnimate.value = true;
  const isPlay = setInterval(() => {
    getIndex.value = getIndex.value - 1;
    checkLenght(getIndex.value + 1);
    isLeft.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 500);
};

const moveRight = () => {
  isRight.value = true;
  isAnimate.value = true;
  const isPlay = setInterval(() => {
    getIndex.value = getIndex.value + 1;
    checkLenght(getIndex.value - 1);
    isRight.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 500);
};

const checkLenght = (current) => {
  if (getIndex.value > 25) {
    getIndex.value = current;
  } else if (getIndex.value < 1) {
    getIndex.value = current;
  }
};
</script>

<template>
  <div class="flex justify-center text-3xl p-3">Simple Animation Move</div>
  <div class="my-10 flex justify-around p-3">
    <button class="bg-blue-400" @click="moveLeft" :disabled="isAnimate">
      Left
    </button>
    <button class="bg-blue-400" @click="moveUp" :disabled="isAnimate">
      Up
    </button>
    <button class="bg-blue-400" @click="moveDown" :disabled="isAnimate">
      Down
    </button>
    <button class="bg-blue-400" @click="moveRight" :disabled="isAnimate">
      Right
    </button>
  </div>
  <div class="grid grid-cols-5 gap-5 p-3">
    <div class="flex justify-center" v-for="(grid, index) in 25" :key="index">
      <div class="bg-black-2">{{}}</div>
      <div
        :class="`absolute ${
          grid !== getIndex
            ? 'bg-black-1'
            : `bg-red-400 
            ${isRight ? 'move-right' : ''}
            ${isLeft ? 'move-left' : ''}
            ${isUp ? 'move-up' : ''}
            ${isDown ? 'move-down' : ''}`
        }`"
      >
        {{}}
      </div>
    </div>
  </div>
  <!-- <RouterView></RouterView> -->
</template>

<style scoped>
.board{
  /* position: absolute; */
}
.bg-blue-400 {
  width: 100px;
  height: 100px;
}
.bg-red-400 {
  width: 20px;
  height: 20px;
  margin: 15px;
}

.bg-black-1 {
  width: 50px;
  height: 50px;
}

.bg-black-2 {
  width: 50px;
  height: 50px;
  background: #000;
}
.move-right {
  animation: moveRight 0.5s ease-out normal forwards;
}

.move-left {
  animation: moveLeft 0.5s ease-out normal forwards;
}

.move-up {
  animation: moveUp 0.5s ease-out normal forwards;
}

.move-down {
  animation: moveDown 0.5s ease-out normal forwards;
}

@keyframes moveRight {
  from {
    transform: translateX(0vw);
  }

  to {
    transform: translateX(19.93vw);
  }
}

@keyframes moveLeft {
  from {
    transform: translateX(0vw);
  }

  to {
    transform: translateX(-19.93vw);
  }
}

@keyframes moveUp {
  from {
    transform: translateY(0vh);
  }

  to {
    transform: translateY(-8.8vh);
  }
}

@keyframes moveDown {
  from {
    transform: translateY(0vh);
  }

  to {
    transform: translateY(8.8vh);
  }
}
</style>
