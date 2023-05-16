<script setup>
</script>

<template>
  <div class="bg-loading w-full p-5">
    <div class="space-y-5 w-full">
      <div class="flex justify-center text-3xl font-medium">
        <p>Loading...</p>
      </div>
      <div class="relative">
        <div class="loading-bg absolute bg-gray-300 rounded-full">
          <div class="rounded-full loading-progress"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-loading{
  height: 100vh;
  transform: translate(0, 30%);
}
.loading-bg {
  padding: 5px;
  width: 100%;
  height: 50px;
  border: 5px rgb(0, 0, 0) solid;
}

.loading-progress {
  border-radius: 50px;
  height: 30px;
  background: transparent linear-gradient(270deg, #009d51 0%, #9ac455 100%) 0%
    0% no-repeat padding-box;
  animation: loading-animation 2s linear normal;
}

@keyframes loading-animation {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}
</style>
