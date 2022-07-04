import { Season } from ".";

export type Show = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  popularity: number;
};

export type ShowDetail = Show & {
  seasons: Season[];
  number_of_episodes: number;
  number_of_seasons: number;
};
