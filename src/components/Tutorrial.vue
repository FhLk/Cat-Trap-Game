<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const information = ref([
  { tile: "CAT", img: "./hexagon-red.svg" },
  { tile: "WAY", img: "./hexagon.svg" },
  { tile: "BLOCK", img: "./hexagon-grey.svg" },
]);
</script>

<template>
  <swiper class="header-htp">
    <swiper-slide>Slide 1</swiper-slide>
    <swiper-slide>Slide 2</swiper-slide>
    <swiper-slide>Slide 3</swiper-slide>
    <swiper-slide>
      <button
        type="button"
        class="bg-blue-600 p-3 text-white font-medium text-2xl leading-tight uppercase rounded-lg shadow-md hover:bg-purple-500"
      >
        Closed
      </button>
    </swiper-slide>
  </swiper>
  <!-- <div class="bg-white rounded-lg p-10 py-3 space-y-3">
    <h1 class="text-lg font-medium">How To Play</h1>
    <div class="text-center">
      <p class="text-base font-medium">
        Don't let the cat get away, By placing blocks to keep the cat away in 60
        second, By placing a block 1 time, the cat moves 1 time.
      </p>
      <p class="text-base font-bold">
        {{ ">>" }}
        <span class="underline"> {{ "Left-click is to place a block." }}</span>
        {{ "<<" }}
      </p>
    </div>
    <div>
      <div class="flex justify-center">
        <img src="../assets/example.png" class="board-example rounded-lg" />
      </div>
      <p class="font-medium">Area of Cat (11x11)</p>
    </div>
    <div class="flex justify-evenly">
      <div v-for="(info, index) in information" :key="index">
        <div class="flex justify-around">
          <img :src="info.img" class="hexagon" />
        </div>
        <p class="font-medium">{{ info.tile }}</p>
      </div>
    </div>
  </div> -->
</template>

<style scoped>
.close-btn {
  /* font-size: ; */
}
.header-htp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.swiper {
  width: 20%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  height: 400px;
  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.board-example {
  width: 250px;
  height: 200px;
}

.text-lg {
  font-size: 200%;
}

.hexagon {
  width: 50px;
  height: 50px;
}

@media (min-width: 768px) {
  .hexagon {
    width: 70px;
    height: 70px;
  }
}
</style>
