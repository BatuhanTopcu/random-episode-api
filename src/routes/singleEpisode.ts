import Router from "express";
import redis from "../redis";
import { getShowDetails, getRandomEpisode } from "../requests";
import { ShowDetail } from "../types";
const router = Router();

router.get("/", async (req, res) => {
  const query_shows_ids = req.query.show_id;
  if (!query_shows_ids) {
    res.status(500).send("No show id provided");
    return;
  }
  const show_ids = Array.isArray(query_shows_ids)
    ? (query_shows_ids as string[])
    : [query_shows_ids as string];

  const shows_promises = show_ids.map(async (show_id) => {
    return await getShowDetails(show_id);
  });
  const results = await Promise.allSettled(shows_promises);
  const shows = results
    .filter((promise) => promise.status === "fulfilled")
    // @ts-ignore
    .map((promise) => promise.value) as ShowDetail[];

  const episode = await getRandomEpisode(shows);

  res.send(episode);
});

export default router;
