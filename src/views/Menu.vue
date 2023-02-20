<script setup>
import Tutorial from '../components/Tutorrial.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed,ref } from 'vue';
const Router = useRouter()
const goToGame = () => {
    Router.push({ name: 'Game' })
};
</script>
 
<template>
    <div class="body absolute text-center">
        <div class="title absolute space-y-7">
            <div class="title-name uppercase">
                <h1>Trap The Cat</h1>
            </div>
            <div class="play">
                <button type="button" @click="goToGame()" class="
                    bg-blue-600 text-white font-medium 
                    text-xs leading-tight uppercase rounded shadow-md 
                    hover:bg-blue-700 ">PLAY</button>
            </div>
            <Tutorial />
        </div>
    </div>
</template>
 
<style scoped>
.body {
    height: 100%;
    width: 100%;
    background-color: #5f9ea0;
}

.title {
    transform: translate(-50%, -52%);
    top: 50%;
    left: 50%;
    width: 600px;
}

.title-name {
    font-size: 7vh;
}

.play button {
    font-size: 3vh;
    height: 60px;
    width: 20%;
}

</style>