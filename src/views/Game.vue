<script setup>
import Scence from "../components/Scence.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { onBeforeMount, ref } from "vue";
import Swal from "sweetalert2";
import API from "../components/api";
import ScenceEdit from "../components/Scence-Edit.vue";
let { params } = useRoute();

const props = defineProps({
  language: String,
});

const emit = defineEmits(["toMenu"]);

const level = ref(Number(params.level));
const isReset = ref(false);

onBeforeMount(() => {
  if (level.value > 3 || level.value < 1) {
    Router.push({ name: "not-found" });
  }
});

const reset = () => {
  isReset.value = true;
  emit("toMenu");
};

const api = new API()
const Router = useRouter();
const goToMenu = async () => {
  await api.RewardInfo()
  Router.push({ name: "Home" });
  emit("toMenu");
};

const nextLevel = (level) => {
  Router.push({ name: "Game", params: { level: level } });
};

function winGame() {
  Swal.fire({
    icon: "success",
    allowOutsideClick: false,
    title: `${props.language === "TH" || props.language === null ? 'คุณชนะ!!!' : 'YOU WIN!!!'} `,
    text: `${props.language === "TH" || props.language === null ? 'คุณสามรถจับแมวได้' : 'You can catch a cat.'}`,
    showCancelButton: true,
    showConfirmButton: level.value === 3 ? false : true,
    confirmButtonText: `${props.language === "TH" || props.language === null ? 'ต่อไป' : 'Next Level'}`,
    cancelButtonText: `${props.language === "TH" || props.language === null ? 'ปิด' : 'Closed'}`,
    reverseButtons: true,
  }).then((r) => {
    if (r.isConfirmed) {
      if (level.value === 1) {
        nextLevel(2);
        level.value = 2;
      } else if (level.value === 2) {
        nextLevel(3);
        level.value = 3;
      }
    } else {
      goToMenu();
    }
  });
}

function loseGame() {
  Swal.fire({
    icon: "error",
    allowOutsideClick: false,
    title: `${props.language === "TH" || props.language === null ? 'คุณแพ้!!!' : 'YOU LOSE!!!'}`,
    text: `${props.language === "TH" || props.language === null ? 'คุณปล่อยให้แมวหนีไปได้' : 'You let the cat escape.'}`,
    showCancelButton: true,
    confirmButtonText: `${props.language === "TH" || props.language === null ? 'ปิด' : 'Closed'}`,
    cancelButtonText: `${props.language === "TH" || props.language === null ? 'ลองใหม่' : 'Try Agian'}`,
  }).then((r) => {
    if (r.dismiss) {
      isReset.value = true;
    } else {
      goToMenu();
    }
  });
}
</script>

<template>
  <div class="bg-body">
    <!-- <Scence :language="language" :level="level" @winGame="winGame()" @loseGame="loseGame()" :reset="isReset"
      @reset="isReset = false" /> -->
      <ScenceEdit/>
    <!-- <div class="control flex justify-around">
      <button @click="goToMenu()"
        class="home-btn px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700">
        Home
      </button>
      <p class="text-4xl font-medium uppercase rounded">
        {{ language === "TH" || language === null ? `ด่าน ${level}` : `level ${level}` }}
      </p>
      <button @click="reset()"
        class="reset-btn px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700">
        {{ language === "TH" || language === null ? "เริ่มใหม่" : "Reset" }}
      </button>
    </div> -->
  </div>
</template>

<style scoped>
.bg-body{
  height: 100%;
}
.control {
  transform: translate(0px, 50px);
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
}
</style>
