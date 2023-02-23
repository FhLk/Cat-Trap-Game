<script setup>
import { ref,computed } from 'vue';
import { loseGame } from './Alert';

const emit = defineEmits(['time-out'])

const time = ref(60)
const timer = setInterval(()=>{
    if(time.value === 1){
        clearInterval(timer)
        emit('time-out')
    }
    time.value--
},1000)

</script>
 
<template>
    <div>
        <p class="time font-medium flex justify-center">Time : {{ time }} </p>
    </div>
</template>
 
<style scoped>
.time{
  font-size: 4vh;
}
</style>