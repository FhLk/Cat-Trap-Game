<script setup>
import { onBeforeMount, onUpdated, ref, onMounted,computed } from 'vue';
import { winGame, loseGame } from './Alert.js';
import Timer from '../components/Timer.vue'

const hexagon_normal = './hexagon.svg'
const hexagon_cat = './hexagon-red.svg'
const hexagon_disable = "./hexagon-grey.svg"
const hexagon_Q1 = "./hexagon-green.svg"
const hexagon_Q2 = "./hexagon-purple.svg"
const hexagon_Q3 = "./hexagon-blue.svg"
const hexagon_Q4 = "./hexagon-orange.svg"

const props = defineProps({
  blocks :{
    type: Number,
    rquire: true
  }
})

const gameBoard = ref(new Array(11).fill().map((_, i) => new Array(11).fill().map((_, j) => (
  { x: i, y: j, hexagon: hexagon_normal, select: false, cat: false }
))));

const divideBoardIntoFour = (gameBoard) => {
  const Q_TOP = gameBoard.slice(0, 5)
  const Q_BOTTOM = gameBoard.slice(6, 11)
  const Q1 = []
  const Q2 = []
  const Q3 = []
  const Q4 = []
  for (let i = 0; i < Q_TOP.length; i++) {
    Q1.push(Q_TOP[i].slice(0, 5));
    Q2.push(Q_TOP[i].slice(6, 11));
  }

  for (let i = 0; i < Q_BOTTOM.length; i++) {
    Q3.push(Q_BOTTOM[i].slice(0, 5));
    Q4.push(Q_BOTTOM[i].slice(6, 11));
  }
  return [Q1, Q2, Q3, Q4]
}

const divideBoardIntoTwo = (gameBoard) => {
  const Q_TOP = gameBoard.slice(0, 5)
  const Q_BOTTOM = gameBoard.slice(6, 11)
  const Q1 = []
  const Q2 = []
  for (let i = 0; i < Q_TOP.length; i++) {
    Q1.push(Q_TOP[i].slice(0, 11));
  }

  for (let i = 0; i < Q_BOTTOM.length; i++) {
    Q2.push(Q_BOTTOM[i].slice(0, 11));
  }

  Q1.forEach((Q)=>{
    Q.forEach((n)=>{
      n.hexagon = hexagon_Q1
    })
  })

  Q2.forEach((Q)=>{
    Q.forEach((n)=>{
      n.hexagon = hexagon_Q2
    })
  })

  return [Q1, Q2]
}

const Q = divideBoardIntoTwo(gameBoard.value)


// const Q = divideBoardIntoFour(gameBoard.value)

const RandomBlock = (Q) => {
  let blocks = [];
  // let countBlocks = props.blocks
  let countBlocks = 12
  for (let i = 0; i < Q.length; i++) {
    let part = Q[i];
    let partBlocks = new Set();
    while (partBlocks.size < countBlocks) {
      const block = part[Math.floor(Math.random() * part.length)][Math.floor(Math.random() * part[0].length)];
      block.hexagon = hexagon_disable;
      block.select = true
      partBlocks.add(block);
    }
    blocks = blocks.concat(Array.from(partBlocks));
  }

  const blockArray = Array.from(blocks);
  return blockArray
}

const Destination = () => {
  const BOARD_SIZE = gameBoard.value[0].length;
  const setDestination = new Set();
  for (let i = 0; i < BOARD_SIZE; i++) {
    setDestination.add(gameBoard.value[0][i]);
    setDestination.add(gameBoard.value[i][0]);
    setDestination.add(gameBoard.value[BOARD_SIZE - 1][i]);
    setDestination.add(gameBoard.value[i][BOARD_SIZE - 1]);
  }
  let destination = Array.from(setDestination)
  destination = destination.filter(n => !n.select)
  return destination
}

