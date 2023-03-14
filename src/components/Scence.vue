<script setup>
import { onBeforeMount, onUpdated, ref, onMounted, computed } from "vue";
import { winGame, loseGame } from "./Alert.js";
import Timer from "../components/Timer.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  level: {
    type: Number,
    require: true,
  },
});

const time = ref(10);
const hexagon_normal = "./hexagon-white.svg";
const hexagon_cat = "./hexagon-red.svg";
const hexagon_disable = "./hexagon.svg";
const hexagon_Q1 = "./hexagon-green.svg";
const hexagon_Q2 = "./hexagon-purple.svg";
const hexagon_Q3 = "./hexagon-blue.svg";
const hexagon_Q4 = "./hexagon-orange.svg";
// Generate Board 11x11
// attribute ->
// x: Position on X
// y: Position on Y
// hexagon: (img)
// block: Is block ?
// cat: Is cat ?
const gameBoard = ref(
  new Array(11).fill().map((_, i) =>
    new Array(11).fill().map((_, j) => ({
      x: i,
      y: j,
      hexagon: hexagon_normal,
      block: false,
      cat: false,
    }))
  )
);

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

// Divide Board
const Q = divideBoardIntoFour(gameBoard.value);

// Generate Blocks
// Number of Blocks depen on Level
// get parameter is Array of Board 4/2 part
const RandomBlock = (Q) => {
  let blocks = [];
  let countBlocks =
    props.level === 1 ? 4 : props.level === 2 ? 3 : props.level === 3 ? 2 : 1;
  for (let i = 0; i < Q.length; i++) {
    let part = Q[i];
    let partBlocks = new Set();
    while (partBlocks.size < countBlocks) {
      const block =
        part[Math.floor(Math.random() * part.length)][
          Math.floor(Math.random() * part[0].length)
        ];
      block.hexagon = hexagon_disable;
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

const cat = ref({});
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
      !gameBoard.value[row][index].cat
    ) {
      // change to block
      gameBoard.value[row][index].hexagon = hexagon_disable;
      gameBoard.value[row][index].block = true;
      blocks.push(gameBoard.value[row][index]);
      catMove();
    }
    return;
  } catch (error) {
    // If player can catch the cat is exception that mean player win
    winGame();
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
    nextMove.hexagon = hexagon_cat;
    nextMove.cat = true;
    // check everytime when click is to destination ?
    checkLoseGame(nextMove);
    cat.value = nextMove;
    clearInterval(waitAnimation)
  }, 700);
};

const checkAnimation = (next, currPos) => {
  if (currPos.y < next.y) {
    moveRight();
  } else if (currPos.y > next.y) {
    moveLeft();
  } else {
    const isEvenX = currPos.x % 2 === 0;
    if (currPos.x < next.x) {
      if (isEvenX) {
        moveRight();
      } else {
        moveLeft();
      }
    } else if (currPos.x > next.x) {
      if (isEvenX) {
        moveRight();
      } else {
        moveLeft();
      }
    }
  }
};

