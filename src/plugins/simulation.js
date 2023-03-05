import axios from "axios";
const baseUrl = "http://localhost:8000/v1";
const maxInterval = 2000;
const minInterval = 500;
var positions = [[]];
var weighings = {
  petCaps: 0,
  crownCorks: 0,
  cigarettes: 0,
  valuables: 0,
};

function sendPostRequestWeighings(material) {
  // erstellt ein Objekt mit einem zufälligen Wert und sendet es an die API
  const payload = { timestamp: Date.now(), count: weighings[material]++ };
  axios
    .post(`${baseUrl}/weighings/${material}`, payload)
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));
}

function sendPostRequestPowerUsage(powerUsage) {
  // erstellt ein Objekt mit einem zufälligen Wert und sendet es an die API
  const payload = { timestamp: Date.now(), powerUsage: powerUsage };
  console.log(payload);
  axios
    .post(`${baseUrl}/powerUsage`, payload)
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));
}

function sendNextPosition() {
  const nextPosition = positions.pop();
  if (nextPosition) {
    const payload = {
      timestamp: Date.now(),
      x: nextPosition[0],
      y: nextPosition[1],
    };
    console.log(payload);
    axios
      .post(`${baseUrl}/motordata`, payload)
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  }
}

function getRandomPowerUsage() {
  return Math.floor(Math.random() * 401 + 200);
}

function getRandomMaterial() {
  const strings = ["petCaps", "crownCorks", "valuables", "cigarettes"];
  const randomIndex = Math.floor(Math.random() * strings.length);
  return strings[randomIndex];
}

function resetWeighings() {
  const initialPayload = { timestamp: Date.now(), count: 0 };
  for (let material in weighings) {
    axios
      .post(`${baseUrl}/weighings/${material}`, initialPayload)
      // eslint-disable-next-line no-unused-vars
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  }
}

export function start() {
  const endTime = Date.now() + 4 * 60 * 1000; // Endzeit in 4 Minuten
  let timeoutIdWeighings;
  let timeoutIdPowerUsage;
  let timeoutIdPositions;

  resetWeighings();
  positions = [
    [10, 10],
    [10, 50],
    [10, 100],
    [30, 100],
    [30, 50],
    [30, 10],
    [60, 10],
    [60, 50],
    [60, 100],
    [100, 100],
    [100, 50],
    [100, 10],
  ];

  axios
    .post(`${baseUrl}/states`, { timestamp: Date.now(), state: "Starting Up" })
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));

  axios
    .post(`${baseUrl}/states`, { timestamp: Date.now(), state: "Running" })
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error));

  function scheduleNextWeighing() {
    // plane den nächsten POST-Aufruf mit einem zufälligen Zeitintervall
    const nextInterval =
      Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    timeoutIdWeighings = setTimeout(() => {
      sendPostRequestWeighings(getRandomMaterial());
      scheduleNextWeighing();
    }, nextInterval);
  }

  function scheduleNextPostition() {
    timeoutIdPositions = setTimeout(() => {
      sendNextPosition();
      scheduleNextPostition();
    }, 3000); 
  }

  function scheduleNextPowerUsage() {
    // plane den nächsten POST-Aufruf mit einem zufälligen Zeitintervall
    const nextInterval =
      Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    timeoutIdPowerUsage = setTimeout(() => {
      sendPostRequestPowerUsage(getRandomPowerUsage());
      scheduleNextPowerUsage();
    }, nextInterval);
  }

  scheduleNextPowerUsage();
  scheduleNextWeighing();
  scheduleNextPostition();

  // stoppt alle geplanten POST-Aufrufe, wenn die Zeit abgelaufen ist
  setTimeout(() => {
    axios
      .post(`${baseUrl}/states`, { timestamp: Date.now(), state: "Stopped" })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
    clearTimeout(timeoutIdWeighings);
    clearTimeout(timeoutIdPowerUsage);
    clearTimeout(timeoutIdPositions);
  }, endTime - Date.now());
}
