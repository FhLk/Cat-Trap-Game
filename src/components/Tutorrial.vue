<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css";

const modules = ref([Pagination]);

const information = ref([
  { tile: "CAT", img: "./assets/cat/catBear/cat.png" },
  { tile: "WAY", img: "./hexagon.svg" },
  { tile: "BLOCK", img: "./hexagon-grey.svg" },
]);

const emit = defineEmits(["closed"]);
</script>

<template>
  <div class="bg-tutorial absolute h-screen">
    <swiper class="rounded-2xl" :pagination="true" :modules="modules">
      <swiper-slide>
        <div class="text-center">
          <p class="text-base font-medium">
            Don't let the cat get away, By placing blocks to keep the cat away
            in 10 second, By placing a block 1 time, the cat moves 1 time.
          </p>
          <p class="text-base font-bold">
            {{ ">>" }}
            <span class="underline">
              {{ "Left-click is to place a block." }}</span
            >
            {{ "<<" }}
          </p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <div class="flex justify-center">
            <img src="../assets/example.png" class="board-example rounded-lg" />
          </div>
          <p class="font-medium">Area of Cat (11x11)</p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="flex space-x-7">
          <div class="cat"></div>
          <div class="way"></div>
          <div class="block"></div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div>
          <button
            @click="$emit('closed')"
            type="button"
            class="bg-blue-600 p-3 text-white font-medium text-2xl leading-tight uppercase rounded-lg shadow-md hover:bg-purple-500"
          >
            Closed
          </button>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
.cat {
  background-image: url(../assets/cat/cat-sit.png);
  background-size: 70px;
  height: 70px;
  width: 70px;
}

.way {
  background-image: url(../assets/hexagon-white.svg);
  background-size: 70px;
  height: 70px;
  width: 70px;
}

.block {
  background-image: url(../assets/hexagon.svg);
  background-size: 70px;
  height: 70px;
  width: 70px;
}
.bg-tutorial {
  z-index: 1;
  background-color: rgb(0, 0, 0, 0.8);
  width: 100%;
}
.swiper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #a1dd9f;
  height: 400px;
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
