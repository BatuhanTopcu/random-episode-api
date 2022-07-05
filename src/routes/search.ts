import Router from "express";
import redis, { ready } from "../redis";
import axios_t from "../axios_token";
const router = Router();

router.get("/", async (req, res) => {
  const text = req.query.text;
  if (!text) {
    res.status(500).send("No text provided");
  }
  try {
    if (!ready) {
      const data = (await axios_t.get(`/search/tv?query=${text}`)).data;
      res.send(data);
    }
    const value = await redis.get(`search?text=${text}`);
    if (value) {
      res.send(JSON.parse(value));
    } else {
      const data = (await axios_t.get(`/search/tv?query=${text}`)).data;
      await redis.set(`search?text=${text}`, JSON.stringify(data));
      res.send(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export default router;
