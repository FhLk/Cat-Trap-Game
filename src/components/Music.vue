<script>
export default {
  data() {
    return {
      musicSrc: './bg-music.mp3',
      isPlaying: false
    }
  },
  mounted() {
    this.music = this.$refs.music
  },
  methods: {
    toggleMusic() {
      if (!this.music) {
        return
      }

      if (this.isPlaying) {
        this.music.pause()
      } else {
        this.music.play()
      }
      this.isPlaying = !this.isPlaying
    }
  }
}
</script>

<template>
  <div>
    <div class="flex justify-center">
      <button
      @click="toggleMusic"
      class="bg-blue-600 p-3 flex space-x-2 leading-tight rounded-full hover:bg-blue-700">
      <div :class="isPlaying ? 'speaker-icon-on':'speaker-icon-off'"></div>
      <div class="text-white font-medium text-sm">{{ isPlaying ? "On" : "Off" }}</div>
      </button>
    </div>
    <div class="flex justify-center">
      <audio :autoplay="isPlaying" ref="music" :src="musicSrc" loop></audio>
    </div>
  </div>
</template>

<style scoped>
.speaker-icon-on{
  background-image: url(./speaker-on-2.svg);
  width: 20px;
  height: 20px;
  background-size: 20px;
}

.speaker-icon-off{
  background-image: url(./speaker-off.svg);
  width: 20px;
  height: 20px;
  background-size: 20px;
}
</style>
