<script setup>
import { useRouter } from 'vue-router';

const Router = useRouter()
const goToGame = (level) => {
    Router.push({ name: 'Game', params: { level: level } })
};

</script>
 
<template>
    <div>
        <div class="play flex justify-around">
            <button type="button" @click="goToGame(1)" class="
                        bg-blue-600 text-white font-medium 
                        text-xs leading-tight uppercase rounded shadow-md 
                        hover:bg-blue-700 ">Level 1</button>
            <button type="button" @click="goToGame(2)" class="
                        bg-blue-600 text-white font-medium 
                        text-xs leading-tight uppercase rounded shadow-md 
                        hover:bg-blue-700 ">Level 2</button>
            <button type="button" @click="goToGame(3)" class="
                        bg-blue-600 text-white font-medium 
                        text-xs leading-tight uppercase rounded shadow-md 
                        hover:bg-blue-700 ">Level 3</button>
        </div>
    </div>
</template>
 
<style scoped>
.play button {
    font-size: 2vh;
    height: 60px;
    width: 15%;
}
</style>