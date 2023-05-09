<script setup>
import { onBeforeMount, ref, onBeforeUpdate } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import API from "../components/api";

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
    // path.value = aStar(start.value, end.value);
    // if (path.value.length === 0) {
    //   path.value = aStar(start.value, end.value);
    // }
    emit("reset", false);
  }
});

const level = ref(props.level);

const emit = defineEmits(["loseGame", "winGame", "reset"]);

const time = ref(10);
const hexagon_normal = "./hexagon-pre-test.svg";

// When player click on board
const selectHexagon = async (row, index) => {
  try {
    // If that position isn't block and cat
    if (
      !gameBoard.value[row][index].block &&
      !gameBoard.value[row][index].cat &&
      !isAnimate.value
    ) {
      let newData = await api.Play(turn.value, row, index)
      gameBoard.value = newData.board
      localStorage.setItem("board", newData.token)
      turn.value = newData.turn
      console.log(gameBoard.value);
      gameBoard.value.forEach((row)=>{
        row.forEach((n)=>{
          if(n.cat){
            cat.value = n
          }
        })
      })
      console.log(cat.value);
      // catMove();
    }
    return;
  } catch (error) {
    console.log(error);
    // If player can catch the cat is exception that mean player win
    // clearInterval(setTimer.value);
    // emit("winGame");
    return;
  }
};

const catMove = () => {
  // get current position of cat [5][5]
  const currentMove = gameBoard.value[path.value[0].x][path.value[0].y];
  // calculate the path everytime when click on board
  path.value = aStar(currentMove, end.value);
  // condition for realistic
  if (path.value.length < 5) {
    end.value = closestCat(currentMove);
    path.value = aStar(currentMove, end.value);
  }
  if (path.value.length > 7) {
    end.value = closestCat(currentMove);
    path.value = aStar(currentMove, end.value);
  }

  // get previous position of cat [5][5]
  const previousMove = gameBoard.value[path.value[0].x][path.value[0].y];
  // change to normal way
  previousMove.hexagon = hexagon_normal;
  previousMove.cat = false;
  previousMove.block = false;
  // remove position in path [5][5]
  path.value.shift();
  // get next position of cat [5 +- 1][5 +- 1]
  // now cat is change position [5 +- 1][5 +- 1]
  const nextMove = gameBoard.value[path.value[0].x][path.value[0].y];
  // checkAnimation(nextMove, getPosition.value);
  getPosition.value.x = nextMove.x;
  getPosition.value.y = nextMove.y;
  const waitAnimation = setInterval(() => {
    nextMove.cat = true;
    // check everytime when click is to destination ?
    checkLoseGame(nextMove);
    cat.value = nextMove;
    clearInterval(waitAnimation);
  }, 700);
};

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

// check cat position
// If cat position = one in SET Destination
const checkLoseGame = (currentCat) => {
  setDestination.value.forEach((n) => {
    if (currentCat.x === n.x && currentCat.y === n.y) {
      clearInterval(setTimer.value);
      emit("loseGame");
    }
  });
};

// Find position closest the cat
const closestCat = (currentCat) => {
  setDestination.value = setDestination.value.filter((n) => !n.block);
  let distance = Number.POSITIVE_INFINITY;
  let newDestination = end.value;
  for (let i = 0; i < setDestination.value.length; i++) {
    let newPath = aStar(currentCat, setDestination.value[i]);
    newPath.shift();
    if (
      newPath.length < distance &&
      newPath.length !== 0 &&
      !setDestination.value.block
    ) {
      newDestination = newPath[newPath.length - 1];
      distance = newPath.length;
    }
  }
  return newDestination;
};

const blocks = ref([]);
const setDestination = ref(null);
const path = ref([]);
const end = ref(null);
const start = ref(null);
const Q = ref(null);
const gameBoard = ref(null);
const cat = ref(null);
const turn = ref(0)
const gameSetup = (setup) => {
  turn.value = setup.turn
  gameBoard.value = setup.board
  cat.value = gameBoard.value[5][5]
};

const resetGame = () => {
  blocks.value = [];
  setDestination.value = null;
  path.value = null;
  end.value = null;
  start.value = null;
  gameBoard.value = null;
  Q.value = null;
  cat.value = null;
  getPosition.value = { x: 5, y: 5 };
  clearInterval(setTimer.value);
  resetTime();
  startTime();
};

onBeforeRouteUpdate(() => {
  level.value = level.value + 1;
  resetGame();
  gameSetup();
  // path.value = aStar(start.value, end.value);
  // if (path.value.length === 0) {
  //   path.value = aStar(start.value, end.value);
  // }
});

//Game set-up
const api = new API()
const dataSetup = ref(null)
onBeforeMount(async () => {
  dataSetup.value = await api.Setup(level.value)
  gameSetup(dataSetup.value);
});

window.onload = async ()=>{
  dataSetup.value = await api.Reset(level.value)
  gameSetup(dataSetup.value);
}

const setTimer = ref(null);
const startTime = () => {
  setTimer.value = setInterval(() => {
    if (time.value === 0) {
      catMove();
      resetTime();
    }
    // time.value--;
  }, 1000);
};
startTime();

const resetTime = () => {
  time.value = 11;
};

const isRight = ref(false);
const isRight_Top = ref(false);
const isRight_Bottom = ref(false);
const isLeft = ref(false);
const isLeft_Top = ref(false);
const isLeft_Bottom = ref(false);
const getPosition = ref({ x: 5, y: 5 });
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
            :class="`absolute z-10 ${hexagon !== cat ? '' : `${isFlip ? 'cat-stand-flip' : 'cat-stand'}  ${isRight ? 'move-right' : ''}
                                                                                      ${isLeft ? 'move-left' : ''}
                                                                                      ${isRight_Top ? 'move-top-right' : ''}
                                                                                      ${isLeft_Top ? 'move-top-left' : ''}
                                                                                      ${isLeft_Bottom ? 'move-bottom-left' : ''}
                                                                                      ${isRight_Bottom ? 'move-bottom-right' : ''}`}`">
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

/* transform: scale(.4) translate(-95%, -110%); */
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
  /* background-image: url(../assets/hexagon-pre-test.svg); */
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
