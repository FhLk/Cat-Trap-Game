<script setup>
import { ref, onBeforeMount } from "vue";

const language = ref(localStorage.getItem("language"));
onBeforeMount(()=>{
    if(localStorage.getItem("language")=== null){
        localStorage.setItem("language","TH")
        language.value = localStorage.getItem("language")
    }
    else{
        localStorage.setItem("language",language.value)
        language.value = localStorage.getItem("language")
    }
})
const  changeLanguage = ()=>{
    if(language.value === "TH"){
        language.value = "EN"
        localStorage.setItem("language",language.value)
    }
    else{
        language.value = "TH"
        localStorage.setItem("language",language.value)
    }
}
</script>

<template>
  <div>
    <div class="flex justify-center">
      <button @click="changeLanguage()"
        :class="`${
          language === `TH` ? 'bg-blue-700' : 'bg-blue-600'
        } p-3 leading-tight rounded-l-md hover:bg-blue-700`"
      >
        <div class="text-white font-medium text-sm">TH</div>
      </button>
      <button @click="changeLanguage()"
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
