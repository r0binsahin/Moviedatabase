import { IMovies } from "./IMovies";

export interface IOmdbResponse {
  totalResults: string;
  Search: IMovies[];
}
