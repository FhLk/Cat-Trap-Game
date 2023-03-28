<script setup>
import Scence from "../components/Scence.vue";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import Swal from "sweetalert2";
let { params } = useRoute();

console.log(document.visibilityState);

const level = Number(params.level);
onBeforeMount(() => {
  if (level > 3 || level < 1) {
    Router.push({ name: "not-found" });
  }
});

const reset = () => {
  location.reload()
};

const Router = useRouter();
const goToMenu = () => {
  Router.push({ name: "Home" });
};


function winGame() {
    Swal.fire({
        icon:'success',
        allowOutsideClick:false,
        title:'YOU WIN!!!',
        text:'You can catch a cat.',
    }).then(()=>{
        goToMenu()
    })
}

function loseGame(){
    Swal.fire({
        icon:'error',
        allowOutsideClick:false,
        title:'YOU LOSE!!!',
        text:'You let the cat escape.',
    }).then(()=>{
      goToMenu()
    })
}
</script>

<template>
  <div>
    <Scence :level="level" @winGame="winGame()" @loseGame="loseGame()" />
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
