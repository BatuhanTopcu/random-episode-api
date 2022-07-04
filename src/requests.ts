import axios_t from "./axios_token";
import { Episode, Season, ShowDetail } from "./types";

export const getShowDetails = async (show_id: string): Promise<ShowDetail> => {
  const data = (await axios_t.get(`/tv/${show_id}`)).data;
  return {
    id: data.id,
    name: data.name,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    overview: data.overview,
    vote_average: data.vote_average,
    release_date: data.release_date,
    popularity: data.popularity,
    seasons: data.seasons.filter((season: Season) => season.season_number > 0),
    number_of_episodes: data.seasons
      .filter((season: Season) => season.season_number > 0)
      .reduce((acc: number, cur: Season) => acc + cur.episode_count, 0),
    number_of_seasons: data.seasons.filter(
      (season: Season) => season.season_number > 0
    ).length,
  };
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
