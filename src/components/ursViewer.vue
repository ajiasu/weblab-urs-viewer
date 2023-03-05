<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="pa-2 mb-2">
          <v-card-title>Zigaretten</v-card-title>
          <v-card-text>{{ weighings.cigarettes }}</v-card-text>
        </v-card>
        <v-card class="pa-2 mb-2">
          <v-card-title>PET-Deckel</v-card-title>
          <v-card-text>{{ weighings.petCaps }}</v-card-text>
        </v-card>
        <v-card class="pa-2 mb-2">
          <v-card-title>Kronkorken</v-card-title>
          <v-card-text>{{ weighings.crownCorks }}</v-card-text>
        </v-card>
        <v-card class="pa-2 mb-2">
          <v-card-title>Wertgegenstände</v-card-title>
          <v-card-text>{{ weighings.valuables }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-2 mb-2">
          <v-card-title><ursTimer ref="ursTimer" /></v-card-title>
        </v-card>
        <ursCanvas style="display: flex; justify-content: center;" />
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-2 mb-2">
          <v-card-title>Status</v-card-title>
          <v-card-text>{{ status }}</v-card-text>
        </v-card>
        <v-card class="pa-2 mb-2">
          <v-card-title>Stromverbrauch</v-card-title>
          <v-card-text>{{ powerUsage }}</v-card-text>
        </v-card>
        <v-card class="pa-2 mb-2">
          <v-card-title>Aktuelle Position</v-card-title>
          <v-card-text>{{ motordata.x }}, {{ motordata.y }}</v-card-text>
        </v-card>
        <v-btn @click="startSimulation()"> Simulation </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as socketio from "../plugins/socketio";
import * as simulation from "../plugins/simulation";
import axios from "axios";
import ursCanvas from "./ursCanvas.vue";
import ursTimer from "./ursTimer.vue";

const baseUrl = "http://localhost:8000/v1";

export default {
  //name: "RealTimeDemo",
  components: {
    ursCanvas,
    ursTimer,
  },
  data: () => ({
    weighings: {
      cigarettes: 0,
      petCaps: 0,
      valuables: 0,
      crownCorks: 0,
    },
    status: "",
    powerUsage: 0,
    motordata: {
      x: 0,
      y: 0,
    },
  }),
  created() {
    for (let material in this.weighings) {
      axios
        .get(`${baseUrl}/weighings/${material}`)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          eval(
            `this.weighings.${material} = res.data.data.${material}[0].count;`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    axios
      .get(`${baseUrl}/states`)
      .then((res) => {
        this.status = res.data.data.state[0].state;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${baseUrl}/powerUsage`)
      .then((res) => {
        this.powerUsage = res.data.data.powerUsage[0].powerUsage;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${baseUrl}/motordata`)
      .then((res) => {
        this.motordata.x = res.data.data.motordata[0].x;
        this.motordata.y = res.data.data.motordata[0].y;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  mounted() {
    socketio.addEventListener({
      type: "updateWeighings",
      callback: (message) => {
        this.weighings[message.material] = message.count;
      },
    });
    socketio.addEventListener({
      type: "updateStates",
      callback: (message) => {
        this.status = message;
        if (message === "Starting Up") {
          this.$refs.ursTimer.resetTimer();
          this.$refs.ursTimer.startTimer();
        } else if (message === "Stopped") {
          this.$refs.ursTimer.stopTimer();
        }
      },
    });
    socketio.addEventListener({
      type: "updatePowerUsage",
      callback: (message) => {
        this.powerUsage = message;
      },
    });
    socketio.addEventListener({
      type: "updateMotordata",
      callback: (message) => {
        this.motordata = message;
      },
    });
  },
  methods: {
    startSimulation() {
      simulation.start();
    },
  },
};
</script>
<style></style>
