<template>
  <div>
    <div>{{ formatTime(timeLeft) }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRunning: false,
      timeLeft: 4 * 60, // seconds
      timerId: null,
    };
  },
  methods: {
    startTimer() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      this.timerId = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.stopTimer();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerId);
      this.isRunning = false;
    },
    resetTimer() {
      this.stopTimer();
      this.timeLeft = 4 * 60;
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },
};
</script>
