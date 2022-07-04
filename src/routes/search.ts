import Router from "express";
import redis from "../redis";
import axios_t from "../axios_token";

const router = Router();

router.get("/:text", async (req, res) => {
  await redis.connect();
  const value = await redis.get(`/search/tv?query=${req.params.text}`);
  if (value) {
    res.send(JSON.parse(value));
  } else {
    const data = await axios_t.get(`/search/tv?query=${req.params.text}`);
    await redis.set(
      `/search/tv?query=${req.params.text}`,
      JSON.stringify(data.data)
    );
    res.send(data.data);
  }
  await redis.disconnect();
});

export default router;
