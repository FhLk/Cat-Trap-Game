<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import "swiper/css/pagination";
import "swiper/css";

const modules = ref([Pagination]);

const emit = defineEmits(["closed"]);
</script>

<template>
  <div class="bg-tutorial absolute">
    <swiper class="rounded-2xl" :pagination="{ clickable: false }" :space-between="50" :modules="modules">
      <swiper-slide>
        <div class="htp-div">
          <div class="space-y-3">
            <div><img class="rounded-2xl" src="../assets/example-2.jpg" width="200" alt=""></div>
            <div class="tutorial-text text-2xl">กดปุ่ม Play เพื่อเล่นเกม</div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="htp-div">
          <div class="space-y-10">
            <div class="flex justify-center"><img class="rounded-2xl" src="../assets/example.png" width="280" alt="">
            </div>
            <div class="tutorial-text text-2xl">กดที่ช่องว่างเพื่อวางสิ่งกีดขวางขังแมว</div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="htp-div">
          <div class="space-y-10">
            <div class="flex justify-center">
              <div class="tutorial-text-time text-5xl absolute"> 10 </div>
              <img src="../assets/trapthecat_asset/time_bar_ic.svg" width="230" alt="">
            </div>
            <div class="tutorial-text text-2xl">ผู้เล่นมีเวลา 10 วินาที ในการวางสิ่งกีดขวาง</div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="htp-div">
          <div class="tutorial-text text-black translate-y text-6xl">ลุยเลย!</div>
          <div class="aunjai-win absolute"></div>
          <div @click="$emit('closed')" class="btn absolute flex justify-center items-center">ปิด</div>
        </div>
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

.htp-div {
  background-image: url(../assets/trapthecat_asset/htp_bg.png);
  background-size: cover;
  background-position: 50%;
  width: 100%;
  max-width: 100%;
  height: 430px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  padding: 2px;
}

.aunjai-win {
  background-image: url(../assets/trapthecat_asset/aunjai_happy.png);
  background-repeat: no-repeat;
  background-attachment: fixed;
  width: 143px;
  height: 135px;
  top: 15%;
  transform: scale(1.6);
}

.tutorial-text-time{
  transform: translate(50%,35%);
  font-family: HelveticaNeue;
  opacity: 1;
}
.tutorial-text {
  font-family: DBHeavent;
  opacity: 1;
}

.translate-y {
  transform: translate(10px, 60px);
}

.swiper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 500px;
}

.btn {
  background-image: url(../assets/trapthecat_asset/popup_btn.svg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  width: 169px;
  height: 46.7px;
  bottom: 18%;
  font: normal normal normal 24px/29px DBHeavent;
}

.swiper-slide {
  padding: 30px;
}
</style>
