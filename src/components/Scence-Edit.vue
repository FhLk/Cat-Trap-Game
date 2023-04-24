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
const hexagon_disable = ['./candy1.svg', './candy2.svg', './candy3.svg', './candy4.svg', './candy5.svg', './candy6.svg', './candy7.svg',];
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

// Divide Board to 4 part for generate blocks
const divideBoardIntoFour = (gameBoard) => {
  const Q_TOP = gameBoard.slice(0, 5);
  const Q_BOTTOM = gameBoard.slice(6, 11);
  const Q1 = [];
  const Q2 = [];
  const Q3 = [];
  const Q4 = [];
  for (let i = 0; i < Q_TOP.length; i++) {
    Q1.push(Q_TOP[i].slice(0, 5));
    Q2.push(Q_TOP[i].slice(6, 11));
  }

  for (let i = 0; i < Q_BOTTOM.length; i++) {
    Q3.push(Q_BOTTOM[i].slice(0, 5));
    Q4.push(Q_BOTTOM[i].slice(6, 11));
  }
  return [Q1, Q2, Q3, Q4];
};

// Divide Board to 2 part for generate blocks but not sure to use
const divideBoardIntoTwo = (gameBoard) => {
  const Q_TOP = gameBoard.slice(0, 5);
  const Q_BOTTOM = gameBoard.slice(6, 11);
  const Q1 = [];
  const Q2 = [];
  for (let i = 0; i < Q_TOP.length; i++) {
    Q1.push(Q_TOP[i].slice(0, 11));
  }

  for (let i = 0; i < Q_BOTTOM.length; i++) {
    Q2.push(Q_BOTTOM[i].slice(0, 11));
  }

  return [Q1, Q2];
};

// Generate Blocks
// Number of Blocks depen on Level
// get parameter is Array of Board 4/2 part
const RandomBlock = (Q) => {
  let blocks = [];
  let countBlocks =
    level.value === 1 ? 4 : level.value === 2 ? 3 : level.value === 3 ? 2 : 1;
  for (let i = 0; i < Q.length; i++) {
    let part = Q[i];
    let partBlocks = new Set();
    while (partBlocks.size < countBlocks) {
      const block =
        part[Math.floor(Math.random() * part.length)][
        Math.floor(Math.random() * part[0].length)
        ];
      block.hexagon = hexagon_disable[Math.floor(Math.random() * hexagon_disable.length)];
      block.block = true;
      partBlocks.add(block);
    }
    blocks = blocks.concat(Array.from(partBlocks));
  }

  const blockArray = Array.from(blocks);
  return blockArray;
};

// Generate SET of Destiantion
const Destination = () => {
  const BOARD_SIZE = gameBoard.value[0].length;
  const setDestination = new Set();
  for (let i = 0; i < BOARD_SIZE; i++) {
    setDestination.add(gameBoard.value[0][i]);
    setDestination.add(gameBoard.value[i][0]);
    setDestination.add(gameBoard.value[BOARD_SIZE - 1][i]);
    setDestination.add(gameBoard.value[i][BOARD_SIZE - 1]);
  }
  let destination = Array.from(setDestination);
  // without blocks position
  destination = destination.filter((n) => !n.block);
  return destination;
};

// Find Neighbors
// get parameter is node (hexagon in board)
const getNeighbors = (node) => {
  const x = node.x;
  const y = node.y;
  let neighbors = [];
  const addNeighbor = (x, y) => {
    const n = gameBoard.value[x] && gameBoard.value[x][y];
    // without blocks
    if (n && !n.block) {
      neighbors.push(n);
    }
  };
  // Add 6 directions
  addNeighbor(x - 1, y);
  addNeighbor(x + 1, y);
  addNeighbor(x, y - 1);
  addNeighbor(x, y + 1);

  if (x % 2 === 0) {
    addNeighbor(x - 1, y - 1);
    addNeighbor(x + 1, y - 1);
  } else {
    addNeighbor(x - 1, y + 1);
    addNeighbor(x + 1, y + 1);
  }
  return neighbors;
};

// Use this value in A* algorithms
function heuristic(a, b) {
  // Returns the estimated cost between two nodes
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// A* algorithms
// get parameter is (cat,destination)
function aStar(start, end) {
  // Returns the shortest path from start to end using A* algorithm
  const openSet = new Set([start]);
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, end));
  while (openSet.size > 0) {
    // Find the node in open set with the lowest fScore
    let current = null;
    let currentScore = Number.POSITIVE_INFINITY;
    for (let node of openSet) {
      const score = fScore.get(node);
      if (score < currentScore) {
        current = node;
        currentScore = score;
      }
    }
    if (current === end) {
      // Reconstruct the path from start to end
      const path = [end];
      let previous = cameFrom.get(end);
      while (previous) {
        path.unshift(previous);
        previous = cameFrom.get(previous);
      }
      return path;
    }
    openSet.delete(current);
    for (let neighbor of getNeighbors(current)) {
      const tentativeGScore = gScore.get(current) + 1;
      if (tentativeGScore >= gScore.get(neighbor)) {
        continue;
      }
      cameFrom.set(neighbor, current);
      gScore.set(neighbor, tentativeGScore);
      fScore.set(neighbor, gScore.get(neighbor) + heuristic(neighbor, end));
      openSet.add(neighbor);
    }
  }
  return [];
}