// check cat position
// If cat position = one in SET Destination
const checkLoseGame = (currentCat) => {
  setDestination.value.forEach((n) => {
    if (currentCat.x === n.x && currentCat.y === n.y) {
      loseGame();
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

//Game set-up
gameBoard.value[5][5].hexagon = hexagon_cat;
gameBoard.value[5][5].cat = true;
//generate Block
const blocks = RandomBlock(Q);
// SET of Destination
const setDestination = ref(Destination());
// generate destination position
const destination =
  setDestination.value[Math.floor(Math.random() * setDestination.value.length)];
// calculate the paht
const path = ref([]);
const start = gameBoard.value[5][5];
cat.value = start;
const end = ref(gameBoard.value[destination.x][destination.y]);
onBeforeMount(() => {
  path.value = aStar(start, end.value);
  if (path.value.length === 0) {
    path.value = aStar(start, end.value);
  }
});

const reset = () => {
  location.reload();
};

const Router = useRouter();
const goToMenu = () => {
  Router.push({ name: "Home" });
};

const setTimer = ref(null);
const startTime = () => {
  // emit('reset-time',)
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
const isFlip = ref(false);
const getPosition = ref({ x: 5, y: 5 });

const moveLeft = () => {
  isLeft.value = true;
  isFlip.value = true;
  const isPlay = setInterval(() => {
    isLeft.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveLeftTop = () => {
  isLeft_Top.value = true;
  isFlip.value = true;
  const isPlay = setInterval(() => {
    isLeft_Top.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveLeftBottom = () => {
  isLeft_Bottom.value = true;
  isFlip.value = true;
  const isPlay = setInterval(() => {
    isLeft_Bottom.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveRight = () => {
  isRight.value = true;
  isFlip.value = false;
  const isPlay = setInterval(() => {
    isRight.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveRightTop = () => {
  isRight_Top.value = true;
  isFlip.value = false;
  const isPlay = setInterval(() => {
    isRight.value = false;
    clearInterval(isPlay);
  }, 700);
};

const moveRightBottom = () => {
  isRight_Bottom.value = true;
  isAnimate.value = true;
  isFlip.value = false;
  const isPlay = setInterval(() => {
    isRight.value = false;
    isAnimate.value = false;
    clearInterval(isPlay);
  }, 700);
};
</script>

<template>
  <div class="bg-[#5f9ea0] h-screen pt-5">
    <div class="control flex justify-around">
      <button
        @click="goToMenu()"
        class="px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700"
      >
        HOME
      </button>
      <button
        @click="reset"
        class="px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700"
      >
        RESET
      </button>
    </div>
    <div>
      <p class="time font-medium flex justify-center">Time : {{ time }}</p>
    </div>
    <div class="game-board pr-4 h-fit">
      <div
        v-for="(row, rowIndex) in gameBoard"
        :key="rowIndex"
        :class="`board-row ${rowIndex % 2 !== 0 ? 'translate-x' : ''}`"
      >
        <div v-for="(hexagon, index) in row" :key="index">
          <button
            class="scale-hexagon"
            :disabled="hexagon.block || hexagon.cat"
          >
            <div
              :class="`absolute ${
                hexagon !== cat
                  ? ''
                  : `${isFlip ? 'cat-stand-flip' : 'cat-stand'}
            ${isRight ? 'move-right' : ''}
            ${isLeft ? 'move-left' : ''}`
              } 
            `"
            ></div>
            <img
              :src="hexagon.hexagon"
              @click="selectHexagon(rowIndex, index)"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-blue-400 {
  width: 60px;
  height: 60px;
}

.cat-stand-test {
  background-image: url(../assets/cat/catTest.png);
  background-position-y: -288px;
  width: calc(256px / 8);
  height: calc(320px / 10);
  animation: stand 0.7s steps(8) infinite;
  transform: scale(2) translateX(25%);
}

.cat-stand {
  background-image: url(../assets/cat/catTest.png);
  background-position-y: -288px;
  width: calc(256px / 8);
  height: calc(320px / 10);
  animation: stand 0.7s steps(8) infinite;
  transform: scale(2) translateX(25%);
}

.cat-stand-flip {
  background-image: url(../assets/cat/catTest.png);
  background-position-y: -288px;
  transform: scaleX(-2) scaleY(2) translateX(25%);
  width: calc(256px / 8);
  height: calc(320px / 10);
  animation: stand 0.7s steps(8) infinite;
}

@keyframes stand {
  100% {
    background-position-x: -256px;
  }
}

.move-left {
  background-image: url(../assets/cat/catTest.png);
  background-position-y: -257px;
  transform: scaleX(-2) scaleY(2);
  width: calc(224px / 7);
  height: calc(320px / 10);
  animation: moveLeft 0.7s ease-out forwards, jump 0.7s steps(7) alternate;
}

.move-right {
  background-image: url(../assets/cat/catTest.png);
  background-position-y: -257px;
  width: calc(224px / 7);
  height: calc(320px / 10);
  animation: moveRight 0.7s ease-out forwards, jump 0.7s steps(7) alternate;
}

@keyframes jump {
  100% {
    background-position-x: -224px;
  }
}

@keyframes moveRight {
  0% {
    transform: translateX(0) scale(2);
  }
  100% {
    transform: translateX(80px) scale(2);
  }
}

@keyframes moveLeft {
  0% {
    transform: translateX(0) scaleX(-2, 2);
  }
  100% {
    transform: translateX(-50px) scale(-2, 2);
  }
}

.bg-black-2 {
  transform: translate(100%, 0);
}
.hexagon {
  clip-path: polygon(50% -10%, 95% 24%, 95% 72%, 50% 110%, 4% 72%, 4% 26%);
}
.game-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transform-origin: 0px 0px;
  transform: translate(0%, 7%);
}

.translate-x {
  transform: translateX(4.5%);
}

.board-row {
  display: flex;
}

.time {
  font-size: 200%;
}

@media (min-width: 375px) {
  .game-board {
    margin: 0 auto;
  }

  .board-row {
    height: 27px;
  }

  .scale-hexagon {
    height: 32px;
    width: 32px;
  }
}

@media (min-width: 390px) {
  .game-board {
    margin: 0 auto;
  }

  .board-row {
    height: 28px;
  }

  .scale-hexagon {
    height: 33px;
    width: 33px;
  }

  .control {
    font-size: 11px;
  }
}

@media (min-width: 414px) {
  .game-board {
    margin: 0 auto;
  }

  .board-row {
    height: 30px;
  }

  .scale-hexagon {
    height: 35px;
    width: 35px;
  }
}

@media (min-width: 428px) {
  .game-board {
    margin: 0 auto;
  }

  .board-row {
    height: 30px;
  }

  .scale-hexagon {
    height: 36px;
    width: 36px;
  }
}

@media (min-width: 768px) {
  .game-board {
    margin: 0 auto;
    padding-right: 4%;
    transform: translate(0%, 3%);
  }
  .board-row {
    height: 54px;
  }
  .scale-hexagon {
    height: 64px;
    width: 64px;
  }
  .control {
    font-size: 18px;
  }

  .time {
    font-size: 50px;
  }
}

@media (min-width: 800px) {
  .game-board {
    margin: 0 auto;
    padding-right: 4.3%;
    width: 50%;
  }

  .board-row {
    height: 57px;
  }

  .scale-hexagon {
    height: 69px;
    width: 69px;
  }
}

@media (min-width: 820px) {
  .game-board {
    margin: 0 auto;
    padding-right: 4%;
    width: 50%;
  }

  .board-row {
    height: 55px;
  }

  .scale-hexagon {
    height: 65px;
    width: 65px;
  }
}

@media (min-width: 900px) {
  .game-board {
    margin: 0 auto;
    width: 50%;
  }

  .board-row {
    height: 52px;
  }
}

@media (min-width: 1024px) {
  .game-board {
    margin: 0 auto;
    padding-right: 4%;
    width: 50%;
  }

  .board-row {
    height: 62px;
  }
  .scale-hexagon {
    height: 75px;
    width: 75px;
  }
  .control {
    font-size: 20px;
  }

  .time {
    font-size: 50px;
  }
}

@media (min-width: 1280px) {
  .game-board {
    margin: 0 auto;
    padding-right: 3%;
    width: 50%;
  }

  .board-row {
    height: 53px;
  }
  .scale-hexagon {
    height: 65px;
    width: 65px;
  }
}
</style>
