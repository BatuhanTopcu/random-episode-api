import Router from "express";
import { getShowDetails, getRandomEpisode } from "../requests";
import { EpisodeDetail, ShowDetail } from "../types";

const router = Router();

router.get("/", async (req, res) => {
  const query_shows_ids = req.query.show_id;
  const count = Number(req.query.count) || 5;
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

  const episode_promises = [...Array(count).keys()].map(async (_) => {
    return await getRandomEpisode(shows);
  });
  const episode_results = await Promise.allSettled(episode_promises);
  const episodes = episode_results
    .filter((promise) => promise.status === "fulfilled")
    // @ts-ignore
    .map((promise) => promise.value) as EpisodeDetail[];
  res.send(episodes);
});

export default router;
