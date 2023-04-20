<script setup>
import { ref, onBeforeMount } from "vue";

const emit = defineEmits(["change"]);

const language = ref(sessionStorage.getItem("language"));
if (language.value === null || language.value === "TH") {
  language.value = "TH";
} else {
  language.value = "EN";
}
const changeLanguage = () => {
  if (language.value === "TH") {
    language.value = "EN";
    sessionStorage.setItem("language", language.value);
  } else {
    language.value = "TH";
    sessionStorage.setItem("language", language.value);
  }
  emit("change", language.value);
};
</script>

<template>
  <div>
    <div class="flex justify-center">
      <div @click="changeLanguage()" v-if="language===`TH`" class="lg-btn-th"></div>
      <div @click="changeLanguage()" v-else class="lg-btn-en"></div>
    </div>
  </div>
</template>

<style scoped>
.lg-btn-th{
  width: 94px;
  height: 37px;
  background-image: url(../assets/trapthecat_asset/th_ic.png);
  background-size: cover;
}
.lg-btn-en{
  width: 94px;
  height: 37px;
  background-image: url(../assets/trapthecat_asset/en_ic.png);
  background-size: cover;
}
</style>
