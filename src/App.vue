<script setup>
import Loading from "./components/Loading.vue";
import Music from "./components/Music.vue";

import { ref, onBeforeMount, computed } from "vue";
import LgButton from "./components/Lg-Button.vue";
import API from "./components/api.js"


const progress = ref(0);
const api = new API();
const resAPI = ref({
  authen: {},
  setup: {},
  play: {}
})
const progressing = () => {
  let progressBar = setInterval(async () => {
    progress.value = progress.value + 1;
    if (progress.value === 120) {
      clearInterval(progressBar);
      sessionStorage.setItem("loading", 100);
    }
  }, 20);
};

const getProgress = ref(Number(sessionStorage.getItem("loading")));
const getLG = ref(sessionStorage.getItem("language"));

onBeforeMount(async () => {
  resAPI.value.authen = await api.Authen()
  if (getProgress.value === 0) {
    progressing();
  }
  if (getLG.value === null || getLG.value === "TH") {
    sessionStorage.setItem("language", "TH");
  } else {
    sessionStorage.setItem("language", "EN");
  }
});

const changeLanguage = (language) => {
  getLG.value = language;
};

const page = ref(0)
</script>

<template>
  <Loading v-if="getProgress !== 100 && progress !== 120" />
  <RouterView v-else :language="getLG" @toGame="page = 1" @toMenu="page = 0"> </RouterView>
  <div class="flex justify-between">
    <!-- <Music :language="getLG" class="music" /> -->
    <LgButton v-show="page === 0" class="language" @change="changeLanguage" />
  </div>
</template>

<style scoped>
.language {
  position: absolute;
  top: 5%;
  right: 5%;
}

@media (min-width: 300px) {

  .language {
    transform: scale(0.7);
  }
}

@media (min-width: 414px) {
  .language {
    transform: scale(1);
  }
}

@media (min-width: 800px) {

  .language {
    transform: scale(1);
  }
}
</style>