const getNeighbors = (node) => {
  const x = node.x;
  const y = node.y;
  let neighbors = [];
  const addNeighbor = (x, y) => {
    const n = gameBoard.value[x] && gameBoard.value[x][y];
    if (n && !n.select) {
      neighbors.push(n);
    }
  };

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

function heuristic(a, b) {
  // Returns the estimated cost between two nodes
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

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

const cat = ref({})
const selectHexagon = (row, index) => {
  try {
    if (!gameBoard.value[row][index].select && !gameBoard.value[row][index].cat) {
      gameBoard.value[row][index].hexagon = hexagon_disable
      gameBoard.value[row][index].select = true
      blocks.push(gameBoard.value[row][index])
      const currentMove = gameBoard.value[path.value[0].x][path.value[0].y]
      path.value = aStar(currentMove, end.value)
      if (path.value.length < 5) {
        end.value = closestCat(currentMove)
        path.value = aStar(currentMove, end.value)
      }
      if (path.value.length > 7) {
        end.value = closestCat(currentMove)
        path.value = aStar(currentMove, end.value)
      }
      const previousMove = gameBoard.value[path.value[0].x][path.value[0].y]
      previousMove.hexagon = hexagon_normal;
      previousMove.cat = false
      previousMove.select = false
      path.value.shift()
      const nextMove = gameBoard.value[path.value[0].x][path.value[0].y]
      nextMove.hexagon = hexagon_cat
      nextMove.cat = true
      checkLoseGame(nextMove)
      cat.value = nextMove
    }
    return
  } catch (error) {
    winGame()
    return
  }
}

const checkLoseGame = (currentCat) => {
  setDestination.value.forEach((n) => {
    if (currentCat.x === n.x && currentCat.y === n.y) {
      loseGame()
    }
  })
}

const closestCat = (currentCat) => {
  setDestination.value = setDestination.value.filter(n => !n.select)
  let distance = Number.POSITIVE_INFINITY
  let newDestination = end.value
  for (let i = 0; i < setDestination.value.length; i++) {
    let newPath = aStar(currentCat, setDestination.value[i])
    newPath.shift()
    if (newPath.length < distance && newPath.length !== 0 && !setDestination.value.select) {
      newDestination = newPath[newPath.length - 1]
      distance = newPath.length
    }
  }
  return newDestination
}

gameBoard.value[5][5].hexagon = hexagon_cat;
gameBoard.value[5][5].cat = true
const blocks = RandomBlock(Q)
const setDestination = ref(Destination())
const destination = setDestination.value[Math.floor(Math.random() * setDestination.value.length)]
const path = ref([])
const start = gameBoard.value[5][5];
cat.value = start
const end = ref(gameBoard.value[destination.x][destination.y])
onBeforeMount(() => {
  path.value = aStar(start, end.value);
  if (path.value.length === 0) {
    path.value = aStar(start, end.value);
  }
})

// onMounted(() => {
//   console.log("------------------");
//   console.log("Data Start");
//   console.log("------------------");
//   console.log('1. Board');
//   console.log(gameBoard.value);
//   console.log('2. Cat Posiotion');
//   console.log(cat.value);
//   console.log('3. Set of Destination');
//   console.log(setDestination.value);
//   console.log("4. Destination");
//   console.log(end.value);
//   console.log("5. Path");
//   console.log(path.value);
//   console.log("6. Block Position");
//   console.log(blocks);
//   console.log("------------------");
// })

// onUpdated(()=>{
//   console.log("------------------");
//   console.log('Data Updated');
//   console.log("------------------");
//   console.log("1. Board");
//   console.log(gameBoard.value);
//   console.log("2. Cat Position");
//   console.log(cat.value);
//   console.log('3. Set of Destination');
//   console.log(setDestination.value);
//   console.log("4. Destination");
//   console.log(end.value);
//   console.log('5. Path');
//   console.log(path.value);
//   console.log("6. Block Position");
//   console.log(blocks);
//   console.log("------------------");
// })

const Test = (data)=>{
  console.log(data);
}

</script>
 
<template>
  <div class="game bg-[#5f9ea0] h-screen p-5">
    <Timer @time-out="Test"/>
    <div class="game-board translate-x-1/2 mt-5">
      <div v-for="(row, rowIndex) in gameBoard" :class="`board-row ${rowIndex % 2 !== 0 ? 'translate-x' : ''}`">
        <div v-for="(hexagon, index) in row" :key="index" :class="`cell-${index}`">
          <button :disabled="hexagon.select || hexagon.cat" class="hexagon">
            <img :src="hexagon.hexagon" class="scale-hexagon" @click="selectHexagon(rowIndex, index)">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<style scoped>

.hexagon {
  clip-path: polygon(50% -10%, 95% 24%, 95% 72%, 50% 110%, 4% 72%, 4% 26%);
}
.game-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transform-origin: 0px 0px;
  width:50%;
}

.translate-x {
  transform: translateX(4.5%);
}

.board-row {
  display: flex;
  justify-content: center;
  height: 7vh;
}

.scale-hexagon {
  width: 70px;
  height: 60px;
}
</style>