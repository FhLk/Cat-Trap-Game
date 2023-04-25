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
  <div class="bg-tutorial absolute">
    <swiper class="rounded-2xl" :pagination="true" :modules="modules">
      <swiper-slide>
        <div class="btn absolute flex justify-center items-center">ปิด</div>
      </swiper-slide>
      <swiper-slide>
      </swiper-slide>
      <swiper-slide>
      </swiper-slide>
      <swiper-slide>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
.bg-tutorial {
  z-index: 1;
  background-color: rgb(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
}

.swiper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 266px;
  height: 351px;
  background-image: url(../assets/trapthecat_asset/htp_bg.png);
  background-size: cover;
}

.btn {
  background-image: url(../assets/trapthecat_asset/popup_btn.svg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  width: 169px;
  height: 46.7px;
  bottom: 20%;
  font: normal normal normal 24px/29px DBHeavent;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  height: 400px;
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
