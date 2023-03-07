import { start } from "../../plugins/simulation";
import axios from "axios";

jest.mock("axios");

describe("start function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("resets weighings", async () => {
    await start();

    expect(axios.post).toHaveBeenCalledTimes(4);
    expect(axios.post).toHaveBeenNthCalledWith(1, "http://localhost:8000/v1/weighings/petCaps", {
      timestamp: expect.any(Number),
      count: 0,
    });
    expect(axios.post).toHaveBeenNthCalledWith(2, "http://localhost:8000/v1/weighings/crownCorks", {
      timestamp: expect.any(Number),
      count: 0,
    });
    expect(axios.post).toHaveBeenNthCalledWith(3, "http://localhost:8000/v1/weighings/cigarettes", {
      timestamp: expect.any(Number),
      count: 0,
    });
    expect(axios.post).toHaveBeenNthCalledWith(4, "http://localhost:8000/v1/weighings/valuables", {
      timestamp: expect.any(Number),
      count: 0,
    });
  });

  test("schedules next power usage", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    await start();

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
  });

  test("schedules next weighing", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    await start();

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
  });

  test("schedules next position", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    await start();

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000);
  });

  test("stops all scheduled posts when time expires", async () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    await start();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(3);
  });
});
