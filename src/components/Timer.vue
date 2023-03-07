<script setup>
import { ref, computed, onUpdated } from "vue";
import { loseGame } from "./Alert";

const emit = defineEmits(["time-out","reset-time"]);
const props = defineProps({
  time: Number,
  onReset : Function
});

const getTime = ref(props.time);
const setTimer = ref(null)

const startTime = ()=>{
  // emit('reset-time',)
  setTimer.value = setInterval(()=>{
    if(getTime.value === 0){
      emit("time-out",0)
      reset()
    }
    getTime.value--
  },1000)
}
startTime()

const reset = ()=>{
  props.onReset()
}
</script>

<template>
  <div>
    <p class="time font-medium flex justify-center">Time : {{ getTime }}</p>
  </div>
</template>

<style scoped>
.time {
  font-size: 200%;
}

@media (min-width: 768px) {
  .time {
    font-size: 50px;
  }
}

@media (min-width: 1024px) {
  .time {
    font-size: 50px;
  }
}
</style>
