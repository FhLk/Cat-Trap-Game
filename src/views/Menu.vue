<script setup>
import Tutorial from "../components/Tutorrial.vue";
import LevelButton from "../components/Level-Button.vue";
import { onBeforeUnmount, onBeforeMount, ref, onBeforeUpdate } from "vue";
import LgButton from "../components/Lg-Button.vue";
import { useRouter } from "vue-router";
import API from "../components/api";

const props = defineProps({
  language: String,
});

const api = new API()

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
const goToGame = async (level) => {
  await api.Play()
  emit('toGame')
  Router.push({ name: "Game", params: { level: level } });
};
</script>

<template>
  <div class="body-title text-center">
    <Tutorial v-if="isOpen" @closed="openHtp()" />
    <div class="title">
      <div class="logo-game absolute"></div>
      <div class="play absolute space-y-3">
        <div class="flex justify-center" @click="goToGame(1)">
          <div class="play-btn"></div>
        </div>
        <div @click="openHtp()" class="flex justify-center items-center space-x-1">
          <div class="htp-btn"></div>
          <div class="font-medium">{{ language === "TH" || language === null ? "วิธีการเล่น" : "How to play" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body-title {
  height: 100%;
  background-image: url(../assets/trapthecat_asset/home_bg.png);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}

.logo-game {
  left: 50%;
  top: 15%;
  transform: translate(-50%, -5%);
  width: 250px;
  height: 135px;
  background-image: url(../assets/trapthecat_asset/logo.png);
  background-size: 100% 100%;
}

.title {
  height: 100%;
  left: 50%;
}

.play {
  bottom: 20%;
  left: 50%;
  transform: translate(-50%, 100%);
}

.play-btn {
  width: 142px;
  height: 51.57px;
  background-image: url(../assets/trapthecat_asset/play_ic.svg);
  background-size: cover;
}

.htp-btn {
  width: 17px;
  height: 17px;
  background-image: url(../assets/trapthecat_asset/info_ic.svg);
  background-size: 100% 100%;
}

.font-medium {
  font-size: 15px;
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
