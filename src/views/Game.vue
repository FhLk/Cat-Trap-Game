<script setup>
import Scence from "../components/Scence.vue";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
let { params } = useRoute();

const level = Number(params.level);
onBeforeMount(() => {
  if (level > 3 || level < 1) {
    Router.push({ name: "not-found" });
  }
});

const reset = () => {
  location.reload();
};

const Router = useRouter();
const goToMenu = () => {
  Router.push({ name: "Home" });
};
</script>

<template>
  <div>
    <Scence :level="level" />
    <div class="control flex justify-around">
      <button
        @click="goToMenu()"
        class="home-btn px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700"
      >
        HOME
      </button>
      <button
        @click="reset"
        class="reset-btn px-6 py-2.5 bg-blue-600 text-white font-medium leading-tight uppercase rounded shadow-md hover:bg-blue-700"
      >
        RESET
      </button>
    </div>
  </div>
</template>

<style scoped>
.control {
  transform: translate(0px, 50px);
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
