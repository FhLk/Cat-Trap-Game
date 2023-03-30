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
      <button
        @click="changeLanguage()"
        :class="`${
          language === `TH` ? 'bg-blue-700' : 'bg-blue-600'
        } p-3 leading-tight rounded-l-md hover:bg-blue-700`"
      >
        <div class="text-white font-medium text-sm">TH</div>
      </button>
      <button
        @click="changeLanguage()"
        :class="`${
          language === `EN` ? 'bg-blue-700' : 'bg-blue-600'
        } p-3 leading-tight rounded-r-md hover:bg-blue-700`"
      >
        <div class="text-white font-medium text-sm">EN</div>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