// When player click on board
const selectHexagon = (row, index) => {
  clearInterval(setTimer.value);
  time.value = 10;
  startTime();
  // try catch for end game
  try {
    // If that position isn't block and cat
    if (
      !gameBoard.value[row][index].block &&
      !gameBoard.value[row][index].cat &&
      !isAnimate.value
    ) {
      // change to block
      gameBoard.value[row][index].hexagon = hexagon_disable[Math.floor(Math.random() * hexagon_disable.length)];
      gameBoard.value[row][index].block = true;
      blocks.value.push(gameBoard.value[row][index]);
      catMove();
    }
    return;
  } catch (error) {
    // If player can catch the cat is exception that mean player win
    clearInterval(setTimer.value);
    emit("winGame");
    // winGame();
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
  checkAnimation(nextMove, getPosition.value);
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
const gameSetup = () => {
  gameBoard.value = generateBoard();
  gameBoard.value[5][5].cat = true;
  // Divide Board
  Q.value = divideBoardIntoFour(gameBoard.value);
  //generate Block
  blocks.value = RandomBlock(Q.value);
  // SET of Destination
  setDestination.value = Destination();
  // generate destination position
  let destination =
    setDestination.value[
    Math.floor(Math.random() * setDestination.value.length)
    ];
  // calculate the paht
  start.value = gameBoard.value[5][5];
  cat.value = start.value;
  end.value = gameBoard.value[destination.x][destination.y];
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
  path.value = aStar(start.value, end.value);
  if (path.value.length === 0) {
    path.value = aStar(start.value, end.value);
  }
});

//Game set-up
onBeforeMount(() => {
  gameSetup();
  path.value = aStar(start.value, end.value);
  if (path.value.length === 0) {
    path.value = aStar(start.value, end.value);
  }
});

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
  time.value = 10;
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
      <div class="time-div flex justify-evenly items-center font-semibold text-2xl"> <span class="time-text"> 00:00
        </span> </div>
      <div class="level-div flex justify-center items-center text-white"> Level: {{ level }}</div>
    </div>
    <div class="game-board">
      <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex" :class="`board-row flex w-max ${rowIndex % 2 !== 0
          ? 'translate-x'
          : `${cat.x % 2 !== 0 ? '-z-10' : 'z-10'}`
        }`">
        <!-- <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex" :class="`board-row flex w-max ${rowIndex % 2 !== 0
          ? 'translate-x'
          : ''}
        }`"> -->
        <div v-for="(hexagon, index) in row">
          <div :class="`absolute bg-sky-400 z-10 ${hexagon !== cat ? '' : `${isFlip ? 'cat-stand-flip' : 'cat-stand'}  ${isRight ? 'move-right' : ''}
                                                                ${isLeft ? 'move-left' : ''}
                                                                ${isRight_Top ? 'move-top-right' : ''}
                                                                ${isLeft_Top ? 'move-top-left' : ''}
                                                                ${isLeft_Bottom ? 'move-bottom-left' : ''}
                                                                ${isRight_Bottom ? 'move-bottom-right' : ''}`}`"></div>
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
  transform: translate(40%, -10%);
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
}

.cat-stand-flip {
  background-image: url(../assets/cat/cat-test-sit.png);
  width: 96px;
  height: 112px;
  transform: scale(-.4, .4) translate(80%, -90%);
}

.move-right {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveRight 0.7s ease-out forwards, jump 0.7s steps(8) alternate;
}

.move-top-right {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveRight-Top 0.7s ease-out forwards,jump 0.7s steps(8) alternate;
}

.move-bottom-right {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveRight-Bottom 0.7s ease-out forwards,jump 0.7s steps(8) alternate;
}

.move-left {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveLeft 0.7s ease-out forwards,jump 0.7s steps(8) alternate;
}

.move-top-left {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveLeft-Top 0.7s ease-out forwards,jump 0.7s steps(8) alternate;
}

.move-bottom-left {
  background-image: url(../assets/cat/cat_sprite_animation_test.png);
  width: 150px;
  height: calc(1203px/8);
  animation: moveLeft-Bottom 0.7s ease-out forwards,jump 0.7s steps(8) alternate;
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
    transform: translate(0%, 50%);
  }

  .board-row {
    margin-bottom: -22px;
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
    width:  45px;
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
