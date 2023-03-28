<script setup>
import Loading from "./components/Loading.vue";
import Music from "./components/Music.vue";

import { ref, onBeforeMount } from "vue";
import LgButton from "./components/Lg-Button.vue";

const progress = ref(0);
const progressing = () => {
  let progressBar = setInterval(() => {
    progress.value = progress.value + 1;
    console.log(progress.value);
    if (progress.value === 120) {
      clearInterval(progressBar);
    }
  }, 20);
};

progressing();

const getLG = ref(localStorage.getItem("language"))
onBeforeMount(()=>{
    if(localStorage.getItem("language")=== null){
        localStorage.setItem("language","TH")
        // language.value = localStorage.getItem("language")
    }
    else{
        localStorage.setItem("language","EN")
        // language.value = localStorage.getItem("language")
    }
})

</script>

<template>
  <Loading v-if="progress !== 120"/>
  <div v-show="progress === 120">
    <RouterView> </RouterView>
    <div class="flex justify-between">
      <Music class="music" />
      <LgButton class="language"/>
    </div>
  </div>
</template>

<style scoped>
.music {
  position: absolute;
  top: 2%;
  left: 5%;
}

.language {
  position: absolute;
  top: 2%;
  right: 5%;
}
</style>
