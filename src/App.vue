<script setup>
import Loading from "./components/Loading.vue";
import Music from "./components/Music.vue";

import { ref, onBeforeMount, computed } from "vue";
import LgButton from "./components/Lg-Button.vue";
import API from "./components/api.js"


const progress = ref(0);
const api = new API();
const resAPI = ref({
  authen:{},
  reward:{},
  play:{}
})
const progressing = () => {
  let progressBar = setInterval(async () => {
    progress.value = progress.value + 1;
    if (progress.value === 120) {
      clearInterval(progressBar);
      sessionStorage.setItem("loading", 100);
      resAPI.value.reward = await api.RewardInfo()
    }
  }, 20);
};

const getProgress = ref(Number(sessionStorage.getItem("loading")));
const getLG = ref(sessionStorage.getItem("language"));

onBeforeMount( async () => {
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
  <div v-else>
    <RouterView :language="getLG" @toGame="page=1" @toMenu="page=0"> </RouterView>
    <div class="flex justify-between">
      <Music :language="getLG" class="music" />
      <LgButton v-show="page === 0" class="language" @change="changeLanguage" />
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

@media (min-width: 300px) {
  .music {
    transform: scale(0.7);
  }

  .language {
    transform: scale(0.7);
  }
}

@media (min-width: 414px) {
  .music {
    transform: scale(0.8);
  }

  .language {
    transform: scale(0.8);
  }
}

@media (min-width: 800px) {
  .music {
    transform: scale(1);
  }

  .language {
    transform: scale(1);
  }
}
</style>
