import Router from "express";
import redis from "../redis";
import { getShowDetails, getEpisodeDetails } from "../requests";
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
    return await getShowDetailsEach(show_id);
  });
  const results = await Promise.allSettled(shows_promises);
  console.log(results);
  const shows = results
    .filter((promise) => promise.status === "fulfilled")
    // @ts-ignore
    .map((promise) => promise.value) as ShowDetail[];

  const random_show = shows[Math.floor(Math.random() * shows.length)];
  let random_episode_index = Math.floor(
    Math.random() * random_show.number_of_episodes
  );
  let random_season_index = 1;

  if (random_episode_index < random_show.seasons[0].episode_count) {
    random_season_index = 1;
  } else {
    random_show.seasons.forEach((season, index) => {
      if (random_episode_index > season.episode_count) {
        random_episode_index -= season.episode_count;
        random_season_index = index + 1;
      }
    });
  }
  const episode = await getEpisodeDetails({
    show_id: random_show.id,
    season_number: random_season_index,
    episode_number: random_episode_index,
  });

  const episode_detailed = {
    ...episode,
    show_name: random_show.name,
    show_backdrop_path: random_show.backdrop_path,
    show_poster_path: random_show.poster_path,
  };

  res.send(episode_detailed);
});

const getShowDetailsEach = async (show_id: string): Promise<ShowDetail> => {
  const value = await redis.get(`/show?id=${show_id}`);
  if (value) {
    return JSON.parse(value);
  } else {
    const data = await getShowDetails(show_id);
    if (data) {
      await redis.set(`/show?id=${show_id}`, JSON.stringify(data));
    }
    return data;
  }
};

export default router;
