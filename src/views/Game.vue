<script setup>
import Scence from "../components/Scence.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { onBeforeMount, ref } from "vue";
import Swal from "sweetalert2";
import API from "../components/api";
import ScenceEdit from "../components/Scence-Edit.vue";
import ResultPopup from "../components/ResultPopup.vue";
let { params } = useRoute();

const props = defineProps({
  language: String,
});

const emit = defineEmits(["toMenu"]);

const level = ref(Number(params.level));
const isReset = ref(false);
const isSound = ref(false)

onBeforeMount(() => {
  if (level.value > 3 || level.value < 1) {
    Router.push({ name: "not-found" });
  }
});

const api = new API()
const Router = useRouter();
const goToMenu = async () => {
  result.value = false;
  Router.push({ name: "Home" });
  emit("toMenu");
};

const nextLevel = () => {
  result.value = false;
  level.value++
  Router.push({ name: "Game", params: { level: level.value } });
};

const result = ref(false)
const isWin = ref(false)
function winGame() {
  result.value = true
  isWin.value = true
}

function loseGame() {
  result.value = true
  isWin.value = false
}

async function tryAgain(){
  result.value = false;
  isReset.value = true;
}
</script>

<template>
  <div class="bg-body">
    <!-- <Scence :language="language" :level="level" @winGame="winGame()" @loseGame="loseGame()" :reset="isReset"
        @reset="isReset = false" /> -->
    <ResultPopup :level="level" :isResult="result" :is-win="isWin" @close="goToMenu()" @next="nextLevel"  @try-agin="tryAgain()" />
    <ScenceEdit :reset="isReset" :level="level" @reset="isReset = false" @winGame="winGame()"  @loseGame="loseGame()" />
    <div class="control-btn space-y-6">
      <div @click="isSound = !isSound" class="flex justify-center">
        <div v-if="isSound" class="speaker-on-btn"></div>
        <div v-else class="speaker-off-btn"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.speaker-on-btn {
  background-image: url(../assets/trapthecat_asset/sound_on_ic.svg);
  background-size: cover;
  width: 36.46px;
  height: 41.63px;
}

.speaker-off-btn {
  background-image: url(../assets/trapthecat_asset/sound_off_ic.svg);
  background-size: cover;
  width: 36.46px;
  height: 41.63px;
}

.reset-btn1 {
  background-image: url(../assets/trapthecat_asset/select_btn.svg);
  background-size: 100%;
  width: 141.5px;
  height: 51.39px;
}

.reset-btn2 {
  background-image: url(../assets/trapthecat_asset/select_ic.png);
  background-size: 100%;
  width: 141.5px;
  height: 51.39px;
}

.bg-body {
  height: auto;
}

.control-btn {
  transform: translate(0%, 180px);
}

@media (min-width: 300px) {
  .control {
    font-size: 9px;
  }
}

@media (min-width: 390px) {
  .control {
    font-size: 11px;
  }
}

@media (min-width: 768px) {
  .control {
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  .control {
    font-size: 20px;
  }
}</style>
