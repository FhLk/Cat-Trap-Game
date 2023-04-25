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

const reset = (r) => {
  isReset.value = true;
  result.value = false;
};

const api = new API()
const Router = useRouter();
const goToMenu = async () => {
  await api.RewardInfo()
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
  // Swal.fire({
  //   icon: "success",
  //   allowOutsideClick: false,
  //   title: `${props.language === "TH" || props.language === null ? 'คุณชนะ!!!' : 'YOU WIN!!!'} `,
  //   text: `${props.language === "TH" || props.language === null ? 'คุณสามรถจับแมวได้' : 'You can catch a cat.'}`,
  //   showCancelButton: true,
  //   showConfirmButton: level.value === 3 ? false : true,
  //   confirmButtonText: `${props.language === "TH" || props.language === null ? 'ต่อไป' : 'Next Level'}`,
  //   cancelButtonText: `${props.language === "TH" || props.language === null ? 'ปิด' : 'Closed'}`,
  //   reverseButtons: true,
  // }).then((r) => {
  //   if (r.isConfirmed) {
  //     if (level.value === 1) {
  //       nextLevel(2);
  //       level.value = 2;
  //     } else if (level.value === 2) {
  //       nextLevel(3);
  //       level.value = 3;
  //     }
  //   } else {
  //     goToMenu();
  //   }
  // });
}

function loseGame() {
  result.value = true
  isWin.value = false
  // isReset.value =true
  // Swal.fire({
  //   icon: "error",
  //   allowOutsideClick: false,
  //   title: `${props.language === "TH" || props.language === null ? 'คุณแพ้!!!' : 'YOU LOSE!!!'}`,
  //   text: `${props.language === "TH" || props.language === null ? 'คุณปล่อยให้แมวหนีไปได้' : 'You let the cat escape.'}`,
  //   showCancelButton: true,
  //   confirmButtonText: `${props.language === "TH" || props.language === null ? 'ปิด' : 'Closed'}`,
  //   cancelButtonText: `${props.language === "TH" || props.language === null ? 'ลองใหม่' : 'Try Agian'}`,
  // }).then((r) => {
  //   if (r.dismiss) {
  //     isReset.value = true;
  //   } else {
  //     goToMenu();
  //   }
  // });
}
</script>

<template>
  <div class="bg-body">
    <!-- <Scence :language="language" :level="level" @winGame="winGame()" @loseGame="loseGame()" :reset="isReset"
        @reset="isReset = false" /> -->
    <ResultPopup :level="level" :isResult="result" :is-win="isWin" @close="goToMenu()" @next="nextLevel"  @reset="reset" />
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
  transform: translate(0%, 200px);
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
