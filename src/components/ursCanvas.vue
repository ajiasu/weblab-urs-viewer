<template>
  <div ref="container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as socketio from "../plugins/socketio";

export default {
  name: "ursCanvas",
  data() {
    return {
      canvas: null,
      ctx: null,
      canvasSize: 600,
      positions: [[0, 0]],
    };
  },
  mounted() {
    socketio.addEventListener({
      type: "updateMotordata",
      callback: (message) => {
        const newPosition = [message.x, message.y];
        this.positions.push(newPosition);
        this.draw();
      },
    });
    socketio.addEventListener({
      type: "updateStates",
      callback: (message) => {
        if(message === "Starting Up") {
          this.positions = [[0,0]]
          this.draw();
        }
      },
    });
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      window.addEventListener("resize", this.onWindowResize);
      this.draw();
      this.onWindowResize();
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    draw() {
      // Hintergrund grau machen
      this.ctx.fillStyle = "#e6e6e6";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Linie zeichnen
      this.ctx.beginPath();
      const scaleX = this.canvas.width / this.canvasSize;
      const scaleY = this.canvas.height / this.canvasSize;
      this.ctx.moveTo(this.positions[0][0] * scaleX, this.positions[0][1] * scaleY);
      for (let i = 1; i < this.positions.length; i++) {
        this.ctx.lineTo(this.positions[i][0] * scaleX, this.positions[i][1] * scaleY);
      }
      // Linienfarbe auf rot setzen
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 5;
      this.ctx.stroke();
    },
    onWindowResize() {
      const container = this.$refs.container;
      const containerSize = Math.min(
        container.clientWidth,
        container.clientHeight
      );
      this.canvasSize = containerSize;
      this.canvas.width = containerSize;
      this.canvas.height = containerSize;
      this.draw();
    },
  },
  watch: {
    canvasSize() {
      this.draw();
    },
  },
};
</script>
