<script setup>
import { onBeforeMount, ref, onBeforeUpdate } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import API from "../components/api";
import Swal from "sweetalert2";

const props = defineProps({
  level: {
    type: Number,
    require: true,
  },
  language: String,
  reset: Boolean,
});



const level = ref(props.level);

const emit = defineEmits(["loseGame", "winGame", "reset", 'menu']);

const time = ref(10);
const hexagon_disable = ['./candy1.svg', './candy2.svg', './candy3.svg', './candy4.svg', './candy5.svg', './candy6.svg', './candy7.svg',];
const selectHexagon = async (row, index) => {
  try {
    if (
      !gameBoard.value[row][index].block &&
      !gameBoard.value[row][index].cat &&
      !isAnimate.value
    ) {
      resetTime();
      let block = hexagon_disable[Math.floor(Math.random() * hexagon_disable.length)];
      gameBoard.value[row][index].hexagon = block
      gameBoard.value[row][index].block = true
      let req = {
        turn: turn.value,
        timeOut: false,
        x: row,
        y: index,
        block: block,
        level: level.value,
      }
      catMove(req)
    }
    return;
  } catch (error) {
    return;
  }
};

const catMove = async (req) => {
  resetTime();
  let newData;
  if (req.timeOut) {
    newData = await api.TimeOut(req)
  }
  else {
    newData = await api.Play(req)
  }
  let nextMove = gameBoard.value[5][5];
  let newBoard = newData.board
  localStorage.setItem("board", newData.token)
  turn.value = newData.turn
  newBoard.forEach((row) => {
    row.forEach((n) => {
      if (n.cat) {
        nextMove = n
      }
    })
  })
  let token = newData.token.slice(11)
  if (Number(token) < turn.value && newData.canPlay) {
    clearInterval(setTimer.value)
    emit("winGame");
    return
  }
  checkAnimation(nextMove, cat.value);
  const waitAnimation = setInterval(async () => {
    nextMove.cat = true;
    cat.value = nextMove;
    gameBoard.value = newBoard
    if (!newData.canPlay) {
      clearInterval(setTimer.value)
      dataSetup.value = await api.Reset(level.value)
      gameSetup(dataSetup.value);
      emit("loseGame");
    }
    clearInterval(waitAnimation);
  }, 700);
}

const checkAnimation = (next, currPos) => {
  const isEvenX = currPos.x % 2 === 0;
  if (!isEvenX) {
    if (currPos.y === next.y) {
      if (currPos.x > next.x) {
        moveLeftTop();
      } else {
        moveLeftBottom();
      }
    } else if (currPos.y < next.y && currPos.x > next.x) {
      moveRightTop();
    } else if (currPos.y < next.y && currPos.x < next.x) {
      moveRightBottom();
    } else if (currPos.y < next.y) {
      moveRight();
    } else if (currPos.y > next.y) {
      moveLeft();
    }
  } else {
    if (currPos.y === next.y) {
      if (currPos.x > next.x) {
        moveRightTop();
      } else {
        moveRightBottom();
      }
    } else if (currPos.y > next.y && currPos.x > next.x) {
      moveLeftTop();
    } else if (currPos.y > next.y && currPos.x < next.x) {
      moveLeftBottom();
    } else if (currPos.y < next.y) {
      moveRight();
    } else if (currPos.y > next.y) {
      moveLeft();
    }
  }
};

