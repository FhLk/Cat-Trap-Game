<script setup>
import Tutorial from "../components/Tutorrial.vue";
import LevelButton from "../components/Level-Button.vue";
</script>

<template>
  <div class="body h-screen text-center">
    <div class="title space-y-7">
      <div class="title-name uppercase font-bold">
        <h1>Trap The Cat</h1>
      </div>
      <div class="play space-y-10">
        <LevelButton />
        <div>
          <button @click=""
            type="button"
            class="bg-blue-600 z-10 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
          >
            How to play
          </button>
        </div>
      </div>
      <Tutorial/>
      <!-- <div class="flex justify-around">
        <Tutorial class="tutorial w-fit m-5 mt-0" />
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 100%;
  background-color: #5f9ea0;
}

.title-name {
  font-size: 50px;
}

.play button {
  font-size: 3vh;
  height: 60px;
  width: 20%;
}

@media (min-width: 428px) {
  .title {
    transform: translate(50%, 50%);
  }
}

@media (min-width: 390px) and (max-width: 400px) {
  .title {
    transform: translate(0%, 5%);
  }
}

@media (min-width: 768px) {
  .title {
    transform: translate(0%, 13%);
  }
}
</style>
