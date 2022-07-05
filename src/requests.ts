import axios_t from "./axios_token";
import { Episode, EpisodeDetail, Season, ShowDetail } from "./types";
import redis, { ready } from "./redis";

export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getShowDetailsFromTmdb = async (
  show_id: string
): Promise<ShowDetail> => {
  const data = (await axios_t.get(`/tv/${show_id}`)).data;
  const seasons_filtered = data.seasons.filter(
    (season: Season) => season.season_number > 0
  );
  return {
    id: data.id,
    name: data.name,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    overview: data.overview,
    vote_average: data.vote_average,
    release_date: data.release_date,
    popularity: data.popularity,
    seasons: seasons_filtered,
    number_of_episodes: seasons_filtered.reduce(
      (acc: number, cur: Season) => acc + cur.episode_count,
      0
    ),
    number_of_seasons: seasons_filtered.length,
  };
};

export const getShowDetails = async (show_id: string): Promise<ShowDetail> => {
  if (!ready) return await getShowDetailsFromTmdb(show_id);
  const value = await redis.get(`show?id=${show_id}`);
  if (value) {
    return JSON.parse(value);
  } else {
    const data = await getShowDetailsFromTmdb(show_id);
    if (data) {
      await redis.set(`show?id=${show_id}`, JSON.stringify(data));
    }
    return data;
  }
};

export const getEpisodeDetails = async ({
  show_id,
  season_number,
  episode_number,
}: {
  show_id: number;
  season_number: number;
  episode_number: number;
}): Promise<Episode> => {
  const data = (
    await axios_t.get(
      `/tv/${show_id}/season/${season_number}/episode/${episode_number}`
    )
  ).data;
  return {
    id: data.id,
    name: data.name,
    air_date: data.air_date,
    episode_number: data.episode_number,
    season_number: data.season_number,
    vote_average: data.vote_average,
    overview: data.overview,
  };
};

export const getRandomEpisode = async (
  shows: ShowDetail[]
): Promise<EpisodeDetail> => {
  const random_show = shows[Math.floor(Math.random() * shows.length)];
  let random_episode_number = randomIntFromInterval(
    1,
    random_show.number_of_episodes
  );
  let random_season_index = 0;
  while (
    random_episode_number >
    random_show.seasons[random_season_index].episode_count
  ) {
    random_episode_number -=
      random_show.seasons[random_season_index].episode_count;
    random_season_index++;
  }

  const episode = await getEpisodeDetails({
    show_id: random_show.id,
    season_number: random_season_index === 0 ? 1 : random_season_index,
    episode_number: random_episode_number,
  });

  return {
    ...episode,
    show_name: random_show.name,
    show_backdrop_path: random_show.backdrop_path,
    show_poster_path: random_show.poster_path,
  };
};
