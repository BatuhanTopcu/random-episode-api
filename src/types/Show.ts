import { Season } from ".";

export type Show = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  popularity: number;
};

export type ShowDetail = Show & {
  release_date: string;
  seasons: Season[];
  number_of_episodes: number;
  number_of_seasons: number;
};
