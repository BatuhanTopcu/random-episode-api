export type Episode = {
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  season_number: number;
  air_date: string;
};

export type EpisodeDetail = Episode & {
  show_name: string;
  show_backdrop_path: string;
  show_poster_path: string;
};