const gameBoard = ref(null);
const cat = ref(null);
const turn = ref(0)
const gameSetup = (setup) => {
  try {
    turn.value = setup.turn
    gameBoard.value = setup.board
    cat.value = gameBoard.value[5][5]
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
};

onBeforeRouteUpdate(async () => {
  level.value = level.value + 1;
  dataSetup.value = await api.Reset(level.value)
  gameSetup(dataSetup.value);
});

//Game set-up
const api = new API()
const dataSetup = ref(null)
onBeforeMount(async () => {
  startTime();
  dataSetup.value = await api.Setup(level.value)
  if (dataSetup.value.canPlay) {
    gameSetup(dataSetup.value);
  }
});

onBeforeUpdate(() => {
  let isReset = props.reset
  if (isReset) {
    clearInterval(setTimer.value)
    resetTime()
    startTime()
    emit("reset", false);
  }
})

window.onload = async () => {
  clearInterval(setTimer.value)
  resetTime()
  startTime()
  dataSetup.value = await api.Reset(level.value)
  gameSetup(dataSetup.value);
}

const setTimer = ref(null);
const startTime = async () => {
  setTimer.value = setInterval(async () => {
    if (time.value === 0) {
      let req = {
        timeOut: true,
        turn: turn.value,
        level: level.value
      }
      catMove(req);
      resetTime();
    }
    // time.value--;
  }, 1000);
};

const resetTime = () => {
  time.value = 10;
};

const isRight = ref(false);
const isRight_Top = ref(false);
const isRight_Bottom = ref(false);
const isLeft = ref(false);
const isLeft_Top = ref(false);
const isLeft_Bottom = ref(false);
const isAnimate = ref(false);
const isFlip = ref(false)

const moveLeft = () => {
  isLeft.value = true;
  isAnimate.value = true;
  isFlip.value = true
  const isPlay = setInterval(() => {
    isLeft.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveLeftTop = () => {
  isLeft_Top.value = true;
  isAnimate.value = true;
  isFlip.value = true
  const isPlay = setInterval(() => {
    isLeft_Top.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveLeftBottom = () => {
  isLeft_Bottom.value = true;
  isAnimate.value = true;
  isFlip.value = true
  const isPlay = setInterval(() => {
    isLeft_Bottom.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveRight = () => {
  isRight.value = true;
  isAnimate.value = true;
  isFlip.value = false
  const isPlay = setInterval(() => {
    isRight.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveRightTop = () => {
  isRight_Top.value = true;
  isAnimate.value = true;
  isFlip.value = false
  const isPlay = setInterval(() => {
    isRight_Top.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveRightBottom = () => {
  isRight_Bottom.value = true;
  isAnimate.value = true;
  isFlip.value = false
  const isPlay = setInterval(() => {
    isRight_Bottom.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};
</script>

<template>
  <div>
    <div class="time-level flex items-center space-x-7">
      <div class="time-div flex justify-evenly items-center font-semibold text-2xl"> <span class="time-text "> {{ time }}
        </span> </div>
      <div class="level-div flex justify-center items-center text-white"> Level: {{ level }}</div>
    </div>
    <div class="game-board">
      <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex" :class="`board-row flex w-max ${rowIndex % 2 !== 0
        ? 'translate-x'
        : `${cat.x % 2 !== 0 ? '-z-10' : 'z-10'}`
        }`">
        <div v-for="(hexagon, index) in row">
          <div
            :class="`fixed z-10 ${hexagon.cat !== cat.cat ? '' : `${isFlip ? 'cat-stand-flip' : 'cat-stand'} ${isRight ? 'move-right' : ''} ${isLeft ? 'move-left' : ''} ${isRight_Top ? 'move-top-right' : ''} ${isLeft_Top ? 'move-top-left' : ''} ${isLeft_Bottom ? 'move-bottom-left' : ''} ${isRight_Bottom ? 'move-bottom-right' : ''}`}`">
          </div>
          <button :class="`${hexagon.block ? 'hexagon-block' : 'hexagon-body'}`" :disabled="hexagon.block || hexagon.cat">
            <img :src="hexagon.hexagon" @click="selectHexagon(rowIndex, index)" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.time-level {
  position: fixed;
  top: 10%;
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
  transform: translate(70%, -10%);
  font: normal normal 20px/25px HelveticaNeue;
}

.game-board {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
}

.board-row {
  margin-bottom: -30px;
  margin-left: 4px;
}

.cat-stand {
  background-image: url(../assets/cat/cat-test-sit.png);
  width: 96px;
  height: 112px;
  transform: scale(.4) translate(-80%, -90%);
  clip-path: polygon(95% 0, 91% 96%, 0 96%, 0 61%, 15% 38%, 7% 15%, 22% 19%, 33% 42%, 51% 30%, 48% 0);
}

.cat-stand-flip {
  background-image: url(../assets/cat/cat-test-sit.png);
  width: 96px;
  height: 112px;
  transform: scale(-.4, .4) translate(80%, -90%);
  clip-path: polygon(95% 0, 91% 96%, 0 96%, 0 61%, 15% 38%, 7% 15%, 22% 19%, 33% 42%, 51% 30%, 48% 0);
}

.move-right {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveRight 0.7s ease-out forwards, jump 0.7s steps(8) alternate;
  clip-path: inset(0 0 15% 0)
}

.move-top-right {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveRight-Top 0.7s ease-out forwards, jump 0.7s steps(8) alternate;
  clip-path: inset(0 0 15% 0)
}

.move-bottom-right {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveRight-Bottom 0.7s ease-out forwards, jump 0.7s steps(8) alternate;
  clip-path: inset(0 0 15% 0)
}

.move-left {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveLeft 0.7s ease-out forwards, jump 0.7s steps(8) alternate;
  clip-path: inset(0 0 15% 0)
}

.move-top-left {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveLeft-Top 0.7s ease-out forwards, jump 0.7s steps(8) alternate;
  clip-path: inset(0 0 15% 0)
}

.move-bottom-left {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveLeft-Bottom 0.7s ease-out forwards, jump 0.7s steps(8) alternate;
  clip-path: inset(0 0 15% 0)
}


@keyframes jump {
  100% {
    background-position-x: -1203px;
    clip-path: inset(0% 0% 0% 0%);
  }
}

@keyframes moveRight {
  0% {
    transform: translateX(-50px) translateY(-60px) scale(.4);
  }

  100% {
    transform: translateX(-20px) translateY(-60px) scale(.4);

  }
}

@keyframes moveRight-Top {
  0% {
    transform: translateX(-50px) translateY(-60px) scale(.4);
  }

  100% {
    transform: translateX(-40px) translateY(-90px) scale(.4);
  }
}

@keyframes moveRight-Bottom {
  0% {
    transform: translateX(-50px) translateY(-60px) scale(.4);
  }

  100% {
    transform: translateX(-40px) translateY(-30px) scale(.4);
  }
}

@keyframes moveLeft {
  0% {
    transform: translateX(-50px) translateY(-60px) scale(-0.4, 0.4);
  }

  100% {
    transform: translateX(-80px) translateY(-60px) scale(-0.4, 0.4);
  }
}

@keyframes moveLeft-Top {
  0% {
    transform: translateX(-50px) translateY(-60px) scale(-0.4, 0.4);
  }

  100% {
    transform: translateX(-70px) translateY(-90px) scale(-0.4, 0.4);
  }
}

@keyframes moveLeft-Bottom {
  0% {
    transform: translateX(-50px) translateY(-60px) scale(-0.4, 0.4);
  }

  100% {
    transform: translateX(-70px) translateY(-30px) scale(-0.4, 0.4);
  }
}

.hexagon-body {
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

.hexagon-block {
  width: 80px;
  height: 80px;
  margin-right: -10px;
  margin-left: -7px;
}

.translate-x {
  transform: translate(31px, 0%);
}

@media (min-width: 320px) {
  .game-board {
    transform: translate(0%, 50%);
  }

  .board-row {
    margin-bottom: -16px;
  }

  .hexagon-body {
    margin-left:  -4px;
    margin-right: -4px;
    width:  35px;
    height: 35px;
  }

  .hexagon-block {
    width:  30px;
    height: 30px;
    margin-left:  0px;
    margin-right: -3px;
  }

  .translate-x {
    transform: translate(13.5px, 0%)
  }
}

@media (min-width: 360px) {
  .game-board {
    transform: translate(0%, 45%);
  }

  .board-row {
    margin-bottom: -18px;
  }

  .hexagon-body {
    margin-right: -6px;
    margin-left: -3px;
    width: 39px;
    height: 39px;
  }

  .hexagon-block {
    width:  33px;
    height: 33px;
    margin-left:  0px;
    margin-right: -3px;
    transform: translate(5%, 5%);
  }

  .translate-x {
    transform: translate(15px, 0%)
  }
}


@media (min-width: 375px) {
  .game-board {
    transform: translate(0%, 40%);
  }

  .board-row {
    margin-bottom: -18px;
  }

  .hexagon-body {
    margin-left:  -5px;
    margin-right: -5px;
    width: 42px;
    height: 42px;
  }

  .hexagon-block {
    width:  42px;
    height: 42px;
    margin-left:  0px;
    margin-right: -10px;
    transform: translate(0%, 3%);
  }

  .translate-x {
    transform: translate(16px, 0%)
  }
}

@media (min-width: 390px) {  
  .game-board {
    transform: translate(0%, 45%);
  }

  .board-row {
    margin-bottom: -19px;
  }

  .hexagon-body {
    margin-right: -5px;
    width: 43px;
    height: 43px;
  }

  .hexagon-block {
    width:  43px;
    height: 43px;
    margin-left:  -2px;
    margin-right: -8px;
    transform: translate(5%, 3%);
  }

  .translate-x {
    transform: translate(17px, 0%)
  }
}

@media (min-width: 414px) {
  .game-board {
    transform: translate(0%, 45%);
  }

  .board-row {
    margin-bottom: -20px;
  }

  .hexagon-body {
    margin-right: -7px;
    margin-left: -3px;
    width: 45px;
    height: 45px;
  }

  .hexagon-block {
    margin-right: -7px;
    margin-left: -3px;
    width: 45px;
    height: 45px;
    transform: translate(14%, 5%);
  }

  .translate-x {
    transform: translate(17.5px, 0%)
  }
}

@media (min-width: 425px) {
  .game-board {
    transform: translate(0%, 40%);
  }

  .board-row {
    margin-bottom: -19px;
  }

  .hexagon-body {
    width: 46px;
    height: 46px;
  }

  .hexagon-block {
    width: 46px;
    height: 46px;
    transform: translate(14%, 5%);
  }

  .translate-x {
    transform: translate(18px, 0%)
  }
}
</style>
