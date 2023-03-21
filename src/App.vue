<script setup>
import { ref } from "vue";
const isRight = ref(false);
const isLeft = ref(false);
const isUp = ref(false);
const isDown = ref(false);
const isAnimate = ref(false);
const isFlip =ref(false)
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
  isFlip.value = false
  const isPlay = setInterval(() => {
    getIndex.value = getIndex.value - 1;
    checkLenght(getIndex.value + 1);
    isLeft.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveRight = () => {
  isRight.value = true;
  isAnimate.value = true;
  isFlip.value = true
  const isPlay = setInterval(() => {
    getIndex.value = getIndex.value + 1;
    checkLenght(getIndex.value - 1);
    isRight.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
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
  <!-- <div class="flex justify-center text-3xl p-3">Simple Animation Move</div>
  <div class="flex justify-center gap-5">
    <div>
      <p>stand</p>
      <div class="cat-example-stand"></div>
    </div>
    <div>
      <p>jump</p>
      <div class="cat-example-jump bg-sky-400 cat-crop"></div>
      <div class="cat-example-jump-flip"></div>
    </div>
    <div class="cat-pic"></div>
  </div>
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
      <div :class="`absolute 
      ${grid !== getIndex ? 'bg-black-1': 
      `cat-stand
      ${isRight ? 'move-right' : ''}
      ${isLeft ? 'move-left' : ''}
      ${isUp ? 'move-up' : ''}
      ${isDown ? 'move-down' : ''}`}`">
        {{}}
      </div>
    </div>
  </div> -->
  <RouterView></RouterView>
</template>

<style scoped>

.cat-example-stand {
  background-image: url(assets/cat/catBear/cat.png);
  background-position-x: -88px;
  background-position-y: 5px;
  width: calc(894px / 10);
  height: calc(195px / 2);
  animation: animate-example-4-frame .6s steps(4) infinite ;
}

@keyframes animate-example-4-frame {
  100% {
    background-position-x: -440px;
  }
}

.cat-crop{
  clip-path: inset(35% 20% 0% 10%);
}
.cat-example-jump {
  background-image: url(assets/cat/catBear/cat.png);
  background-position-x:-88px ;
  background-position-y: 105px;
  width: calc(894px / 10);
  height: calc(195px / 2);
  animation: animate-example-9-frame 0.7s steps(9) infinite;
}

.cat-example-jump-flip {
  background-image: url(assets/cat/catBear/cat.png);
  transform: scaleX(-1);
  background-position-x: -88px;
  background-position-y: 105px;
  width: calc(894px / 10);
  height: calc(195px / 2);
  animation: animate-example-9-frame 0.7s steps(9) infinite;
}

@keyframes animate-example-9-frame {
  0%{
    clip-path: inset(0% 0% 0% 0%);
  }
  100% {
    clip-path: inset(0% 0% 0% 0%);
    background-position-x: -894px;
  }
}

.cat-stand {
  background-image: url(assets/cat/catBear/cat.png);
  background-position-x: -88px;
  background-position-y: 5px;
  width: calc(894px / 10);
  height: calc(195px / 2);
  animation: animate-example-4-frame .6s steps(4) infinite ;
}

.move-left {
  background-image: url(assets/cat/catBear/cat.png);
  background-position-x: -88px;
  background-position-y: 105px;
  width: calc(894px / 10);
  height: calc(195px / 2);
  animation: moveLeft 0.7s ease-out forwards, animate-example-9-frame 0.7s steps(9) infinite;
}

.move-right {
  background-image: url(assets/cat/catBear/cat.png);
  transform: scaleX(-1);
  background-position-x: -88px;
  background-position-y: 105px;
  width: calc(894px / 10);
  height: calc(195px / 2);
  animation: moveRight 0.7s ease-out forwards, animate-example-9-frame 0.7s steps(9) infinite;
}

@keyframes moveRight {
  0% {
    transform: translateX(0)  scaleX(-1);
  }
  100% {
    transform: translateX(19.93vw)  scaleX(-1);
  }
}

@keyframes moveLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-19.93vw);
  }
}

.cat-pic {
  background-image: url(assets/cat/catBear/cat.png);
  width: 894px;
  height: 195px;
}
.bg-blue-400 {
  width: 100px;
  height: 100px;
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

.move-up {
  animation: moveUp 0.5s ease-out normal forwards;
}

.move-down {
  animation: moveDown 0.5s ease-out normal forwards;
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
