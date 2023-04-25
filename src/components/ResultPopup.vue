<script setup>
import { onBeforeUpdate, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
let { params } = useRoute();

const props = defineProps({
    isResult : Boolean,
    isWin : Boolean,
})

const emit = defineEmits(['close','reset','next'])
const level = ref(1);

// const isWin = ref(props.isResult)
onBeforeRouteUpdate(()=>{
    level.value++
})
</script>

<template>
    <div v-if="isResult" class="result-root-div h-full text-center w-full absolute z-10">
        <div class="result-div flex justify-center items-center absolute">
            <div @click="isResult = false,$emit('close')" class="close-btn absolute"></div>
            <div :class="`${isWin ? 'aunjai-win':'aunjai-cry'} absolute`"></div>
            <div class="win-text-header absolute"> {{isWin ? 'ยินดีด้วย':'เสียใจด้วย'}}
                <div class="win-text-body">{{ isWin ? 'คุณชนะ สามารถดักจับแมวได้':'คุณแพ้ ลองใหม่อีกครั้ง' }}</div>
            </div>
            <div @click="isWin ? `${level !==3 ? $emit('next'):$emit('close')}`:$emit('reset')" class="btn absolute flex justify-center items-center">{{isWin ? `${level !==3 ? 'เล่นด่านต่อไป':'หน้าแรก'}`:'เล่นใหม่'}}</div>
        </div>
    </div>
</template>

<style scoped>

.result-root-div{
    background-color: rgb(0, 0, 0, 0.8);
}
.aunjai-win {
    background-image: url(../assets/trapthecat_asset/aunjai_happy.png);
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 143px;
    height: 135px;
    top: 0px;
    transform: translate(0%, -60%);
}

.aunjai-cry{
    background-image: url(../assets/trapthecat_asset/Aunjai_Cry.png);
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 124px;
    height: 146px;
    top: 0px;
    transform: translate(0%, -70%);
}

.close-btn {
    background-image: url(../assets/trapthecat_asset/close_ic.svg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    height: 30px;
    width: 30px;
    right: 0px;
    top: 0px;
    transform: translate(8px, -9px);
}

.win-text-header {
    font: normal normal normal 34px/40px DBHeavent;
    top: 50%;
    transform: translateY(-70%);
}

.win-text-body {
    font: normal normal normal 22px/26px DBHeavent;
}

.btn {
    background-image: url(../assets/trapthecat_asset/popup_btn.svg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 169px;
    height: 46.7px;
    bottom: 5%;
    font: normal normal normal 24px/29px DBHeavent;
}

.result-div {
    width: 266px;
    height: 206px;
    background: transparent linear-gradient(180deg, #E6F5BB 0%, #FCFCFC 100%) 0% 0% no-repeat padding-box;
    border-radius: 25px;
    opacity: 1;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
}
</style>
