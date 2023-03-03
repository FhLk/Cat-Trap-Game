<script setup>
import Scence from '../components/Scence.vue';
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from 'vue';
let { params } = useRoute()

const level = Number(params.level)
onBeforeMount(()=>{
    if(level > 3 || level < 1){
        Router.push({name:'not-found'})
    }
})


</script>
 
<template>
    <div>
        <Scence :level="level" />
    </div>
</template>
 
<style scoped>
</style>