import axios from "axios";
import { IMovies } from "../models/IMovies";
import { IMovieExtented } from "../models/IMoviesExtended";
import { IOmdbResponse } from "../models/IOmdbResponse";

export async function searchMovies(
  searchText: string,
  currentPage: number
): Promise<IMovies[]> {
  let response = await axios.get<IOmdbResponse>(
    `http://omdbapi.com?s=${searchText}&apikey=${process.env.APIKEY}&page=${currentPage}`
  );

  return response.data.Search;
}

export async function moreAboutMovies(movie: string): Promise<IMovieExtented> {
  let response = await axios.get<IMovieExtented>(
    `http://www.omdbapi.com/?apikey=${process.env.APIKEY}&i=${movie}`
  );

  return response.data;
}
