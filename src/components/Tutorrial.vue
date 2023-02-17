<script setup>
import { ref } from 'vue';

const information = ref([
    { tile: "CAT", img: "./hexagon-red.svg" },
    { tile: "WAY", img: "./hexagon.svg" },
    { tile: "BLOCK", img: "./hexagon-grey.svg" },
])

</script>
 
<template>
    <div class="bg-white rounded-lg p-5 space-y-3">
        <h1 class="text-lg font-medium">How To Play</h1>
        <div class="text-center">
            <p class="font-medium">Don't Let the Cat Get Away, By placing blocks to keep the cat away By placing a block 1 time, the cat moves 1 time.</p>
            <p class="font-medium"> {{ ">>" }} <span class="underline"> {{ "Left-click is to place a block." }}</span> {{ "<<" }} </p>
        </div>
        <div>
            <div class="flex justify-center">
                <img src="../assets/example.png" class="board-example rounded-lg">
            </div>
            <p class="font-medium">Area of Cat (11x11)</p>
        </div>
        <div class="flex justify-around">
            <div v-for="(info, index) in information " :key="index">
                <img :src="info.img" class="hexagon" />
                <p class="font-medium">{{ info.tile }}</p>
            </div>
        </div>
    </div>
</template>
 
<style scoped>

.board-example {
    width: 15vw;
    height: 22.5vh;
}

.bg-white {
    height: auto;
}

.text-lg {
    font-size: 5vh;
}

.hexagon {
    width: 50px;
    height: 50px;
}
</style>