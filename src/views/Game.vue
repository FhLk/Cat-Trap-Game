<script setup>
import Scence from '../components/Scence.vue';
import { useRoute, useRouter } from 'vue-router'
const Router = useRouter()
const goToMenu = () => {
    Router.push({ name: 'Home'})
};

const reset=()=>{
    location.reload()
}
</script>
 
<template>
    <div>
        <div class="back absolute ml-10 mt-5">
            <button @click="goToMenu()" class="px-6 py-2.5 bg-blue-600 text-white font-medium 
          text-xs leading-tight uppercase rounded shadow-md 
          hover:bg-blue-700 ">BACK</button>
        </div>
        <div class="reset absolute mt-5">
            <button @click="reset()" class="px-6 py-2.5 bg-blue-600 text-white font-medium 
          text-xs leading-tight uppercase rounded shadow-md 
          hover:bg-blue-700 ">RESET</button>
        </div>
        <Scence />
    </div>
</template>
 
<style scoped>
.reset{
    left: 10%;
}
</style>