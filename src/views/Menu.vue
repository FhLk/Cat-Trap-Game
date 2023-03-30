<script setup>
import Tutorial from "../components/Tutorrial.vue";
import LevelButton from "../components/Level-Button.vue";
import { onBeforeUnmount, onBeforeMount, ref, onBeforeUpdate } from "vue";
import LgButton from "../components/Lg-Button.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  language: String,
});

const emit = defineEmits(["toGame"]);

const isOpen = ref(false);
const openHtp = () => {
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
};

const Router = useRouter();
const goToGame = (level) => {
  Router.push({ name: "Game", params: { level: level } });
};
</script>

<template>
  <div class="body text-center">
    <Tutorial v-if="isOpen" @closed="openHtp()" />
    <div class="title space-y-7">
      <div class="title-name uppercase font-bold">
        <h1>Trap The Cat</h1>
      </div>
      <div class="play space-y-10">
        <button
          @click="goToGame(1)"
          type="button"
          class="bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
        >
          {{ language === "TH" || language === null ? "เล่น" : "Play" }}
        </button>
        <!-- <LevelButton :language="language" @toGame="$emit('toGame')"/> -->
        <div>
          <button
            @click="openHtp()"
            class="bg-blue-600 p-1 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
          >
            {{
              language === "TH" || language === null
                ? "วิธีการเล่น"
                : "How to play"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 100%;
}

.language {
  position: absolute;
  top: 2%;
  right: 5%;
}

.title {
  transform: translate(0, 25%);
}

.title-name {
  font-size: 50px;
}

.play button {
  font-size: 100%;
  height: 60px;
  width: 100px;
  padding: 10px;
}

@media (min-width: 300px) {
  .language {
    transform: scale(0.7);
  }
}

@media (min-width: 414px) {
  .language {
    transform: scale(0.8);
  }
}

@media (min-width: 800px) {
  .language {
    transform: scale(1);
  }
}
</style>
