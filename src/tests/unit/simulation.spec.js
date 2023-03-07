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
});
