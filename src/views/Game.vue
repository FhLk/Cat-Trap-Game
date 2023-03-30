<script setup>
import Scence from "../components/Scence.vue";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import Swal from "sweetalert2";
let { params } = useRoute();

const props = defineProps({
  language: String,
});

const emit = defineEmits(["toMenu"]);

const level = Number(params.level);
onBeforeMount(() => {
  if (level > 3 || level < 1) {
    Router.push({ name: "not-found" });
  }
});

const reset = () => {
  Router.push({ name: "Home" });
  emit("toMenu");
};

const Router = useRouter();
const goToMenu = () => {
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
    title: "YOU WIN!!!",
    text: "You can catch a cat.",
    showCancelButton: true,
    confirmButtonText: "Next Level",
    cancelButtonText: "Closed",
    reverseButtons: true,
  }).then((r) => {
    console.log(r);
    // if (r.isConfirmed) {
    //   if (level === 1) {
    //     nextLevel(2);
    //   } else {
    //     nextLevel(3);
    //   }
    // } else {
    //   goToMenu();
    // }
  });
}

function loseGame() {
  Swal.fire({
    icon: "error",
    allowOutsideClick: false,
    title: "YOU LOSE!!!",
    text: "You let the cat escape.",
    showCancelButton: true,
    confirmButtonText: "Next Level",
    cancelButtonText: "Closed",
    reverseButtons: true,
  }).then((r) => {
    console.log(r);
    if (r.isConfirmed) {
      console.log("wow1");
      console.log(level);
      if (level === 1) {
        console.log("wow2");
        nextLevel(2);
      } else {
        console.log("wow3");
        nextLevel(3);
      }
    } 
    else {
      console.log("wow4");
      goToMenu();
    }
  });
}
</script>

<template>
  <div>
    <Scence
      :language="language"
      :level="level"
      @winGame="winGame()"
      @loseGame="loseGame()"
    />
    <div class="control flex justify-around">
      <button
        @click="goToMenu()"
        class="home-btn px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700"
      >
        Home
      </button>
      <button
        @click="reset()"
        class="reset-btn px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700"
      >
        {{ language === "TH" || language === null ? "เริ่มใหม่" : "Reset" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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
